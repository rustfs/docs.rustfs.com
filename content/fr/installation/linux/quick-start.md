---
title: "Démarrage rapide"
description: "Installez RustFS avec le script d’installation, connectez-vous à la Console et stockez votre premier objet, en une dizaine de minutes."
---

Ce guide vous mène d’un serveur Linux vide à une instance RustFS opérationnelle : installez, connectez-vous à la Console, créez un compartiment (bucket) et chargez (upload) votre premier objet. La planification de production (topologie multi-nœuds, dimensionnement matériel) est volontairement renvoyée à [l’étape suivante](#étapes-suivantes).

**Prérequis**

- Un serveur Linux (x86_64 ou aarch64) avec `systemd`, et un accès root ou sudo
- `unzip` installé, et un accès réseau sortant pour télécharger le paquet
- Les ports `9000` (API S3) et `9001` (Console) joignables depuis votre machine
- [`rc`](/fr/operations/rc) installé sur votre poste de travail pour le flux de vérification en ligne de commande

## 1. Installer et démarrer RustFS

Exécutez le script d’installation officiel :

```bash
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
```

Le script installe le binaire dans `/usr/local/bin/rustfs`, enregistre un service systemd `rustfs` et le démarre. Par défaut, il stocke les données dans `/data/rustfs0` et écoute sur le port `9000` (API S3) et `9001` (Console). Le chemin des données et les ports peuvent être ajustés pendant l’installation. En cas de succès, il affiche un résumé de ce type :

```text
RustFS has been installed and started successfully!
Service port: 9000,  Console port: 9001,  Data directory: /data/rustfs0

[SECURITY WARNING] Please change the default value for RUSTFS_ACCESS_KEY/RUSTFS_SECRET_KEY immediately ...
  Config file: /etc/default/rustfs
```

## 2. Définir vos identifiants

Le fichier de configuration généré contient des identifiants indicatifs. Définissez votre propre clé d’accès et votre propre clé secrète, puis redémarrez le service :

```ini title="/etc/default/rustfs" {1,2}
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>   ; e.g. output of: openssl rand -base64 24
```

Utilisez une clé d’accès alphanumérique en majuscules. N’utilisez pas une sortie Base64 non modifiée pour `RUSTFS_ACCESS_KEY`, car Base64 peut contenir `/`, ce qui entre en conflit avec le périmètre d’identifiants d’AWS Signature Version 4. Pour le détail, consultez la [gestion des identifiants](/fr/operations/credentials).

```bash
sudo systemctl restart rustfs
sudo systemctl status rustfs --no-pager   # should report: active (running)
```

:::warning[Ne conservez pas les identifiants par défaut]

Si `RUSTFS_ACCESS_KEY` et `RUSTFS_SECRET_KEY` ne sont pas définis, le serveur revient à la valeur intégrée par défaut `rustfsadmin` / `rustfsadmin`. C’est acceptable pour un test local éphémère, jamais pour une instance accessible à d’autres personnes.

:::

## 3. Se connecter à la Console

Ouvrez `http://<server-ip>:9001` dans votre navigateur et connectez-vous avec la clé d’accès et la clé secrète de l’étape 2.

![Connexion à la Console RustFS](./images/console.jpg)

## 4. Créer un compartiment et charger un fichier

1. Sur la page d’accueil de la Console, sélectionnez **Create Bucket** (créer un compartiment), nommez-le (par exemple `my-bucket`), puis confirmez.
2. Ouvrez le compartiment et utilisez l’action de chargement pour ajouter un fichier local quelconque.
3. Cliquez sur l’objet chargé pour afficher ses détails : vous disposez d’un stockage objet opérationnel.

Vous préférez la ligne de commande ? Configurez [`rc`](/fr/operations/rc), puis effectuez les mêmes opérations :

```bash
rc alias set rustfs http://<server-ip>:9000 <your-access-key> <your-secret-key>
rc bucket create rustfs/my-bucket
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object list rustfs/my-bucket
```

```text
✓ Bucket 'rustfs/my-bucket' created successfully.
/path/to/hello.txt -> rustfs/my-bucket/hello.txt
```

<a id="mode"></a>

## Étapes suivantes

L’installation rapide exécute RustFS en mode **nœud unique, disque unique (SNSD)**, sans aucune redondance, adapté à l’évaluation et au développement. La suite dépend de votre objectif :

- **Planifier un déploiement de production** — choisissez une topologie, puis suivez le guide correspondant :
  - [Nœud unique, disque unique (SNSD)](./single-node-single-disk.md) — développement et petites charges
  - [Nœud unique, disques multiples (SNMD)](./single-node-multiple-disk.md) — tolérance aux pannes de disque sur une seule machine
  - [Nœuds multiples, disques multiples (MNMD)](./multiple-node-multiple-disk.md) — disponibilité et montée en charge de niveau production, avec les [listes de contrôle préalables à l’installation](../requirement/checklists/index.md)
- **Vous préférez les conteneurs ?** — [Installer avec un conteneur](../container/index.md)
- **Connecter votre application** — [SDK et exemples](../../developer/sdk/index.md)
