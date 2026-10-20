---
title: "Traefik"
description: "Déployez RustFS derrière Traefik avec un TLS automatique pour des noms d’hôte distincts de l’API S3 et de la Console."
---

Utilisez **Traefik** et son fournisseur Docker pour découvrir RustFS, obtenir des certificats TLS auprès de Let's Encrypt et acheminer des noms d’hôte distincts vers l’API S3 et la Console. Vous avez besoin de Docker Engine, de Docker Compose, d’un serveur public et de deux enregistrements DNS qui pointent vers ce serveur.

Ce guide utilise ces noms d’hôte d’exemple :

- `s3.example.com` pour l’API S3
- `console.example.com` pour la Console

Remplacez-les par vos noms d’hôte publics. Le défi ACME HTTP-01 exige un accès entrant sur les ports `80` et `443`.

:::warning[Servir l’API S3 depuis le chemin racine]

Ne publiez pas l’API S3 sous un chemin tel que `/s3/`. AWS Signature Version 4 inclut le chemin et l’hôte de la requête, de sorte que la réécriture de l’une ou l’autre de ces valeurs peut invalider les requêtes signées.

:::

## 1. Créer le répertoire de déploiement

Créez un répertoire et un fichier de stockage ACME vide. Traefik exige des permissions restrictives sur ce fichier :

```bash
mkdir rustfs-traefik
cd rustfs-traefik
touch acme.json
chmod 600 acme.json
```

## 2. Définir les variables de déploiement

Créez un fichier d’environnement et remplacez chaque valeur :

```ini title=".env"
S3_HOSTNAME=s3.example.com
CONSOLE_HOSTNAME=console.example.com
ACME_EMAIL=admin@example.com
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

Utilisez une adresse e-mail qui reçoit les avis d’expiration de certificat. N’ajoutez pas le fichier `.env` ni `acme.json` au dépôt.

## 3. Créer le fichier Compose

Créez les services Traefik et RustFS :

```yaml title="compose.yaml"
services:
  traefik:
    image: traefik:v3.6.5
    restart: unless-stopped
    command:
      - --log.level=INFO
      - --accesslog=true
      - --providers.docker=true
      - --providers.docker.endpoint=unix:///var/run/docker.sock
      - --providers.docker.exposedbydefault=false
      - --providers.docker.network=rustfs
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
      - --certificatesresolvers.le.acme.email=${ACME_EMAIL}
      - --certificatesresolvers.le.acme.storage=/etc/traefik/acme.json
      - --certificatesresolvers.le.acme.httpchallenge=true
      - --certificatesresolvers.le.acme.httpchallenge.entrypoint=web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./acme.json:/etc/traefik/acme.json
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
    labels:
      - traefik.enable=true
      - traefik.docker.network=rustfs
      - traefik.http.routers.rustfs-s3.rule=Host(`${S3_HOSTNAME}`)
      - traefik.http.routers.rustfs-s3.entrypoints=websecure
      - traefik.http.routers.rustfs-s3.tls=true
      - traefik.http.routers.rustfs-s3.tls.certresolver=le
      - traefik.http.routers.rustfs-s3.service=rustfs-s3
      - traefik.http.services.rustfs-s3.loadbalancer.server.port=9000
      - traefik.http.services.rustfs-s3.loadbalancer.passhostheader=true
      - traefik.http.routers.rustfs-console.rule=Host(`${CONSOLE_HOSTNAME}`)
      - traefik.http.routers.rustfs-console.entrypoints=websecure
      - traefik.http.routers.rustfs-console.tls=true
      - traefik.http.routers.rustfs-console.tls.certresolver=le
      - traefik.http.routers.rustfs-console.service=rustfs-console
      - traefik.http.services.rustfs-console.loadbalancer.server.port=9001
      - traefik.http.services.rustfs-console.loadbalancer.passhostheader=true
    networks:
      - rustfs

volumes:
  rustfs-data:

networks:
  rustfs:
    name: rustfs
```

Les deux routeurs utilisent des règles d’hôte et des ports de backend différents. RustFS ne publie pas les ports `9000` ou `9001` sur l’hôte Docker, et le tableau de bord Traefik n’est pas exposé.

:::note[Accès au socket Docker]

Traefik lit les labels des conteneurs à travers le montage en lecture seule du socket Docker. Toute personne qui peut modifier les charges de travail Docker peut influencer les routes découvertes par le fournisseur Docker. Restreignez l’accès à Docker sur l’hôte du proxy.

:::

## 4. Valider et démarrer le déploiement

Affichez la configuration Compose résolue et vérifiez que toutes les variables sont substituées :

```bash
docker compose config
```

Démarrez les deux services :

```bash
docker compose up -d
docker compose ps
```

Suivez les journaux de Traefik pendant qu’il termine le défi ACME et crée les deux certificats :

```bash
docker compose logs --follow traefik
```

Si l’émission du certificat échoue, vérifiez que les deux enregistrements DNS pointent vers cet hôte et que les ports `80` et `443` sont accessibles depuis Internet. Les limites de débit de Let's Encrypt s’appliquent : corrigez les problèmes de DNS et de pare-feu avant de recréer le déploiement à plusieurs reprises.

## 5. Vérifier les deux points de terminaison

Vérifiez le point de terminaison d’état de préparation de l’API S3 et le point de terminaison de contrôle d’intégrité de la Console à travers Traefik :

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Configurez les clients S3 avec `https://s3.example.com` comme point de terminaison et activez l’adressage de type chemin (path-style). Ouvrez `https://console.example.com/rustfs/console/` pour vous connecter à la Console.

## Services multi-nœuds

Pour un cluster RustFS externe à plusieurs nœuds, activez le fournisseur de fichiers de Traefik dans le service `traefik` :

```yaml title="compose.yaml"
services:
  traefik:
    command:
      - --providers.file.filename=/etc/traefik/dynamic.yaml
      - --providers.file.watch=true
    volumes:
      - ./dynamic.yaml:/etc/traefik/dynamic.yaml:ro
```

Créez la configuration dynamique avec chaque nœud RustFS :

```yaml title="dynamic.yaml"
http:
  routers:
    rustfs-s3:
      rule: Host(`s3.example.com`)
      entryPoints:
        - websecure
      service: rustfs-s3
      tls:
        certResolver: le
    rustfs-console:
      rule: Host(`console.example.com`)
      entryPoints:
        - websecure
      service: rustfs-console
      tls:
        certResolver: le

  services:
    rustfs-s3:
      loadBalancer:
        passHostHeader: true
        healthCheck:
          path: /health/ready
          interval: 10s
          timeout: 5s
        servers:
          - url: http://node1.example.net:9000
          - url: http://node2.example.net:9000
          - url: http://node3.example.net:9000
          - url: http://node4.example.net:9000
    rustfs-console:
      loadBalancer:
        passHostHeader: true
        sticky:
          cookie:
            name: rustfs_console
            secure: true
            httpOnly: true
        healthCheck:
          path: /rustfs/console/health
          interval: 10s
          timeout: 5s
        servers:
          - url: http://node1.example.net:9001
          - url: http://node2.example.net:9001
          - url: http://node3.example.net:9001
          - url: http://node4.example.net:9001
```

Configurez les sessions persistantes (sticky sessions) du service de la Console lorsque vous utilisez OpenID Connect. Une connexion en cours stocke son `state` sur un seul nœud RustFS, et le rappel (callback) doit revenir vers ce nœud. Laissez le port `9000` ouvert directement entre les nœuds RustFS, car le RPC interne des nœuds utilise le même écouteur.

## Étapes suivantes

- [Configurer un client S3](/fr/developer/examples/aws-cli)
- [Activer les URL de compartiment (bucket) en adressage de type hôte virtuel](/fr/integration/virtual)
- [Consulter les points de terminaison de contrôle d’intégrité et d’état de préparation](/fr/operations/status-check)