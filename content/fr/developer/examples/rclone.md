---
title: "rclone"
description: "Connectez rclone à RustFS et effectuez des opérations objet de base."
---

[rclone](https://rclone.org/) est un programme en ligne de commande qui synchronise des fichiers avec un stockage cloud et utilise le protocole S3 implémenté par RustFS.

## Installation

```bash
curl https://rclone.org/install.sh | sudo bash
```

Vous pouvez aussi consulter le [guide d’installation officiel](https://rclone.org/install/).

## Configuration

Ajoutez une cible distante dans `~/.config/rclone/rclone.conf`. Remplacez `http://localhost:9000` par l’adresse de votre serveur et utilisez vos propres [clés d’accès](../../security-compliance/iam/access-token.md). `force_path_style = true` est obligatoire, car RustFS utilise l’adressage de type chemin (path-style) :

```ini title="~/.config/rclone/rclone.conf"
[rustfs]
type = s3
provider = Other
access_key_id = <your-access-key>
secret_access_key = <your-secret-key>
endpoint = http://localhost:9000
region = us-east-1
force_path_style = true
```

## Vérification

Créez un compartiment (bucket) :

```bash
rclone mkdir rustfs:my-bucket
```

Chargez (upload) un fichier :

```bash
rclone copy /path/to/hello.txt rustfs:my-bucket
```

Listez les compartiments et leur contenu :

```bash
rclone lsd rustfs:
rclone ls rustfs:my-bucket
```

```text
          -1 2026-07-15 10:30:00        -1 my-bucket
       12 hello.txt
```

## Étapes suivantes

Développez des applications qui s’appuient sur RustFS avec un [SDK S3](../sdk/index.md), ou gérez les objets avec [`rc`](/fr/operations/rc).
