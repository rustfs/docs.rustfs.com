---
title: "Proxy inverse"
description: "Choisissez et configurez un proxy inverse pour l’API S3 et la Console de RustFS."
---

Utilisez un proxy inverse pour exposer l’API S3 et la Console de **RustFS** au moyen de noms d’hôte gérés et de points de terminaison TLS.

Nous recommandons d’utiliser des noms d’hôte distincts pour l’API S3 sur le port `9000` et pour la Console sur le port `9001`. Servez l’API S3 depuis la racine de son nom d’hôte, car les clients S3 signent le chemin de la requête.

## Guides pris en charge

- [Nginx](./nginx.md)
- [Traefik](./traefik.md)
- [Caddy](./caddy.md)
- [HAProxy](./haproxy.md)
- [Envoy](./envoy.md)
- [Apache HTTP Server](./httpd.md)

## Configuration associée

Consultez [Accès par hôte virtuel](/fr/integration/virtual) lorsque les clients accèdent aux compartiments (buckets) par des URL en adressage de type hôte virtuel.