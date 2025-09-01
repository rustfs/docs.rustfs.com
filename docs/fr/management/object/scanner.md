---
title: "Analyse d'Objets"
description: "RustFS est un stockage d'objets simple, efficace et distribué. Il est 100% compatible S3 et utilise un logiciel open source sous licence Apache2."
---

# Analyse d'Objets

Ce document présente en détail la conception et l'implémentation du scanner d'objets RustFS, couvrant son intégration avec l'Erasure Coding, les mécanismes Scrub & Repair, ainsi que les stratégies de planification, les métriques de surveillance et les méthodes de dépannage.

## Vue d'Ensemble

Le scanner d'objets RustFS est intégré dans le moteur de stockage et est responsable de la vérification périodique de l'intégrité des objets et de l'exécution d'opérations prédéterminées.
Les tâches d'analyse incluent les statistiques d'utilisation du disque, l'évaluation des règles de gestion du cycle de vie, l'exécution de la réplication d'objets et le déclenchement de l'auto-guérison des objets corrompus.

## Architecture et Principes de Conception

### Architecture du Scanner

Le scanner RustFS adopte un mécanisme d'échantillonnage par hachage, sélectionnant un objet sur 1024 basé sur le hachage du nom de l'objet pour vérification, afin de réduire l'impact sur les performances des requêtes normales.
Le scanner est profondément intégré au module Erasure Coding, capable d'utiliser des fragments redondants pour la reconstruction en ligne lorsque des fragments perdus ou corrompus sont détectés, assurant ainsi une haute disponibilité et une cohérence des données.

## Vérification et Récupération des Données

Le mécanisme de vérification des données RustFS peut rapidement vérifier la cohérence des métadonnées, ce dernier lit et vérifie les données bit par bit pour découvrir les blocs défectueux cachés. L'exécution du scanner d'objets peut découvrir des problèmes tels que le bit rot et déclencher des processus de réparation lorsque nécessaire.

## Modes d'Analyse et Planification

RustFS supporte trois modes de déclenchement d'analyse : analyse en ligne lors de la lecture, analyse périodique en arrière-plan et analyse manuelle complète, équilibrant performance et fiabilité.
Similaire à la configuration `osd_scrub_begin_hour` dans Ceph, les administrateurs peuvent définir l'heure de début et la fréquence d'analyse, par exemple définir la vérification légère par défaut à une fois par jour.

## Surveillance et Métriques

Le scanner RustFS collecte des statistiques sur le nombre total de tâches, le nombre d'échecs et la distribution du temps d'exécution, et expose des métriques via le modèle de données Prometheus telles que `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total` et `rustfs_scanner_duration_seconds`.
En combinaison avec les systèmes de surveillance, des alertes peuvent être configurées basées sur le taux d'échec d'analyse et la durée pour découvrir et localiser rapidement les problèmes potentiels au niveau du stockage ou du réseau.