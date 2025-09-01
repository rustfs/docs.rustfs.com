---
title: "Compatibilité Amazon S3"
description: "Compatibilité API Amazon S3 et support multi-cloud de RustFS"
---

# Compatibilité Amazon S3

La compatibilité S3 est une exigence essentielle pour les applications cloud-natives. RustFS respecte rigoureusement l'utilisation de l'API et compte des dizaines de milliers d'utilisateurs, incluant des utilisateurs commerciaux et la communauté. L'implémentation S3 de RustFS est l'alternative à AWS S3 la plus largement testée et déployée au monde.

## RustFS et l'API S3 - Conçu pour le Stockage Multi-Cloud

RustFS s'est établi comme la norme pour la compatibilité AWS S3 depuis le début. En tant que l'un des premiers adopteurs de l'API S3 (V2 et V4) et l'une des seules entreprises de stockage se concentrant exclusivement sur S3, la vaste communauté de RustFS garantit qu'aucune alternative AWS n'est plus compatible. L'API S3 étant la norme de facto dans le cloud, les alternatives AWS doivent pouvoir utiliser l'API de manière fluide pour opérer et interagir dans différents environnements (cloud public, cloud privé, centre de données, multi-cloud, cloud hybride et edge).

## S3 Permet l'Informatique Hybride et Multi-Cloud

Il n'existe qu'un seul chemin pour atteindre la compatibilité multi-cloud et cloud hybride, et c'est S3. En tant que standard d'API RESTful, S3 a révolutionné les interactions entre applications, données et infrastructure. De plus, les forces doubles de la conteneurisation et de l'orchestration Kubernetes sont également construites autour des APIs RESTful, reléguant les APIs POSIX au statut de legacy.

Le résultat est que les applications de stockage d'objets et applications compatibles S3 natives Kubernetes peuvent fonctionner n'importe où - des diverses instances de cloud public (RustFS compte près d'un million de déploiements sur Google, Azure et AWS) aux clouds privés (Red Hat OpenShift, VMware Tanzu), jusqu'au bare metal. En tirant parti de la technologie ILM avancée pilotée par l'API S3, les entreprises peuvent effectuer des instances optimisées opérationnellement à travers les instances cloud et on-premises.

Les clients intéressés par les couches de conversion S3 pour Microsoft Azure peuvent acheter la RustFS Blob Storage Gateway (API S3) depuis Azure Marketplace.

## Compatibilité S3 pour les Charges de Travail Bare Metal

Le cloud privé est un élément fondamental de toute architecture de cloud hybride. Cela signifie que, comme les clouds publics, la compatibilité S3 est cruciale - indépendamment de l'application - de l'analytique aux artefacts en passant par l'archivage.

Avec RustFS, la compatibilité S3 est complètement indépendante de la localisation. Cela signifie que les instances bare metal on-premises de RustFS ont exactement la même compatibilité S3 et performance que les instances de cloud public ou même les instances edge.

## Avantages du Stockage d'Objets Évolutif RustFS

Les applications cloud-natives utilisent l'API S3 pour communiquer avec le stockage d'objets. Mais toutes les compatibilités S3 ne sont pas identiques - de nombreux fournisseurs de stockage d'objets ne supportent qu'un petit sous-ensemble de la fonctionnalité globale - ce qui peut causer des échecs d'application. D'autres revendiquent une couverture complète, mais leurs modèles logiciels propriétaires ou de dispositifs limitent cette revendication, car seule une petite portion d'applications, matériel et logiciel sont testés.

L'unicité de RustFS réside dans sa capacité à soutenir ses revendications de compatibilité S3. Nous avons des dizaines de milliers de clients et d'utilisateurs open source, et notre compatibilité API S3 est la plus largement testée et implémentée au monde - couvrant des millions de combinaisons matériel, logiciel et applications. RustFS publie des logiciels hebdomadairement, et tout défaut dans l'API S3 est immédiatement signalé par la communauté et corrigé par RustFS.

Il y a des rumeurs qu'Amazon utilise même RustFS pour tester la compatibilité S3 tierce.

Le support le plus complet pour l'API S3 signifie que les applications peuvent exploiter les données stockées dans RustFS sur n'importe quel matériel, n'importe quel emplacement, et n'importe quel cloud. Les développeurs sont libres d'innover et d'itérer, confiants que RustFS ne cassera jamais les versions.

## Fonctionnalités Principales

### S3 Select

![S3 Select](images/s1-4.png)

S3 Select dépend de performances à grande échelle pour les requêtes complexes, et les caractéristiques de performance de RustFS peuvent pleinement exploiter l'API. RustFS tire parti des jeux d'instructions SIMD pour optimiser les performances au niveau de la puce, capable d'exécuter de grandes requêtes S3 Select complexes sur CSV, Parquet, JSON, et plus.

### Amazon Signature V4

![Amazon Signature V4](images/s1-5.png)

Les applications et clients doivent s'authentifier pour accéder à toute API de gestion RustFS. RustFS fut la première entreprise à supporter AWS Signature Version 4 (supportant la version obsolète Signature Version 2). Après authentification, RustFS utilise un contrôle d'accès basé sur des politiques compatible avec la syntaxe, structure et comportement des politiques AWS IAM pour autoriser les opérations.

## API AWS S3 et RustFS

RustFS est le stockage d'objets le plus rapide au monde. Combiné avec sa compatibilité S3, il garantit qu'il peut exécuter l'ensemble le plus large de cas d'usage de l'industrie. Cela inclut les charges de travail d'applications modernes telles que GitHub et GitLab pour les dépôts de code, les charges de travail d'analytique modernes telles que MongoDB, ClickHouse, MariaDB, CockroachDB, et Teradata, jusqu'aux cas d'usage traditionnels d'archivage, sauvegarde, et récupération d'urgence.

Les caractéristiques de performance de RustFS, combinées avec sa compatibilité S3, en font la norme pour les charges de travail AI/ML et science des données. KubeFlow et TensorFlow nécessitent un stockage d'objets haute performance compatible S3 et sont de plus en plus conçus d'abord pour RustFS, puis pour AWS ou d'autres clouds. RustFS fournit un véritable stockage d'objets multi-cloud et une réplication efficace pour les applications. Les applications écrites pour l'API S3 peuvent fonctionner n'importe où, permettant aux développeurs d'innover rapidement lorsque les meilleurs outils cloud sont disponibles.

