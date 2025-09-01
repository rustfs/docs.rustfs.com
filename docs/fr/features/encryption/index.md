---
title: "Infrastructure pour données à grande échelle"
description: "RustFS offre un chiffrement de niveau entreprise avec des performances optimisées pour la sécurité des données à grande échelle"
---

# Infrastructure pour données à grande échelle

RustFS est conçu pour l'évolutivité. Échelle technique, échelle opérationnelle et échelle économique. Échelle fondamentale.

Dans le domaine du stockage d'objets, un chiffrement robuste est nécessaire pour avoir une place à la table de négociation. RustFS offre bien plus avec le plus haut niveau de chiffrement ainsi que des optimisations étendues qui éliminent pratiquement les surcharges généralement associées aux opérations de chiffrement de stockage.

![Architecture de chiffrement des données](images/s5-1.png)

RustFS chiffre les données lorsqu'elles sont stockées sur disque et lors de leur transmission sur le réseau. Le schéma de chiffrement de pointe de RustFS prend en charge un chiffrement granulaire au niveau des objets utilisant des algorithmes de chiffrement standards industriels modernes (tels que AES-256-GCM, ChaCha20-Poly1305 et AES-CBC). RustFS est entièrement compatible avec la sémantique de chiffrement S3 et étend également S3 en prenant en charge des services de gestion de clés non-AWS (tels que Hashicorp Vault, Gemalto KeySecure et Google Secrets Manager).

## Chiffrement réseau

Lorsque les données sont transmises entre le stockage d'objets et les applications, elles peuvent rebondir entre un nombre arbitraire de réseaux inconnus et/ou non fiables. Le chiffrement des données lors de leur transmission sur le réseau (également appelé "en transit") permet d'atténuer avec succès les attaques man-in-the-middle et garantit que les données restent sécurisées quel que soit l'itinéraire emprunté.

RustFS prend en charge Transport Layer Security (TLS) v1.2+ entre tous les composants du cluster. Cette approche garantit qu'il n'y a pas de maillon faible dans le trafic chiffré inter-cluster ou intra-cluster. TLS est un framework de chiffrement omniprésent : c'est le même protocole de chiffrement utilisé par les banques, les sites de commerce électronique et autres systèmes de niveau entreprise qui dépendent du chiffrement de stockage de données.

L'implémentation TLS de RustFS est optimisée au niveau des instructions CPU avec une surcharge de performance négligeable. Elle nécessite seulement de spécifier une clé privée TLS et un certificat public pour chaque serveur RustFS dans le cluster. Pour les environnements Kubernetes, l'Opérateur Kubernetes RustFS intègre/génère et attribue automatiquement des certificats TLS lors du déploiement des locataires. RustFS prend en charge plusieurs certificats TLS, où chaque certificat correspond à un nom de domaine spécifique. RustFS utilise Server Name Indication (SNI) pour déterminer quel certificat servir pour toute requête donnée.

## Chiffrement d'objets

Les données stockées sur disque dépendent entièrement de la sécurité du disque, et par extension du système hôte, pour assurer la sécurité des données. Le chiffrement d'objets côté serveur RustFS chiffre automatiquement les données avant qu'elles ne soient stockées sur disque (chiffrement au repos). Cette approche garantit qu'aucune donnée n'est écrite sur un disque non chiffré. Cette couche de sécurité de base garantit la confidentialité, l'intégrité et l'authenticité des données au repos. RustFS prend en charge le chiffrement d'objets par défaut piloté par le client et automatique du bucket pour une flexibilité maximale du chiffrement des données.

Le chiffrement côté serveur RustFS est compatible avec la sémantique Amazon AWS-S3 (SSE-S3). RustFS étend le support de base d'AWS KMS pour inclure des systèmes KMS d'entreprise courants, tels que Hashicorp Vault et Thales Ciphertrust (anciennement Gemalto KeySecure). RustFS prend également en charge le chiffrement piloté par le client (SSE-C), où les applications peuvent spécifier la clé de données utilisée pour chiffrer les objets. Pour SSE-S3 et SSE-C, le serveur RustFS effectue toutes les opérations de chiffrement, y compris la rotation des clés et le rechiffrement des objets.

Avec le chiffrement automatique côté serveur, RustFS chiffre chaque objet avec une clé unique et applique plusieurs couches de chiffrement supplémentaires en utilisant des clés de chiffrement dynamiques et des clés dérivées de clés fournies par un KMS externe ou le client. Cette approche sécurisée et sophistiquée se fait dans RustFS sans avoir besoin de gérer plusieurs utilitaires de chiffrement kernel et userspace indépendants.

RustFS utilise des schémas de chiffrement authentifié (AEAD) pour chiffrer/déchiffrer les objets lorsqu'ils sont écrits ou lus depuis le stockage d'objets. Le chiffrement AEAD de RustFS prend en charge des protocoles de chiffrement standards industriels tels que AES-256-GCM et ChaCha20-Poly1305 pour protéger les données d'objets. Les optimisations au niveau CPU de RustFS (telles que l'accélération SIMD) garantissent une surcharge de performance négligeable pour les opérations de chiffrement/déchiffrement. Les organisations peuvent exécuter un chiffrement automatique au niveau du bucket à tout moment plutôt que d'être forcées à faire des choix de sécurité sous-optimaux.

## Service de chiffrement de clés RustFS

RustFS fournit des options intégrées pour le chiffrement de clés. Le Service de chiffrement de clés (KES) de RustFS est un système de gestion de clés distribué sans état pour les applications hautes performances. Il est conçu pour fonctionner dans Kubernetes et distribuer les clés de chiffrement aux applications. KES est un composant requis pour le chiffrement d'objets côté serveur RustFS (SSE-S3).

KES prend en charge les opérations de chiffrement sur les clusters RustFS et est le mécanisme clé pour assurer des opérations de chiffrement évolutives et hautes performances. KES agit comme intermédiaire entre les clusters RustFS et les KMS externes, générant des clés de chiffrement selon les besoins et effectuant des opérations de chiffrement sans être limité par les contraintes du KMS. Par conséquent, il y a toujours un KMS central qui protège la clé maître et agit comme racine de confiance dans l'infrastructure. KES simplifie le déploiement et la gestion en évitant d'avoir à démarrer un KMS pour chaque groupe d'applications. Au lieu de cela, les applications peuvent demander des clés de chiffrement de données (DEK) aux serveurs KES ou demander aux serveurs KES de déchiffrer des DEK chiffrées.

Comme les serveurs KES sont entièrement sans état, ils peuvent être mis à l'échelle automatiquement, par exemple via l'autoscaler horizontal Kubernetes. En même temps, comme KES gère indépendamment la grande majorité des requêtes d'applications, la charge sur le KMS central n'augmente pas de manière significative.

Pour les environnements Kubernetes, l'Opérateur Kubernetes RustFS prend en charge le déploiement et la configuration de KES pour chaque locataire, activant SSE-S3 dans le cadre du déploiement de chaque locataire.

![Architecture du service de chiffrement de clés KES](images/s5-2.png)

## Systèmes de gestion de clés externes pris en charge

| ![AWS KMS](images/s5i-1.png) | ![HashiCorp Vault](images/s5i-2.png) | ![Google Secret Manager](images/s5i-3.png) |
|-------------------------------|----------------------------------------|-------------------------------------------|
| ![Azure Key Vault](images/s5i-4.png) | ![Thales CipherTrust](images/s5i-5.png) | ![Fortanix](images/s5i-6.png) |

