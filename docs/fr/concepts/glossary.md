---
title: "Explication du vocabulaire"
description: "Cet article présente le vocabulaire fréquemment utilisé dans le stockage d'objets, facilitant aux utilisateurs une compréhension rapide du stockage d'objets"
---

# Collection complète du vocabulaire central du stockage d'objets (100 éléments)

| N° | Vocabulaire | Anglais | Explication |
|------|--------------------------|------------------------------|--------------------------------------------------------------------------|
| 1 | Stockage d'objets | Object Storage | Architecture où les données sont stockées sous forme d'objets, remplaçant la structure hiérarchique traditionnelle des fichiers |
| 2 | Bucket | Bucket | Conteneur stockant les objets, espace de noms globalement unique |
| 3 | Objet | Object | Unité de stockage de base, contenant données, métadonnées et identifiant unique (Object Key) |
| 4 | Métadonnées | Metadata | Informations clé-valeur décrivant les propriétés d'un objet (comme type de fichier, heure de création) |
| 5 | Compatible S3 | S3-Compatible | Service de stockage compatible avec le standard API Amazon S3 |
| 6 | Durabilité des données | Data Durability | Probabilité que les données soient conservées à long terme sans perte dans le système (comme 99.999999999%) |
| 7 | Multi-réplication | Replication | Technologie de redondance assurant la sécurité des données par plusieurs répliques |
| 8 | Codage d'effacement | Erasure Coding | Fragmentation et codage des données pour stockage, réalisant haute fiabilité avec moins d'espace |
| 9 | Stockage froid | Cold Storage | Type de stockage low-cost pour données à faible fréquence d'accès (comme données d'archives) |
| 10 | Gestion du cycle de vie | Lifecycle Management | Stratégie de transfert/suppression automatique d'objets (comme transfert en stockage froid après 30 jours) |
| 11 | Contrôle de version | Versioning | Conservation des versions historiques d'objets pour éviter l'écrasement |
| 12 | Type de stockage | Storage Class | Niveaux de stockage de performance/coût différents (standard, basse fréquence, archive) |
| 13 | Clé d'accès | Access Key | Clé d'authentification pour requêtes API (Access Key ID + Secret Access Key) |
| 14 | Région | Region | Localisation géographique de l'infrastructure de stockage (comme Est de la Chine 1, Ouest US) |
| 15 | Zone de disponibilité | Availability Zone (AZ) | Salles isolées avec alimentation/réseau indépendants dans la même région |
| 16 | Point de terminaison | Endpoint | Adresse de domaine pour accéder au service de stockage (comme us-east1.rustfs.com) |
| 17 | API RESTful | RESTful API | Norme de conception API basée sur le protocole HTTP |
| 18 | Téléchargement par parties | Multipart Upload | Mécanisme de division et fusion pour téléchargement de gros fichiers |
| 19 | URL pré-signée | Pre-Signed URL | Lien d'accès temporaire avec limite de temps |
| 20 | Chiffrement côté serveur | SSE | Chiffrement automatique des données côté serveur (SSE-S3/SSE-KMS/SSE-C) |
| 21 | Chiffrement côté client | CSE | Chiffrement local côté client avant téléchargement |
| 22 | Réplication inter-régions | Cross-Region Replication | Réplication automatique d'objets entre régions géographiques |
| 23 | Liste de contrôle d'accès | ACL | Liste de règles contrôlant les permissions d'accès aux buckets/objets |
| 24 | Politique de bucket | Bucket Policy | Stratégie de contrôle de permissions granulaire basée sur JSON |
| 25 | IAM | Identity and Access Management | Système de gestion centralisée des permissions d'accès utilisateurs/rôles |
| 26 | Notification d'événement | Event Notification | Envoi de notifications vers file de messages/calcul de fonctions lors d'événements déclenchés |
| 27 | Lac de données | Data Lake | Entrepôt stockant centralement données structurées/non structurées |
| 28 | Conformité | Compliance | Exigences conformes aux réglementations de stockage de données GDPR, HIPAA, etc. |
| 29 | Audit de journaux | Logging & Audit | Enregistrement de tous les journaux d'opérations API pour audit |
| 30 | Surveillance et alerte | Monitoring & Alerting | Surveillance en temps réel de l'utilisation stockage/nombre de requêtes et déclenchement d'alertes |
| 31 | Partage de ressources inter-domaines | CORS | Règles contrôlant l'accès inter-domaines aux ressources par navigateur |
| 32 | Accélération de transfert | Transfer Acceleration | Optimisation vitesse téléchargement/téléversement via nœuds de bordure |
| 33 | Accélération CDN | CDN Integration | Combinaison avec réseau de distribution de contenu pour accélération par cache |
| 34 | Export de données | Data Export | Processus de migration de données vers autres systèmes de stockage |
| 35 | Import de données | Data Import | Migration en lot de données depuis systèmes externes vers stockage d'objets |
| 36 | Hébergement de site web statique | Static Website Hosting | Hébergement direct de fichiers statiques HTML/CSS/JS via bucket |
| 37 | Protection anti-leeching | Hotlink Protection | Technologie empêchant sites externes de détourner liens de ressources |
| 38 | Limitation taux de requêtes | Request Rate Limiting | Contrôle fréquence requêtes API par utilisateur/IP |
| 39 | Étiquetage | Tagging | Ajout d'étiquettes de classification aux buckets/objets pour faciliter gestion |
| 40 | Rapport d'inventaire | Inventory Report | Génération régulière de fichiers CSV/ORC listant objets stockés |
| 41 | Restauration de données | Data Restoration | Récupération de données depuis stockage d'archives vers état accessible |
| 42 | Passerelle de stockage | Storage Gateway | Couche d'accès mappant stockage d'objets vers système de fichiers local |
| 43 | Compression de données | Data Compression | Compression de données avant téléchargement pour économiser espace stockage |
| 44 | Déduplication de données | Data Deduplication | Élimination données dupliquées pour réduire occupation stockage |
| 45 | Lecture directe d'archives | Direct Read Archive | Technologie de lecture directe données archivées sans restauration |
| 46 | Contrôle de trafic | Bandwidth Control | Limitation bande passante téléchargement pour éviter congestion réseau |
| 47 | Nombre de connexions simultanées | Concurrent Connections | Nombre de connexions de transfert de données traitées simultanément |
| 48 | Service de migration de données | Data Migration Service | Outil de migration automatisé (comme AWS Snowball) |
| 49 | SDK client | Client SDK | Kit d'outils pour intégration service stockage par développeurs (comme Python/Java SDK) |
| 50 | Outil CLI | Command Line Interface | Outil de gestion en ligne de commande (comme aws s3 cp) |

