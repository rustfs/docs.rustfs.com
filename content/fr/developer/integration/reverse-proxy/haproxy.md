---
title: "HAProxy"
description: "Déployez RustFS derrière HAProxy avec des routes HTTPS distinctes pour l’API S3 et la Console."
---

Utilisez **HAProxy** pour terminer le TLS et acheminer des noms d’hôte distincts vers l’API S3 et la Console de RustFS. Ce déploiement exécute HAProxy et une instance RustFS à nœud unique avec Docker Compose. Vous avez besoin de Docker Engine, de Docker Compose, de deux enregistrements DNS et d’un certificat TLS qui couvre les deux noms d’hôte.

Ce guide utilise ces noms d’hôte d’exemple :

- `s3.example.com` pour l’API S3
- `console.example.com` pour la Console

Remplacez-les par des noms d’hôte qui pointent vers l’hôte Docker.

:::warning[Servir l’API S3 depuis le chemin racine]

Ne publiez pas l’API S3 sous un chemin tel que `/s3/`. AWS Signature Version 4 inclut le chemin et l’hôte de la requête, de sorte que la réécriture de l’une ou l’autre de ces valeurs peut invalider les requêtes signées.

:::

## 1. Créer les répertoires de déploiement

Créez les répertoires de la configuration HAProxy et du certificat TLS :

```bash
mkdir -p rustfs-haproxy/config rustfs-haproxy/certs
cd rustfs-haproxy
```

HAProxy attend la chaîne de certificats et la clé privée dans un seul fichier PEM. Combinez-les dans cet ordre :

```bash
cat fullchain.pem privkey.pem > certs/rustfs.pem
chmod 600 certs/rustfs.pem
```

Le certificat doit couvrir les deux noms d’hôte publics.

## 2. Définir les identifiants RustFS

Créez un fichier d’environnement et remplacez les deux valeurs indicatives d’identifiants :

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

N’ajoutez pas ce fichier ni la clé privée du certificat au dépôt.

## 3. Configurer HAProxy

Créez la configuration HAProxy :

```text title="config/haproxy.cfg"
global
    log stdout format raw local0

defaults
    log global
    mode http
    option httplog
    timeout connect 10s
    timeout client 1h
    timeout server 1h
    timeout http-request 30s
    timeout tunnel 1h

frontend http
    bind :80
    http-request redirect scheme https code 301

frontend https
    bind :443 ssl crt /usr/local/etc/haproxy/certs/rustfs.pem alpn h2,http/1.1

    acl host_s3 hdr(host) -i s3.example.com
    acl host_console hdr(host) -i console.example.com

    use_backend rustfs_s3 if host_s3
    use_backend rustfs_console if host_console
    default_backend reject_unknown_host

backend reject_unknown_host
    http-request deny deny_status 404

backend rustfs_s3
    balance leastconn
    option httpchk GET /health/ready
    http-check expect status 200
    server rustfs rustfs:9000 check inter 10s fall 3 rise 2

backend rustfs_console
    balance leastconn
    cookie RUSTFS_CONSOLE insert indirect nocache secure httponly
    option httpchk GET /rustfs/console/health
    http-check expect status 200
    server rustfs rustfs:9001 check inter 10s fall 3 rise 2 cookie rustfs
```

HAProxy conserve l’hôte entrant et le chemin de la requête, sauf si vous les réécrivez explicitement. Les longs délais d’expiration du client, du serveur et du tunnel permettent les opérations S3 en flux et les connexions WebSocket de la Console.

Le backend de la Console définit un cookie d’affinité. Avec un seul serveur RustFS, il n’a aucun effet sur le routage, mais le conserver dans la configuration de base rend le comportement cohérent lorsque vous ajoutez des nœuds.

## 4. Créer le fichier Compose

Créez les services HAProxy et RustFS :

```yaml title="compose.yaml"
services:
  haproxy:
    image: haproxy:3.2-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro
      - ./certs:/usr/local/etc/haproxy/certs:ro
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

Seul HAProxy publie des ports sur l’hôte. Les ports RustFS `9000` et `9001` restent accessibles à l’intérieur du réseau Compose.

## 5. Valider et démarrer le déploiement

Affichez la configuration Compose résolue et démarrez RustFS :

```bash
docker compose config
docker compose up -d rustfs
```

Validez la configuration HAProxy avec la même image que celle utilisée par le déploiement :

```bash
docker compose run --rm --no-deps haproxy haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg
```

Démarrez HAProxy et vérifiez les deux services :

```bash
docker compose up -d haproxy
docker compose ps
```

Si un service n’atteint pas l’état sain, inspectez ses journaux :

```bash
docker compose logs haproxy
docker compose logs rustfs
```

## 6. Vérifier les deux points de terminaison

Vérifiez l’API et la Console au moyen de leurs noms d’hôte HTTPS publics :

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Configurez les clients S3 avec `https://s3.example.com` comme point de terminaison et activez l’adressage de type chemin (path-style). Ouvrez `https://console.example.com/rustfs/console/` pour vous connecter à la Console.

Lorsque vous remplacez un fichier `certs/rustfs.pem` renouvelé, validez la configuration et recréez le conteneur HAProxy pour le charger :

```bash
docker compose run --rm --no-deps haproxy haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg
docker compose up -d --force-recreate haproxy
```

## Backends multi-nœuds

Pour un déploiement RustFS distribué, ajoutez chaque nœud RustFS aux deux backends :

```text title="config/haproxy.cfg"
backend rustfs_s3
		balance leastconn
		option httpchk GET /health/ready
		http-check expect status 200
		server node1 node1.example.net:9000 check inter 10s fall 3 rise 2
		server node2 node2.example.net:9000 check inter 10s fall 3 rise 2
		server node3 node3.example.net:9000 check inter 10s fall 3 rise 2
		server node4 node4.example.net:9000 check inter 10s fall 3 rise 2

backend rustfs_console
		balance leastconn
		cookie RUSTFS_CONSOLE insert indirect nocache secure httponly
		option httpchk GET /rustfs/console/health
		http-check expect status 200
		server node1 node1.example.net:9001 check inter 10s fall 3 rise 2 cookie node1
		server node2 node2.example.net:9001 check inter 10s fall 3 rise 2 cookie node2
		server node3 node3.example.net:9001 check inter 10s fall 3 rise 2 cookie node3
		server node4 node4.example.net:9001 check inter 10s fall 3 rise 2 cookie node4
```

Le cookie de la Console maintient une connexion OpenID Connect en cours sur le nœud RustFS qui a créé son `state`. Laissez le port `9000` ouvert directement entre les nœuds RustFS, car le RPC interne des nœuds utilise le même écouteur.

## Étapes suivantes

- [Configurer un client S3](/fr/developer/examples/aws-cli)
- [Activer les URL de compartiment (bucket) en adressage de type hôte virtuel](/fr/integration/virtual)
- [Consulter les points de terminaison de contrôle d’intégrité et d’état de préparation](/fr/operations/status-check)