---
title: "Installation Rapide RustFS sur Linux"
description: "Utilisez le paquet d'installation en un clic RustFS pour un déploiement et installation rapide sous environnement Linux"
---

# RustFS Rapide sur Linux

<a id="mode"></a>

## I. Lecture Obligatoire Avant Installation

Cette page contient toute la documentation et instructions pour les trois modes d'installation de RustFS. Parmi eux, le mode multi-machine multi-disque inclut les performances, la sécurité et l'évolutivité de niveau entreprise. De plus, il fournit le diagramme d'architecture requis pour les charges de travail de production. Avant l'installation, veuillez lire nos modes de démarrage et listes de vérification, comme suit :

1. Veuillez clarifier vos trois modes d'installation :

    - [Mode mono-machine mono-disque (SNSD)](./single-node-single-disk.md)
    - [Mode mono-machine multi-disque (SNMD)](./single-node-multiple-disk.md)
    - [Mode multi-machine multi-disque (MNMD)](./multiple-node-multiple-disk.md)

2. [Vérification avant installation](../checklists/index.md), assurez-vous que tous les indicateurs respectent les caractéristiques de guidage de production, si vous n'avez pas besoin des standards de production vous pouvez ne pas lire ce guidage ;

## II. Installation Rapide

En utilisant le script d'installation rapide, le mode **SNSD (mono-machine mono-disque)** est réalisé pour une installation rapide, le script est le suivant :

~~~
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
~~~

Remarques :
1. Le port d'installation par défaut est le port `9000` ;
2. Le chemin d'installation par défaut est `/data/rustfs0`, si vous avez un disque indépendant veuillez le monter à l'avance ;
3. Veuillez installer `unzip` à l'avance, pour garantir que le paquet d'installation RustFS zip puisse être décompressé normalement.

L'adresse GitHub de l'installation rapide est : https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh

## III. Autres Précautions

1. Veuillez vérifier si le pare-feu est activé ;
2. Veuillez assurer la cohérence du serveur de temps NTP ;
3. Veuillez déterminer la capacité et la planification des disques actuels ;
4. Veuillez confirmer la version du noyau du système d'exploitation pour supporter IO-Uring ;
5. Veuillez vérifier SELinux.