---
title: "Qu'est-ce que RustFS et guide d'installation"
description: "RustFS est une solution de stockage d'objets, un logiciel open source distribué sous licence Apache2."
---

# I. Qu'est-ce que RustFS ?

RustFS est un stockage d'objets simple, efficace et distribué, adapté pour le remplacement rapide de MinIO et pour l'utilisation de scénarios de stockage d'objets d'entraînement et d'inférence IA.
En même temps, RustFS est une solution de stockage d'objets efficace, open source et libre. Il est 100% compatible avec le protocole S3, utilise une licence Apache2 et distribué comme logiciel open source. RustFS est écrit dans le langage Rust, le langage le plus populaire et sécurisé en mémoire au monde actuellement, particulièrement adapté pour les scénarios haute performance. RustFS est un produit de stockage d'objets distribué commercialement amical auquel participent et contribuent d'excellents ingénieurs du monde entier. RustFS peut remplacer de nombreux produits de stockage d'objets avec des licences open source non amicales.

RustFS passera bientôt officiellement du commercial à l'open source, avec un lancement mondial, aidant le monde à réduire les coûts de stockage et à améliorer la sécurité des données.



## II. Lecture obligatoire avant installation

 RustFS se divise en trois modes d'installation : mono-machine mono-disque, mono-machine multi-disques et multi-machines multi-disques. Le mode multi-machines multi-disques comprend les performances, la sécurité et la scalabilité de niveau entreprise. De plus, il fournit des diagrammes d'architecture nécessaires pour les charges de travail de production. Veuillez lire nos modes de démarrage et la liste de contrôle avant l'installation, comme suit :

1. Veuillez clarifier vos trois modes d'installation :

    - [Mode mono-machine mono-disque (SNSD)](./single-node-single-disk.md)   
    - [Mode mono-machine multi-disques (SNMD)](./single-node-multiple-disk.md)
    - [Mode multi-machines multi-disques (MNMD)](./multiple-node-multiple-disk.md) 

2. [Vérification avant installation](../checklists/index.md), pour s'assurer que tous les indicateurs répondent aux caractéristiques de guide de production. Cette directive peut être ignorée si aucun standard de production n'est requis ;



## III. Support des systèmes d'exploitation et CPU

Vous pouvez exécuter RustFS sur presque n'importe quel CPU et système d'exploitation, que ce soit Linux, Unix, Windows, MacOS, FreeBSD, Docker, ou même sur des passerelles de périphérie, vous pouvez exécuter RustFS.
Support d'architecture CPU : X86, ARM et de nombreuses autres architectures CPU.

## IV. Caractéristiques de RustFS

- **Compatible S3** : 100% compatible avec le protocole S3, excellente compatibilité avec le big data, les lacs de données, les logiciels de sauvegarde, les logiciels de traitement d'images et les logiciels de production industrielle ;
- **Distribué** : RustFS est un stockage d'objets distribué, par conséquent, RustFS peut répondre à divers besoins ;
- **Commercial amical** : RustFS est un logiciel 100% open source et utilise une licence Apache v2.0, par conséquent, RustFS est commercial amical ;
- **Rapide** : Les performances du langage de développement Rust sont infiniment proches de la vitesse du langage C. Par conséquent, les performances de RustFS sont très puissantes ;
- **Sécurisé** : RustFS est écrit dans le langage Rust sécurisé en mémoire, par conséquent, RustFS est 100% sécurisé ;
- **Multiplateforme** : RustFS fonctionne sur Windows, macOS et Linux ;
- **Extensible** : RustFS supporte les plugins personnalisés, par conséquent, RustFS peut répondre à divers besoins ;
- **Personnalisable** : Grâce aux caractéristiques open source, vous pouvez personnaliser divers plugins, par conséquent, RustFS peut répondre à divers besoins ;
- **Cloud natif** : RustFS supporte le déploiement via Docker et autres méthodes, peut être déployé rapidement dans des environnements cloud natifs.

## V. Valeurs de RustFS

Aider toute l'humanité à améliorer la sécurité des données et à réduire les coûts de stockage.

## VI. Vision de RustFS

Chaque entité IA personnelle dans le monde peut utiliser RustFS pour stocker des données.

