---
title: "Caddy"
description: "Déployez RustFS derrière Caddy avec un HTTPS automatique pour des noms d’hôte distincts de l’API S3 et de la Console."
---

Utilisez **Caddy** pour obtenir et renouveler automatiquement les certificats TLS, et pour acheminer des noms d’hôte distincts vers l’API S3 et la Console de RustFS. Ce déploiement exécute Caddy et une instance RustFS à nœud unique avec Docker Compose. Vous avez besoin de Docker Engine, de Docker Compose, d’un serveur public et de deux enregistrements DNS qui pointent vers ce serveur.

Ce guide utilise ces noms d’hôte d’exemple :

- `s3.example.com` pour l’API S3
- `console.example.com` pour la Console

Remplacez-les par vos noms d’hôte publics. Les défis ACME par défaut de Caddy exigent un accès entrant sur les ports `80` et `443`.

:::warning[Servir l’API S3 depuis le chemin racine]

Ne publiez pas l’API S3 sous un chemin tel que `/s3/`. AWS Signature Version 4 inclut le chemin et l’hôte de la requête, de sorte que la réécriture de l’une ou l’autre de ces valeurs peut invalider les requêtes signées.

:::

## 1. Créer le répertoire de déploiement

Créez un répertoire pour le déploiement :

```bash
mkdir rustfs-caddy
cd rustfs-caddy
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

Utilisez une adresse e-mail qui reçoit les notifications de certificat. N’ajoutez pas le fichier `.env` au dépôt.

## 3. Configurer Caddy

Créez un Caddyfile avec un bloc de site pour chaque point de terminaison RustFS :

```text title="Caddyfile"
{
		email {$ACME_EMAIL}
}

{$S3_HOSTNAME} {
		reverse_proxy rustfs:9000 {
				health_uri /health/ready
				health_interval 10s
				health_timeout 5s
				health_fails 3
				health_passes 2
				lb_try_duration 5s
		}
}

{$CONSOLE_HOSTNAME} {
		reverse_proxy rustfs:9001 {
				health_uri /rustfs/console/health
				health_interval 10s
				health_timeout 5s
				health_fails 3
				health_passes 2
				lb_try_duration 5s
		}
}
```

Caddy conserve par défaut l’en-tête `Host` entrant, la méthode HTTP et l’URI de la requête. Il transmet aussi les informations du client au moyen des en-têtes `X-Forwarded-*` et gère les mises à niveau WebSocket de la Console sans règles d’en-tête supplémentaires.

## 4. Créer le fichier Compose

Créez les services Caddy et RustFS :

```yaml title="compose.yaml"
services:
  caddy:
    image: caddy:2.10-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    environment:
      S3_HOSTNAME: ${S3_HOSTNAME}
      CONSOLE_HOSTNAME: ${CONSOLE_HOSTNAME}
      ACME_EMAIL: ${ACME_EMAIL}
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config
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
  caddy-data:
  caddy-config:
  rustfs-data:

networks:
  rustfs:
```

Le volume persistant `caddy-data` stocke les certificats, les clés privées et l’état du compte ACME. Sauvegardez ce volume et n’en partagez pas le contenu. Seul Caddy publie des ports sur l’hôte ; RustFS reste accessible à l’intérieur du réseau Compose.

## 5. Valider et démarrer le déploiement

Affichez la configuration Compose résolue et démarrez RustFS :

```bash
docker compose config
docker compose up -d rustfs
```

Validez le Caddyfile avec la même image que celle utilisée par le déploiement :

```bash
docker compose run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile
```

Démarrez Caddy et vérifiez les deux services :

```bash
docker compose up -d caddy
docker compose ps
docker compose logs --follow caddy
```

Caddy obtient les certificats en arrière-plan et redirige les requêtes HTTP vers HTTPS. Si l’émission échoue, vérifiez que les deux enregistrements DNS pointent vers cet hôte, que les ports `80` et `443` sont accessibles et que le volume `caddy-data` est accessible en écriture.

## 6. Vérifier les deux points de terminaison

Vérifiez l’API et la Console au moyen de leurs noms d’hôte HTTPS publics :

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Configurez les clients S3 avec `https://s3.example.com` comme point de terminaison et activez l’adressage de type chemin (path-style). Ouvrez `https://console.example.com/rustfs/console/` pour vous connecter à la Console.

## Upstreams multi-nœuds

Pour un déploiement RustFS distribué, listez chaque nœud dans le bloc de site correspondant :

```text title="Caddyfile"
{$S3_HOSTNAME} {
		reverse_proxy node1.example.net:9000 node2.example.net:9000 node3.example.net:9000 node4.example.net:9000 {
				lb_policy least_conn
				health_uri /health/ready
				health_interval 10s
				health_timeout 5s
				lb_try_duration 5s
		}
}

{$CONSOLE_HOSTNAME} {
		reverse_proxy node1.example.net:9001 node2.example.net:9001 node3.example.net:9001 node4.example.net:9001 {
				lb_policy cookie rustfs_console <your-cookie-secret>
				health_uri /rustfs/console/health
				health_interval 10s
				health_timeout 5s
				lb_try_duration 5s
		}
}
```

Remplacez `<your-cookie-secret>` par un secret aléatoire partagé par toutes les instances Caddy. L’affinité de la Console maintient une connexion OpenID Connect en cours sur le nœud RustFS qui a créé son `state`. Laissez le port `9000` ouvert directement entre les nœuds RustFS, car le RPC interne des nœuds utilise le même écouteur.

## Étapes suivantes

- [Configurer un client S3](/fr/developer/examples/aws-cli)
- [Activer les URL de compartiment (bucket) en adressage de type hôte virtuel](/fr/integration/virtual)
- [Consulter les points de terminaison de contrôle d’intégrité et d’état de préparation](/fr/operations/status-check)