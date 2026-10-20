---
title: "Installer RustFS sur Linux"
description: "Choisissez un mode de déploiement Linux — SNSD, SNMD ou MNMD — et installez RustFS sur un ou plusieurs serveurs."
---

Cette section décrit l’installation de RustFS sur des serveurs Linux. Pour une installation d’essai en une commande, utilisez le [démarrage rapide](./quick-start.md). Pour une installation manuelle, choisissez l’un des trois modes de déploiement ci-dessous. Les trois partagent les mêmes [prérequis et la même configuration du service](./prerequisites-and-service.md), et ne diffèrent que par la topologie et la configuration des volumes.

:::warning[Changez immédiatement les identifiants par défaut]

Après l’installation, définissez des valeurs uniques pour `RUSTFS_ACCESS_KEY` et `RUSTFS_SECRET_KEY` dans `/etc/default/rustfs`. N’utilisez pas la valeur bien connue `rustfsadmin` pour l’un ou l’autre des identifiants. Après avoir modifié le fichier, redémarrez le service avec `sudo systemctl restart rustfs`.

:::

## Nœud unique, disque unique (SNSD)

Un serveur, un disque de données. C’est le mode le plus simple, sans redondance : une panne de disque entraîne une perte de données. Appuyez-vous donc sur des sauvegardes. Il convient au développement, aux tests et aux petites charges non critiques.

→ [Installation en mode nœud unique, disque unique](./single-node-single-disk.md)

## Nœud unique, disques multiples (SNMD)

Un serveur, plusieurs disques de données. Le codage d’effacement répartit les données entre les disques : le nœud tolère un nombre limité de pannes de disque, mais la panne du serveur entier entraîne toujours une perte de données. Ce mode convient aux charges moyennes et non critiques sur une seule machine.

→ [Installation en mode nœud unique, disques multiples](./single-node-multiple-disk.md)

## Nœuds multiples, disques multiples (MNMD)

Quatre serveurs ou plus, chacun avec un ou plusieurs disques. Le codage d’effacement s’étend sur plusieurs serveurs et offre une tolérance aux pannes au niveau du disque et du nœud, ainsi qu’une évolutivité horizontale. C’est le mode adapté aux charges de production.

→ [Installation en mode nœuds multiples, disques multiples](./multiple-node-multiple-disk.md)

## Avant la production

Parcourez les [listes de contrôle préalables à l’installation](../requirement/checklists/index.md) — matériel, réseau, logiciels et sécurité — avant un déploiement en production. Vous pouvez les ignorer pour les déploiements hors production.
