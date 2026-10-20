---
title: "Scanner d’objets"
description: "Ce guide présente le scanner d’objets RustFS, sa conception, son implémentation et sa surveillance."
---

Ce guide décrit la conception et l’implémentation du scanner d’objets RustFS, notamment son fonctionnement avec le codage d’effacement, le nettoyage et la réparation, la planification, les métriques et le dépannage.

## Vue d’ensemble

Le scanner d’objets RustFS est intégré au moteur de stockage. Il vérifie périodiquement l’intégrité des objets et exécute les opérations planifiées.
Le scanner collecte les statistiques d’utilisation des disques, évalue les règles de gestion du cycle de vie, exécute la réplication des objets et déclenche la réparation des données pour les objets corrompus.

## Architecture et principes de conception

### Architecture du scanner

Le scanner RustFS utilise un échantillonnage par hachage : il sélectionne un objet sur 1024 pour inspection, d’après le hachage du nom d’objet, afin de limiter l’impact sur les performances.
Le scanner travaille avec la couche de codage d’effacement : lorsqu’il détecte un fragment (shard) manquant ou corrompu, il reconstruit ce fragment en ligne à partir des fragments redondants restants.

## Vérification et récupération des données

Le mécanisme de vérification des données de RustFS contrôle la cohérence des métadonnées, puis lit et vérifie les données afin de détecter les secteurs défectueux latents. Le scanner d’objets détecte des problèmes tels que la corruption silencieuse (bit rot) et déclenche les processus de réparation lorsque c’est nécessaire.

## Modes d’analyse et planification

RustFS prend en charge trois modes d’analyse qui équilibrent performances et fiabilité : contrôles pendant les lectures, analyses périodiques en arrière-plan et analyses complètes manuelles.
Comme pour le paramètre `osd_scrub_begin_hour` de Ceph, les administrateurs peuvent définir l’heure de début et la fréquence des analyses. Par exemple, un contrôle léger s’exécute une fois par jour par défaut.

## Surveillance et métriques

Le scanner indique le nombre total de tâches, le nombre d’échecs et la répartition des durées sous forme de métriques Prometheus, notamment `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total` et `rustfs_scanner_duration_seconds`.
Configurez des alertes sur le taux d’échec et la durée des analyses, afin de détecter et de diagnostiquer tôt les problèmes de stockage ou de réseau.
