---
title: "Journal et Audit"
description: "Surveillance des performances de stockage détaillée, métriques et journalisation pour chaque opération"
---

# Journal et Audit

Lors du suivi de la santé et des performances de tout système, les métriques et la journalisation sont cruciaux. RustFS fournit une visibilité complète sur le cluster grâce à une surveillance détaillée des performances de stockage, des métriques et la journalisation de chaque opération. Le résultat est une réponse robuste, transparente et efficace à la surveillance, alertes et observabilité du stockage d'objets.

## Caractéristiques Fonctionnelles

### Métriques de Surveillance

Fournit une surveillance système complète et la collecte de métriques de performance.

### Journalisation

Enregistre des informations de journal détaillées pour chaque opération, prend en charge le suivi d'audit.

## Surveillance des Métriques

RustFS exporte un large éventail de métriques matérielles et logicielles à grain fin via un point de terminaison de métriques compatible Prometheus. Prometheus est une plateforme de surveillance cloud-native composée d'un modèle de données multidimensionnel avec des données de séries temporelles identifiées par le nom de métrique et les paires clé/valeur. RustFS inclut un tableau de bord de surveillance de stockage utilisant Grafana pour visualiser les métriques collectées. L'écosystème Prometheus comprend plusieurs intégrations pour router les métriques RustFS vers des services de stockage, messagerie et alerte.

RustFS affiche diverses métriques matérielles et logicielles fines via le point de terminaison Prometheus, y compris les informations de santé telles que les pannes de disque ou de nœud, la capacité de stockage totale disponible et la capacité de stockage par disque. En tirant parti de Prometheus et de sa popularité croissante en tant que plateforme leader de collecte et d'analyse de métriques, RustFS peut se concentrer sur ses fonctionnalités de stockage d'objets plutôt que de construire d'innombrables adaptateurs de surveillance de stockage de données personnalisés pour des services d'analyse/visualisation/alerte tiers donnés.

L'Opérateur Kubernetes RustFS peut automatiquement déployer, configurer et gérer les déploiements Prometheus et la collecte de métriques pour chaque locataire. Les organisations peuvent également pointer leur propre système Prometheus ou compatible Prometheus vers chaque locataire pour une surveillance centralisée à travers plusieurs fournisseurs, centres de données et outils de visualisation/analyse.

RustFS fournit également un point de terminaison de vérification de santé pour sonder la vivacité des nœuds et clusters. Une simple instruction CURL peut indiquer si un nœud donné est en bonne santé ou si le cluster a un quorum de lecture/écriture.

## Journaux d'Audit

L'activation de la journalisation d'audit RustFS indique à RustFS de générer des journaux pour chaque opération sur le cluster. Chaque opération génère un journal d'audit contenant un ID unique ainsi que des détails sur le client, l'objet, le bucket et toutes autres métadonnées liées à l'opération. RustFS écrit les données de journal vers des points de terminaison webhook HTTP/HTTPS configurés. Des adaptateurs personnalisés peuvent être utilisés pour répondre aux exigences spécifiques des cibles de journalisation d'audit.

RustFS prend en charge la configuration des journaux d'audit via l'interface utilisateur de la console RustFS et l'outil de ligne de commande RustFS `mc`. Pour les environnements Kubernetes, l'Opérateur RustFS configure automatiquement la console avec l'intégration LogSearch pour l'inspection visuelle des journaux d'audit collectés.

Les notifications Lambda RustFS fournissent un support de journalisation supplémentaire. RustFS peut automatiquement envoyer des événements de bucket et d'objet vers des applications tierces pour un traitement piloté par événements, comme les frameworks de calcul sans serveur ou fonction-en-tant-que-service. Les notifications Lambda RustFS prennent en charge des cibles telles que RabbitMQ, Kafka, Elasticsearch et des services arbitraires via webhook.

RustFS prend également en charge le traçage en temps réel des opérations HTTP/S via la console RustFS et la commande shell RustFS mc admin trace.

## Architecture

**RustFS expose ses métriques via un point de terminaison HTTP(S) compatible Prometheus, où un service Prometheus fournit un accès push/pull à ces métriques. L'Opérateur Kubernetes RustFS déploie un service Prometheus indépendant pour chaque locataire RustFS pré-configuré pour récupérer les métriques du locataire. Les organisations peuvent également déployer ou utiliser leur propre service Prometheus centralisé pour récupérer les métriques du locataire.**

![Diagramme d'architecture 1](images/s7-1.png)

Les notifications Lambda RustFS poussent automatiquement les notifications d'événements vers les services cibles pris en charge tels que Kafka, Elasticsearch ou PostgreSQL. Les administrateurs peuvent définir des règles de notification au niveau bucket incluant des filtres à grain fin pour les événements S3 et les objets pour lesquels RustFS génère des événements. Les notifications Lambda RustFS sont intégrées au service de stockage d'objets RustFS et nécessitent seulement l'accès aux cibles de notification distantes.

![Diagramme d'architecture 2](images/s7-2.png)

## Exigences

### Pour les Métriques

BYO Prometheus *ou* utiliser l'Opérateur Kubernetes pour le déploiement/configuration automatique par locataire.

### Pour la Recherche de Journaux

BYO PostgreSQL *ou* utiliser l'Opérateur Kubernetes pour le déploiement/configuration automatique par locataire.

### Pour les Journaux

Prise en charge des cibles de notification tierces.

