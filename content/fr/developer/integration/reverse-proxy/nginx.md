---
title: "Nginx"
description: "Déployez RustFS derrière Nginx avec des points de terminaison HTTPS distincts pour l’API S3 et la Console."
---

Utilisez **Nginx** pour terminer le TLS et acheminer des noms d’hôte distincts vers l’API S3 et la Console de RustFS. Ce déploiement exécute Nginx et une instance RustFS à nœud unique avec Docker Compose. Vous avez besoin de Docker Engine, de Docker Compose, de deux enregistrements DNS et d’un certificat TLS qui couvre les deux noms d’hôte.

Ce guide utilise ces noms d’hôte d’exemple :

- `s3.example.com` pour l’API S3
- `console.example.com` pour la Console

Remplacez-les par des noms d’hôte qui pointent vers l’hôte Docker.

:::warning[Servir l’API S3 depuis le chemin racine]

Ne publiez pas l’API S3 sous un chemin tel que `/s3/`. AWS Signature Version 4 inclut le chemin et l’hôte de la requête, de sorte que la réécriture de l’une ou l’autre de ces valeurs peut invalider les requêtes signées.

:::

## 1. Créer les répertoires de déploiement

Créez les répertoires de la configuration Nginx et du certificat TLS :

```bash
mkdir -p rustfs-nginx/sites rustfs-nginx/certs
cd rustfs-nginx
```

Copiez votre chaîne de certificats et votre clé privée dans `certs/` :

```text
rustfs-nginx/
├── certs/
│   ├── fullchain.pem
│   └── privkey.pem
└── sites/
```

Restreignez l’accès à la clé privée :

```bash
chmod 600 certs/privkey.pem
```

## 2. Définir les identifiants RustFS

Créez un fichier d’environnement et remplacez les deux valeurs indicatives d’identifiants :

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

N’ajoutez pas ce fichier au dépôt.

## 3. Configurer Nginx

Créez la configuration Nginx :

```nginx title="sites/rustfs.conf"
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      '';
}

upstream rustfs_s3 {
    server rustfs:9000;
    keepalive 32;
}

upstream rustfs_console {
    server rustfs:9001;
    keepalive 16;
}

server {
    listen 80;
    listen [::]:80;
    server_name s3.example.com console.example.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name s3.example.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    ignore_invalid_headers off;
    client_max_body_size 0;
    proxy_buffering off;
    proxy_request_buffering off;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection '';
        proxy_cache_convert_head off;
        proxy_connect_timeout 5s;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        chunked_transfer_encoding off;
        proxy_pass http://rustfs_s3;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name console.example.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    client_max_body_size 0;
    proxy_buffering off;
    proxy_request_buffering off;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_connect_timeout 5s;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_pass http://rustfs_console;
    }
}
```

Le serveur S3 conserve l’hôte et le chemin de la requête d’origine, désactive la mise en tampon des requêtes pour les chargements en flux et ne convertit pas les requêtes `HEAD` signées. Le serveur de la Console transmet aussi les en-têtes de mise à niveau WebSocket. Les deux serveurs gardent un `proxy_connect_timeout` court pour qu’une requête vers un nœud inaccessible échoue ou bascule vers le nœud suivant en quelques secondes, et gardent `proxy_read_timeout` et `proxy_send_timeout` généreux pour que les gros transferts ne soient pas interrompus.

## 4. Créer le fichier Compose

Créez la définition du déploiement :

```yaml title="compose.yaml"
services:
  nginx:
    image: nginx:1.25-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./sites/rustfs.conf:/etc/nginx/conf.d/rustfs.conf:ro
      - ./certs:/etc/nginx/certs:ro
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

Seul Nginx publie des ports sur l’hôte. Les ports RustFS `9000` et `9001` restent accessibles à l’intérieur du réseau Compose.

## 5. Valider et démarrer le déploiement

Validez les deux fichiers de configuration avant de démarrer les services :

```bash
docker compose config
docker compose up -d rustfs
docker compose run --rm --no-deps nginx nginx -t
```

Démarrez Nginx et vérifiez les deux services :

```bash
docker compose up -d nginx
docker compose ps
```

Si un service n’atteint pas l’état sain, inspectez ses journaux :

```bash
docker compose logs nginx
docker compose logs rustfs
```

## 6. Vérifier les deux points de terminaison

Vérifiez l’API et la Console au moyen de leurs noms d’hôte HTTPS publics :

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Configurez les clients S3 avec `https://s3.example.com` comme point de terminaison et activez l’adressage de type chemin (path-style). Ouvrez `https://console.example.com/rustfs/console/` pour vous connecter à la Console.

Lorsque vous remplacez un certificat renouvelé ou une clé renouvelée dans `certs/`, validez la configuration et rechargez Nginx sans interrompre les connexions actives :

```bash
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

## Upstreams multi-nœuds

Pour un déploiement RustFS distribué, remplacez le serveur unique de chaque upstream par tous les nœuds RustFS :

```nginx title="sites/rustfs.conf"
upstream rustfs_s3 {
    least_conn;
    server node1.example.net:9000;
    server node2.example.net:9000;
    server node3.example.net:9000;
    server node4.example.net:9000;
  keepalive 32;
}

upstream rustfs_console {
    ip_hash;
    server node1.example.net:9001;
    server node2.example.net:9001;
    server node3.example.net:9001;
    server node4.example.net:9001;
  keepalive 16;
}
```

L’upstream de la Console utilise l’affinité client, car une connexion OpenID Connect en cours stocke son `state` sur un seul nœud RustFS. Laissez le port `9000` ouvert entre les nœuds RustFS, car le RPC interne des nœuds utilise le même écouteur. Gardez aussi un `proxy_connect_timeout` court ici : avec un délai de connexion long, chaque requête qui arrive sur un nœud en panne reste bloquée des minutes entières pendant que Nginx attend la poignée de main TCP, et les clients expirent avant que Nginx n’essaie le nœud suivant.

## Étapes suivantes

- [Configurer un client S3](/fr/developer/examples/aws-cli)
- [Activer les URL de compartiment (bucket) en adressage de type hôte virtuel](/fr/integration/virtual)
- [Consulter les points de terminaison de contrôle d’intégrité et d’état de préparation](/fr/operations/status-check)