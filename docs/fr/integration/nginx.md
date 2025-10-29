---
title: "Configuration du Proxy Inverse Nginx pour RustFS"
description: "Configuration pour implémenter un proxy inverse Nginx pour RustFS"
---

# Intégration RustFS avec Nginx

Grâce à l'intégration entre RustFS et Nginx, les fonctionnalités suivantes peuvent être réalisées :

1. Collecte complète des journaux ;
2. Configuration d'équilibrage de charge ;
3. Transfert et analyse d'URL personnalisés ;
4. Interdiction d'URL personnalisée.

## I. Prérequis pour RustFS Nginx

Pour que l'intégration se déroule sans problème, vous devez préparer à l'avance :

1. Le serveur RustFS est installé normalement et démarre correctement ;
2. Déterminer le port de RustFS ;
3. Identification correcte de Nginx ;
4. Confirmer l'adresse IP de RustFS en mode mono-machine ou cluster.

## II. Fichier de Configuration

~~~

upstream rustfs {
   least_conn;
   server 127.0.0.1:9000;
}

upstream rustfs-console {
   least_conn;
   server 127.0.0.1:9001;
}


server {
   listen       80;
   listen  [::]:80;
   server_name  YOUR_DOMAIN;

   # Allow special characters in headers
   ignore_invalid_headers off;
   # Allow any size file to be uploaded.
   # Set to a value such as 1000m; to restrict file size to a specific value
   client_max_body_size 0;
   # Disable buffering
   proxy_buffering off;
   proxy_request_buffering off;

   location / {
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      # Disable Nginx from converting HEAD to GET
      # proxy_cache_convert_head off;

      proxy_connect_timeout 300;
      # Default is HTTP/1, keepalive is only enabled in HTTP/1.1
      proxy_http_version 1.1;
      proxy_set_header Connection "";
      chunked_transfer_encoding off;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";




      proxy_pass http://rustfs; # This uses the upstream directive definition to load balance
   }
}


server {
   listen       8080;
   listen  [::]:8080;
   server_name  YOUR_DOMAIN;

   # Allow special characters in headers
   ignore_invalid_headers off;
   # Allow any size file to be uploaded.
   # Set to a value such as 1000m; to restrict file size to a specific value
   client_max_body_size 0;
   # Disable buffering
   proxy_buffering off;
   proxy_request_buffering off;

   location / {
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      # Disable Nginx from converting HEAD to GET
      # proxy_cache_convert_head off;

      proxy_connect_timeout 300;
      # Default is HTTP/1, keepalive is only enabled in HTTP/1.1
      proxy_http_version 1.1;
      proxy_set_header Connection "";
      chunked_transfer_encoding off;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";




      proxy_pass http://rustfs-console; # This uses the upstream directive definition to load balance
   }
}

~~~