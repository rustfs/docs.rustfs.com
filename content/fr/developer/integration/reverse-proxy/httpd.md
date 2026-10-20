---
title: "Apache HTTP Server"
description: "Déployez RustFS derrière Apache HTTP Server avec une terminaison TLS pour des noms d’hôte distincts de l’API S3 et de la Console."
---

Utilisez **Apache HTTP Server** (httpd) pour terminer le TLS et acheminer des noms d’hôte distincts vers l’API S3 et la Console de RustFS. Ce déploiement exécute httpd et une instance RustFS à nœud unique avec Docker Compose. Vous avez besoin de Docker Engine, de Docker Compose, de deux enregistrements DNS et d’un certificat TLS qui couvre les deux noms d’hôte.

Ce guide utilise ces noms d’hôte d’exemple :

- `s3.example.com` pour l’API S3
- `console.example.com` pour la Console

Remplacez-les par des noms d’hôte qui pointent vers l’hôte Docker.

:::warning[Servir l’API S3 depuis le chemin racine]

Ne publiez pas l’API S3 sous un chemin tel que `/s3/`. AWS Signature Version 4 inclut le chemin et l’hôte de la requête, de sorte que la réécriture de l’une ou l’autre de ces valeurs peut invalider les requêtes signées. Apache réécrit les URL transmises par le proxy, sauf si vous désactivez la canonicalisation, ce que cette configuration fait avec `nocanon`.

:::

## 1. Créer les répertoires de déploiement

Créez les répertoires de la configuration httpd et du certificat TLS :

```bash
mkdir -p rustfs-httpd/config rustfs-httpd/certs
cd rustfs-httpd
```

Copiez votre chaîne de certificats et votre clé privée dans `certs/` :

```text
rustfs-httpd/
├── certs/
│   ├── fullchain.pem
│   └── privkey.pem
└── config/
```

Restreignez l’accès à la clé privée :

```bash
chmod 600 certs/privkey.pem
```

Le certificat doit couvrir les deux noms d’hôte publics.

## 2. Définir les identifiants RustFS

Créez un fichier d’environnement et remplacez les deux valeurs indicatives d’identifiants :

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

N’ajoutez pas ce fichier au dépôt.

## 3. Construire l’image httpd

L’image `httpd` d’origine est livrée avec ses modules de proxy et de TLS commentés. Construisez une petite image qui les active et charge les hôtes virtuels RustFS :

```dockerfile title="Dockerfile"
FROM httpd:2.4-alpine

# The stock httpd image disables the proxy and TLS modules. Enable the modules
# required to terminate TLS and reverse-proxy RustFS, then load the RustFS
# virtual hosts.
RUN sed -i \
      -e 's|^#\(LoadModule socache_shmcb_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_http_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_balancer_module\)|\1|' \
      -e 's|^#\(LoadModule slotmem_shm_module\)|\1|' \
      -e 's|^#\(LoadModule ssl_module\)|\1|' \
      -e 's|^#\(LoadModule http2_module\)|\1|' \
      -e 's|^#\(LoadModule lbmethod_byrequests_module\)|\1|' \
      /usr/local/apache2/conf/httpd.conf \
      && printf '\nInclude conf/rustfs.conf\n' >> /usr/local/apache2/conf/httpd.conf
```

`proxy_balancer`, `slotmem_shm` et `lbmethod_byrequests` ne sont utilisés que par la configuration [multi-nœuds](#backends-multi-nœuds). Les charger sur un déploiement à nœud unique ne pose aucun problème.

## 4. Configurer Apache HTTP Server

Créez la configuration httpd avec un hôte virtuel par point de terminaison RustFS :

```apache title="config/rustfs.conf"
# Global settings shared by the RustFS virtual hosts.
ServerName localhost

# The stock image listens on port 80 only. Open port 443 for TLS.
Listen 443

# S3 transfers can run for hours; do not cut idle-looking connections.
Timeout 600
ProxyTimeout 600

# Share TLS sessions across connections to speed up repeated handshakes.
SSLSessionCache "shmcb:logs/ssl_scache(512000)"

# Drop only genuinely stalled clients: MinRate keeps slow-but-steady uploads
# alive while data keeps flowing.
RequestReadTimeout header=30-60,MinRate=500 body=60,MinRate=512

# Accept request bodies of any size (the default, stated explicitly).
LimitRequestBody 0

# Redirect every plain-HTTP request to HTTPS.
<VirtualHost *:80>
    ServerName s3.example.com
    Redirect permanent / https://s3.example.com/
</VirtualHost>

<VirtualHost *:80>
    ServerName console.example.com
    Redirect permanent / https://console.example.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName s3.example.com

    Protocols h2 http/1.1
    SSLEngine on
    SSLCertificateFile /usr/local/apache2/certs/fullchain.pem
    SSLCertificateKeyFile /usr/local/apache2/certs/privkey.pem

    # AWS Signature Version 4 signs the Host header and the request path.
    # Keep the client's Host, leave the path uncanonicalized, and allow
    # encoded slashes so that signed requests stay valid.
    ProxyPreserveHost On
    ProxyRequests Off
    AllowEncodedSlashes NoDecode

    # Apache does not set X-Forwarded-Proto; declare it explicitly.
    # ProxyAddHeaders (default On) adds X-Forwarded-For/Host/Server.
    RequestHeader set X-Forwarded-Proto "https"

    # nocanon passes the request path to RustFS unchanged.
    ProxyPass / http://rustfs:9000/ nocanon
    ProxyPassReverse / http://rustfs:9000/
</VirtualHost>

<VirtualHost *:443>
    ServerName console.example.com

    Protocols h2 http/1.1
    SSLEngine on
    SSLCertificateFile /usr/local/apache2/certs/fullchain.pem
    SSLCertificateKeyFile /usr/local/apache2/certs/privkey.pem

    ProxyPreserveHost On
    ProxyRequests Off

    RequestHeader set X-Forwarded-Proto "https"

    # upgrade=websocket tunnels Console WebSocket upgrades end to end;
    # regular requests continue to use plain HTTP forwarding.
    ProxyPass / http://rustfs:9001/ upgrade=websocket
    ProxyPassReverse / http://rustfs:9001/
</VirtualHost>
```

`Listen 443` est obligatoire, car le fichier `httpd.conf` d’origine n’ouvre que le port `80` ; les hôtes virtuels à eux seuls n’ouvrent pas de ports. Les deux blocs `VirtualHost *:80` redirigent tout le trafic HTTP en clair vers HTTPS avec des noms d’hôte cibles explicites.

## 5. Créer le fichier Compose

Créez les services httpd et RustFS :

```yaml title="compose.yaml"
services:
  httpd:
    build: .
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/rustfs.conf:/usr/local/apache2/conf/rustfs.conf:ro
      - ./certs:/usr/local/apache2/certs:ro
    networks:
      - rustfs

  rustfs:
    image: rustfs/rustfs:latest
    restart: unless-stopped
    environment:
      RUSTFS_ACCESS_KEY: ${RUSTFS_ACCESS_KEY}
      RUSTFS_SECRET_KEY: ${RUSTFS_SECRET_KEY}
      RUSTFS_CONSOLE_ENABLE: "true"
      RUSTFS_ADDRESS: ":9000"
      RUSTFS_CONSOLE_ADDRESS: ":9001"
      RUSTFS_OBS_LOGGER_LEVEL: error
      RUSTFS_OBS_LOG_DIRECTORY: /logs
    expose:
      - "9000"
      - "9001"
    volumes:
      - rustfs-data:/data
    healthcheck:
      test: ["CMD-SHELL", "curl --fail http://127.0.0.1:9000/health/ready && curl --fail http://127.0.0.1:9001/rustfs/console/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    networks:
      - rustfs

volumes:
  rustfs-data:

networks:
  rustfs:
```

Seul httpd publie des ports sur l’hôte. Les ports RustFS `9000` et `9001` restent accessibles à l’intérieur du réseau Compose.

:::note[Répertoire de journaux RustFS]

`RUSTFS_OBS_LOG_DIRECTORY` doit pointer vers un répertoire que le conteneur peut créer. L’image RustFS s’exécute sous un utilisateur non root : le chemin `/logs` fonctionne, alors que les chemins sous `/var/log` font quitter le conteneur au démarrage avec `Permission denied`.

:::

## 6. Valider et démarrer le déploiement

Affichez la configuration Compose résolue et démarrez RustFS :

```bash
docker compose config
docker compose up -d rustfs
```

Validez la configuration httpd avec la même image que celle utilisée par le déploiement :

```bash
docker compose run --rm --no-deps httpd httpd -t
```

Démarrez httpd et vérifiez les deux services :

```bash
docker compose up -d httpd
docker compose ps
```

Si un service n’atteint pas l’état sain, inspectez ses journaux :

```bash
docker compose logs httpd
docker compose logs rustfs
```

## 7. Vérifier les deux points de terminaison

Vérifiez l’API et la Console au moyen de leurs noms d’hôte HTTPS publics :

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Configurez les clients S3 avec `https://s3.example.com` comme point de terminaison et activez l’adressage de type chemin (path-style). Ouvrez `https://console.example.com/rustfs/console/` pour vous connecter à la Console.

:::note[Chemin racine de la Console]

Dans RustFS v2.x, la Console est servie sous le préfixe de chemin `/rustfs/console/`. Une requête vers le chemin racine du nom d’hôte de la Console renvoie une réponse XML de refus d’accès de style S3, ce qui est attendu.

:::

Lorsque vous remplacez un certificat renouvelé ou une clé renouvelée dans `certs/`, validez la configuration et rechargez httpd en douceur, sans interrompre les transferts en cours :

```bash
docker compose exec httpd httpd -t
docker compose exec httpd httpd -k graceful
```

## Comment cette configuration préserve les signatures S3

AWS Signature Version 4 signe la méthode HTTP, l’en-tête `Host` et le chemin brut de la requête. Chacune des directives ci-dessous conserve l’une de ces valeurs identique, octet pour octet, entre le client et RustFS :

- **`ProxyPreserveHost On`** conserve l’en-tête `Host` du client. Avec la valeur par défaut (`Off`), Apache réécrit `Host` vers l’hôte du backend et RustFS répond `SignatureDoesNotMatch`.
- **`nocanon`** sur la ligne `ProxyPass` transmet le chemin de la requête à RustFS sans canonicalisation d’URL. Sans cette option, Apache réécrit les chemins pendant la transmission (par exemple en contractant `//`), et plus aucun chemin signé ne correspond.
- **`AllowEncodedSlashes NoDecode`** permet aux clés d’objet contenant `%2F` d’atteindre les gestionnaires du proxy au lieu de renvoyer `404`, et conserve l’encodage intact.
- **`RequestHeader set X-Forwarded-Proto "https"`** indique à RustFS le schéma d’origine. `ProxyAddHeaders` d’Apache (valeur par défaut `On`) ajoute `X-Forwarded-For`, `X-Forwarded-Host` et `X-Forwarded-Server`, mais pas `X-Forwarded-Proto`.

Les URL présignées, les chargements partitionnés et les chargements POST du navigateur reposent sur la même conservation du chemin et de l’hôte, et n’exigent aucune directive supplémentaire.

L’hôte virtuel de la Console ajoute `upgrade=websocket` à sa ligne `ProxyPass` afin que les mises à niveau WebSocket soient tunnelisées de bout en bout. Depuis la version 2.4.47, `mod_proxy_http` gère lui-même la mise à niveau et ne tunnelise que les connexions que le backend accepte avec `101 Switching Protocols` ; le module plus ancien `mod_proxy_wstunnel` est obsolète.

## Corps de requête, objets volumineux et délais d’expiration

Apache transmet les corps de requête à RustFS sans limite de taille et sans les écrire sur le disque du proxy. Les corps qui arrivent avec un `Content-Length` (ce qu’envoient l’AWS CLI, les SDK AWS et `mc`) passent en flux à mesure qu’ils arrivent. Les corps qui arrivent avec `Transfer-Encoding: chunked` sont également transmis en encodage fragmenté (chunked), ce que RustFS rejette — voir les avertissements ci-dessous.

Les directives de délai d’expiration cèdent une part de sécurité pour permettre les transferts longs :

- **`Timeout 600`** couvre les E/S de la connexion dans les deux sens, de sorte que les téléchargements et les chargements lents ne sont pas coupés en plein transfert.
- **`ProxyTimeout 600`** applique le même budget à la connexion avec RustFS.
- **`RequestReadTimeout`** limite les clients lents sans pénaliser les clients réguliers : une requête n’est abandonnée que lorsque les en-têtes restent bloqués ou que le débit du corps passe sous `MinRate`.
- **`LimitRequestBody 0`** énonce explicitement la valeur par défaut : les corps de requête de toute taille sont acceptés.

:::warning[Les chargements doivent comporter un Content-Length]

RustFS rejette les corps de requête transmis en `Transfer-Encoding: chunked` avec `400 UnexpectedContent` (`This request does not support content.`). Les clients doivent charger avec un `Content-Length`. Tous les principaux clients S3 le font sans réglage supplémentaire, de sorte que cela ne concerne que les scripts HTTP écrits à la main qui envoient un flux depuis un tube (pipe). Le traitement par défaut des corps dans Apache convertit en mémoire les petits corps fragmentés en `Content-Length`, mais transmet les corps volumineux sous forme fragmentée : un tel client peut donc sembler fonctionner pour les petits fichiers et échouer pour les gros. `SetEnv proxy-sendcl 1` convertit les corps fragmentés en `Content-Length` en solution de repli — au prix d’écrire d’abord chaque corps sur le disque du proxy.

:::

:::warning[URL présignées et en-tête Content-Type]

Une URL présignée fixe les en-têtes couverts par sa signature. Si l’URL a été générée sans `Content-Type`, le chargement ne doit pas en ajouter — RustFS répond `403 SignatureDoesNotMatch` pour l’en-tête non signé. Notez que `curl -d` et `curl --data-binary` ajoutent d’eux-mêmes `Content-Type: application/x-www-form-urlencoded`. Lorsque le chargement envoie un `Content-Type`, présignez l’URL avec la même valeur (le paramètre `ContentType` des SDK AWS) et faites correspondre la requête exactement à cette valeur.

:::

## Réglages inadaptés à RustFS

Les valeurs par défaut et les options Apache suivantes cassent la sémantique S3 ou gaspillent des ressources. Cette configuration les évite toutes.

| Réglage | Effet sur RustFS |
| --- | --- |
| `ProxyPreserveHost Off` (valeur par défaut) | Réécrit `Host` ; les requêtes signées échouent avec `SignatureDoesNotMatch`. |
| `ProxyPass` sans `nocanon` | Canonicalise le chemin de la requête ; la vérification des chemins signés échoue. |
| `AllowEncodedSlashes Off` (valeur par défaut) | Renvoie `404` pour les clés d’objet contenant `%2F`. |
| Préfixes de chemin (`ProxyPass /s3/`, `Alias`, règles de réécriture) | Réécrit le chemin de la requête ; conservez l’API S3 sur le chemin racine. |
| `ProxyErrorOverride On` | Remplace les erreurs XML S3 de RustFS par des pages d’erreur Apache ; les SDK S3 ne peuvent pas les analyser. |
| `SetEnv proxy-sendcl 1`, `SetEnv force-proxy-request-1.0 1` | Force un `Content-Length` vers l’amont et écrit sur disque les corps de requête fragmentés avant de les transmettre. Cela sauve les clients qui n’envoient que du contenu fragmenté, mais ajoute des E/S disque aux chargements volumineux. |
| `SetEnv proxy-sendchunked 1` | Force un encodage fragmenté vers l’amont, que RustFS rejette avec `400 UnexpectedContent`. |
| `mod_proxy_wstunnel` (`ProxyPass ... ws://`) | Obsolète depuis la version 2.4.47 ; utilisez `upgrade=websocket` sur `mod_proxy_http` à la place. |

Deux limites propres à RustFS méritent d’être signalées, car aucun réglage de proxy ne peut les lever :

- Les clés d’objet qui contiennent des segments de chemin vides (`//`) ou constitués d’un point (`.`) sont rejetées avec `InvalidArgument`, même sans proxy.
- Dans RustFS v2.x, la Console est servie sous `/rustfs/console/` ; le chemin racine de la Console répond avec du XML de style S3.

## Backends multi-nœuds

Pour un déploiement RustFS distribué, remplacez chaque cible `ProxyPass` unique par un équilibreur qui liste tous les nœuds RustFS. Remplacez le bloc de proxy de l’hôte virtuel S3 par :

```apache title="config/rustfs.conf"
    <Proxy "balancer://s3">
        BalancerMember http://node1.example.net:9000 route=node1
        BalancerMember http://node2.example.net:9000 route=node2
        BalancerMember http://node3.example.net:9000 route=node3
        BalancerMember http://node4.example.net:9000 route=node4
        ProxySet lbmethod=byrequests
    </Proxy>
    ProxyPass / balancer://s3/ nocanon
    ProxyPassReverse / balancer://s3/
```

Remplacez le bloc de proxy de l’hôte virtuel de la Console par :

```apache title="config/rustfs.conf"
    # Keep an in-progress login on the node that created its state.
    Header add Set-Cookie "ROUTEID=.%{BALANCER_WORKER_ROUTE}e; path=/" env=BALANCER_ROUTE_CHANGED

    <Proxy "balancer://console">
        BalancerMember http://node1.example.net:9001 route=node1 upgrade=websocket
        BalancerMember http://node2.example.net:9001 route=node2 upgrade=websocket
        BalancerMember http://node3.example.net:9001 route=node3 upgrade=websocket
        BalancerMember http://node4.example.net:9001 route=node4 upgrade=websocket
        ProxySet stickysession=ROUTEID
    </Proxy>
    ProxyPass / balancer://console/
    ProxyPassReverse / balancer://console/
```

Le cookie `ROUTEID` maintient une connexion OpenID Connect en cours sur le nœud RustFS qui a créé son `state`. Conservez `upgrade=websocket` sur chaque ligne `BalancerMember` ; `ProxySet` n’accepte pas ce paramètre. Laissez le port `9000` ouvert directement entre les nœuds RustFS, car le RPC interne des nœuds utilise le même écouteur.

## Étapes suivantes

- [Configurer un client S3](/fr/developer/examples/aws-cli)
- [Activer les URL de compartiment (bucket) en adressage de type hôte virtuel](/fr/integration/virtual)
- [Consulter les points de terminaison de contrôle d’intégrité et d’état de préparation](/fr/operations/status-check)
