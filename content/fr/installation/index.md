---
title: "Choisir comment installer RustFS"
description: "Choisissez le mode de déploiement RustFS adapté : essai local, production sur un ou plusieurs nœuds, conteneurs et Kubernetes."
---

RustFS est un système de stockage objet distribué, écrit en Rust et publié sous la licence Apache 2.0. Il s’exécute sous Linux, Windows, macOS et FreeBSD, ainsi que dans des conteneurs, sur les architectures x86, ARM, RISC-V et d’autres architectures de processeur.

:::warning[Développement et débogage uniquement]

La version Windows de RustFS est destinée uniquement au développement et au débogage. Elle **n’est pas recommandée pour les déploiements en production**. Nous recommandons [Linux](/fr/installation/linux) pour les charges de production.

:::

:::warning[Changez immédiatement les identifiants par défaut]

Après l’installation, définissez des valeurs uniques pour `RUSTFS_ACCESS_KEY` et `RUSTFS_SECRET_KEY` avant d’exposer RustFS sur un réseau. N’utilisez pas la valeur bien connue `rustfsadmin` pour l’un ou l’autre des identifiants.

- Pour une installation par binaire Linux ou par systemd, définissez les deux valeurs dans `/etc/default/rustfs`, puis redémarrez le service `rustfs`.
- Pour Docker, Podman ou Docker Compose, transmettez les deux valeurs comme variables d’environnement du conteneur au moment de sa création. Recréez un conteneur existant s’il a été démarré sans elles.

:::

## Choisissez votre parcours

| Votre objectif | Parcours recommandé | Guide |
| - | - | - |
| Essayer RustFS sur une machine locale | Script d’installation en une commande, ou un conteneur | [Démarrage rapide Linux](./linux/quick-start.md) · [Conteneur](./container/index.md) |
| Production sur un seul serveur | SNSD (un disque) ou SNMD (plusieurs disques) | [Installer RustFS sur Linux](./linux/index.md) |
| Cluster de production multi-serveurs | MNMD, après les listes de contrôle de production | [Nœuds multiples, disques multiples](./linux/multiple-node-multiple-disk.md) · [Listes de contrôle](./requirement/checklists/index.md) |
| Kubernetes / cloud natif | Déploiement avec le chart Helm ou l’Operator | [Cloud natif](./cloud-native/index.md) |
| Hôte Windows ou macOS | Installation native | [Windows](./windows/index.md) · [macOS](./macos/index.md) |

## Comparaison des modes de déploiement [#deployment-mode-comparison]

| Mode | Nœuds | Disques | Tolérance aux pannes | Usage typique |
| - | - | - | - | - |
| [SNSD](./linux/single-node-single-disk.md) | 1 | 1 | Aucune — appuyez-vous sur les sauvegardes | Développement, tests et petites charges non critiques |
| [SNMD](./linux/single-node-multiple-disk.md) | 1 | Plusieurs | Jusqu’à M disques de parité dans le nœud | Charges moyennes et non critiques sur un seul serveur |
| [MNMD](./linux/multiple-node-multiple-disk.md) | 4+ | Plusieurs par nœud | Niveau disque et nœud, par codage d’effacement entre les serveurs | Charges de production |

## Liste de contrôle

Avant tout déploiement en production, parcourez les [listes de contrôle préalables à l’installation](./requirement/checklists/index.md) — matériel, réseau, logiciels et sécurité — afin de vérifier que votre environnement répond aux exigences de production.
