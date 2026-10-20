---
title: "s3cmd"
description: "Connectez s3cmd à RustFS et effectuez des opérations objet de base depuis la ligne de commande."
---

[s3cmd](https://s3tools.org/s3cmd) est un client en ligne de commande pour le stockage compatible avec S3. Pointez-le vers votre point de terminaison RustFS avec un petit fichier de configuration.

## Installation

```bash
# macOS
brew install s3cmd
# Debian/Ubuntu
sudo apt install s3cmd
# or via pip
pip install s3cmd
```

## Configuration

Créez `~/.s3cfg`. Remplacez `localhost:9000` par l’adresse de votre serveur et utilisez vos propres [clés d’accès](../../security-compliance/iam/access-token.md). RustFS utilise l’adressage de type chemin (path-style) : définissez donc l’hôte du compartiment (bucket) sur le même point de terminaison :

```ini title="~/.s3cfg"
[default]
access_key = <your-access-key>
secret_key = <your-secret-key>
host_base = localhost:9000
host_bucket = localhost:9000
use_https = False
signature_v2 = False
```

:::note

Définissez `use_https = True` et pointez vers le port `9000` si vous avez [configuré TLS](../../integration/tls-configured.md).

:::

## Vérification

Créez un compartiment, chargez (upload) un fichier et listez-le :

```bash
s3cmd mb s3://my-bucket
s3cmd put /path/to/hello.txt s3://my-bucket/hello.txt
s3cmd ls s3://my-bucket
```

```text
upload: '/path/to/hello.txt' -> 's3://my-bucket/hello.txt'  [1 of 1]
2026-07-16 10:00        12   s3://my-bucket/hello.txt
```

## Étapes suivantes

Consultez la [présentation des SDK](../sdk/index.md) pour connecter une application, ou gérez les objets avec [`rc`](/fr/operations/rc).
