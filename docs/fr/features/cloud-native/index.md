---
title: "Stockage d'Objets Hybride/Multi-Cloud"
description: "Architecture hybride/multi-cloud offrant performance, sécurité et économie cohérentes"
---

# Stockage d'Objets Hybride/Multi-Cloud

L'architecture hybride/multi-cloud permet d'atteindre une performance, sécurité et économie cohérentes. Toute discussion sur le multi-cloud doit commencer par une définition. Ce n'est pas seulement un seul cloud public et on-premise.

## Les stratégies de stockage multi-cloud réussies exploitent des architectures et outils capables de fonctionner dans divers environnements

### Cloud Public

C'est un domaine en constante expansion, mais commencez avec AWS, Azure, GCP, IBM, Alibaba, Tencent et les clouds gouvernementaux. Votre logiciel de stockage hybride/multi-cloud doit fonctionner partout où la pile d'applications s'exécute. Même les entreprises qui prétendent fonctionner sur un seul cloud ne le font pas - il y a toujours d'autres clouds. RustFS fournit une cohérence de stockage pour chaque fournisseur de cloud public, évitant le besoin de réécrire les applications lors de l'expansion vers de nouveaux clouds.

### Cloud Privé

Kubernetes est la principale architecture logicielle pour les clouds privés modernes. Cela inclut toutes les distributions Kubernetes, telles que VMware (Tanzu), RedHat (OpenShift), Rancher/SUSE, HP (Ezmeral) et Rafay. Le multi-cloud Kubernetes nécessite un stockage d'objets défini par logiciel et cloud-natif. Les clouds privés incluent également des instances bare metal plus traditionnelles, mais les charges de travail d'entreprise sont de plus en plus conteneurisées et orchestrées.

### Edge

L'edge consiste à déplacer le calcul vers l'endroit où les données sont générées. Après traitement, les données se déplacent vers un emplacement plus centralisé. Les solutions de stockage edge doivent être légères, puissantes, cloud-natives et résilientes pour fonctionner dans cette architecture multi-cloud. C'est très difficile à réaliser, c'est pourquoi peu de fournisseurs en parlent, ils n'ont pas de bonne réponse - même Amazon.

## Architecture Multi-Cloud Utilisant RustFS

![Architecture Multi-Cloud](images/multi-cloud-architecture.png)

## Attributs du Stockage Hybride/Multi-Cloud

Le stockage multi-cloud suit le modèle établi par les clouds publics, où les fournisseurs de cloud public adoptent uniformément le stockage d'objets cloud-natif. Le succès des clouds publics a efficacement rendu obsolètes le stockage de fichiers et de blocs. Chaque nouvelle application est écrite pour l'API AWS S3, pas pour POSIX. Pour évoluer et performer comme les technologies cloud-natives, les anciennes applications doivent être réécrites pour l'API S3 et refactorisées en microservices pour être compatibles avec les conteneurs.

### Kubernetes-Natif

La conception native Kubernetes nécessite des services opérateur pour provisionner et gérer l'infrastructure de stockage d'objets multi-locataire en tant que service. Chacun de ces locataires s'exécute dans son propre namespace indépendant tout en partageant les ressources matérielles sous-jacentes. Le pattern opérateur étend le modèle API déclaratif familier de Kubernetes via des définitions de ressources personnalisées (CRD) pour exécuter des opérations communes comme l'orchestration de ressources, les mises à niveau sans interruption, l'évolution de cluster, et maintenir la haute disponibilité.

RustFS est construit pour tirer pleinement parti de l'architecture Kubernetes. Parce que les binaires serveur sont rapides et légers, l'Opérateur RustFS peut densité co-localiser plusieurs locataires sans épuiser les ressources. Tirez parti des avantages de Kubernetes et de l'écosystème associé en utilisant le stockage natif Kubernetes portable pour obtenir des avantages multi-cloud.

### Cohérent

Le stockage hybride/multi-cloud doit maintenir la cohérence dans la compatibilité API, la performance, la sécurité et la conformité. Il doit exécuter de manière cohérente et indépendamment du matériel sous-jacent. Tout changement, même mineur, peut casser les applications, créant un énorme fardeau opérationnel.

Parce que RustFS est extrêmement léger, nous pouvons déployer des mises à jour sans interruption en minutes sur public, privé et edge, maintenant une expérience cohérente. RustFS abstrait les différences fondamentales entre ces architectures, incluant la gestion des clés, la gestion d'identité, les politiques d'accès et les différences matériel/OS.

### Performance

Parce que le stockage d'objets est utilisé à la fois comme stockage primaire et secondaire, il doit fournir des performances à l'échelle. Des applications mobiles/Web à l'AI/ML, les charges de travail intensives en données nécessitent des performances exceptionnelles du stockage d'objets sous-jacent. Même les charges de travail de protection de données nécessitent une déduplication haute performance et un accès aux snapshots. Aucune entreprise ne peut se permettre un processus de récupération lent. Traditionnellement, ces charges de travail nécessitaient des performances bare metal. Maintenant, toutes ces charges de travail peuvent être conteneurisées - comme le prouve le succès des fournisseurs de cloud public.

RustFS est le stockage d'objets le plus rapide au monde, avec des vitesses de lecture/écriture NVMe de 325 GiB/s et 171 GiB/s, et des vitesses HDD de 11 GiB/s et 9 GiB/s. À de telles vitesses, chaque charge de travail est réalisable dans toute architecture multi-cloud fonctionnant sur toute infrastructure.

### Évolutif

Beaucoup pensent que l'échelle signifie seulement à quel point un système peut devenir grand. Cependant, cette pensée ignore l'importance de l'efficacité opérationnelle à mesure que l'environnement évolue. Les solutions de stockage d'objets multi-cloud doivent évoluer efficacement et transparemment, quel que soit l'environnement sous-jacent, avec un minimum d'interaction humaine et un maximum d'automatisation. Cela ne peut être accompli qu'avec des plateformes pilotées par API construites sur des architectures simples.

L'attention implacable de RustFS sur la simplicité signifie que des infrastructures de données massives, multi-PB peuvent être gérées avec des ressources humaines minimales. C'est une fonction d'API et d'automatisation, et crée un environnement sur lequel un stockage multi-cloud évolutif peut être créé.

### Défini par Logiciel

La seule façon de réussir dans le multi-cloud est d'utiliser un stockage défini par logiciel. La raison est simple. Les appliances matérielles ne fonctionnent pas sur les clouds publics ou Kubernetes. Les offres de services de stockage de cloud public ne sont pas conçues pour fonctionner sur d'autres clouds publics, clouds privés ou plateformes Kubernetes. Même si elles le faisaient, le coût de la bande passante dépasserait le coût du stockage car elles ne sont pas développées pour la réplication à travers les réseaux. Il est vrai que le stockage défini par logiciel peut fonctionner sur cloud public, privé et edge.

RustFS est né du logiciel et est portable à travers divers systèmes d'exploitation et architectures matérielles. La preuve peut être trouvée dans nos 2M+ IP fonctionnant à travers AWS, GCP et Azure.

