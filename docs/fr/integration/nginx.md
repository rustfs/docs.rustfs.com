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
server {
   listen       8000;
   listen  [::]:8000;