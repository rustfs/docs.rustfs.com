---
title: Installation RustFS Mono-Machine Multi-Disque
description: Installer RustFS sur plusieurs disques d'un seul serveur, les données seront stockées sur plusieurs disques.
---

# Mode Mono-Machine Multi-Disque (SNMD, Single Node Multiple Disk)

## I. Lecture Obligatoire Avant Installation

Ce document contient le mode de déploiement mono-machine multi-disque.

1. Veuillez clarifier vos trois modes d'installation :

    - [Mode mono-machine mono-disque (SNSD)](./single-node-single-disk.md)
    - [Mode mono-machine multi-disque (SNMD)](./single-node-multiple-disk.md)     (document actuel)
    - [Mode multi-machine multi-disque (MNMD)](./multiple-node-multiple-disk.md)

2. [Vérification avant installation](../checklists/index.md), assurez-vous que tous les indicateurs respectent les caractéristiques de guidage de production, si vous n'avez pas besoin des standards de production vous pouvez ne pas lire ce guidage ;

> Ce document convient au mode mono-machine multi-disque, le mode mono-machine multi-disque convient aux entreprises neutres non critiques, dans l'environnement de production généralement l'endommagement de M disques durs spécifiés ne présente pas de risque de données, si l'ensemble du serveur est endommagé ou plus de M disques sont endommagés, alors il y a perte de données. Veuillez noter la sauvegarde des données importantes.

1 serveur avec seulement plusieurs disques de données, les données sont stockées sous forme de fragments sur plusieurs disques de données.

Un bloc de données sera divisé en K blocs de données spécifiés et M blocs de vérification, ne peut pas perdre plus de K blocs de données, ne peut pas perdre plus de M blocs de vérification.

L'exemple suivant illustre :

<img src="./images/single-node-multiple-disk.jpg" alt="RustFS Single Node Multiple Disk Mode" />

## II. Prérequis

1. Version du système d'exploitation ;
2. Pare-feu ;
3. Conditions de mémoire ;
4. Synchronisation temporelle ;
5. Planification de capacité ;
6. Planification des disques ;
7. Choix du système de fichiers ;

### 2.1. Version du Système d'Exploitation

Nous recommandons Linux kernel 4.x et supérieur. Car les versions 5.x / 6.x peuvent obtenir de meilleures performances I/O et réseau.

Vous pouvez utiliser Ubuntu 22.04 et RHEL8.x pour installer RustFS.