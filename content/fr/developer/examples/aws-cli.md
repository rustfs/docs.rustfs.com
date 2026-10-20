---
title: "AWS CLI"
description: "Connectez l’AWS CLI à RustFS et effectuez des opérations objet de base."
---

L’[AWS CLI](https://docs.aws.amazon.com/cli/) est l’outil en ligne de commande officiel d’Amazon pour S3. Il fonctionne avec RustFS grâce à l’option `--endpoint-url`.

## Installation

Suivez le [guide d’installation officiel](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) ou, sous macOS :

```bash
brew install awscli
```

## Configuration

Définissez vos [clés d’accès](../../security-compliance/iam/access-token.md) et la région :

```bash
aws configure
```

```text
AWS Access Key ID [None]: <your-access-key>
AWS Secret Access Key [None]: <your-secret-key>
Default region name [None]: us-east-1
Default output format [None]: json
```

Indiquez l’adresse de RustFS avec `--endpoint-url` dans chaque commande. Remplacez `http://localhost:9000` par l’adresse de votre serveur. Lorsque `--endpoint-url` est défini, l’AWS CLI utilise l’adressage de type chemin (path-style), ce que RustFS exige.

:::note

Si vous n’avez pas défini d’identifiants à l’installation, la valeur par défaut pour un essai local est `rustfsadmin` / `rustfsadmin`. Ne l’utilisez jamais au-delà d’un essai local jetable.

:::

## Vérification

Créez un compartiment (bucket) :

```bash
aws s3 mb s3://my-bucket --endpoint-url http://localhost:9000
```

```text
make_bucket: my-bucket
```

Chargez (upload) un fichier :

```bash
aws s3 cp /path/to/hello.txt s3://my-bucket/ --endpoint-url http://localhost:9000
```

```text
upload: ../path/to/hello.txt to s3://my-bucket/hello.txt
```

Listez le compartiment :

```bash
aws s3 ls s3://my-bucket --endpoint-url http://localhost:9000
```

```text
2026-07-15 10:30:00         12 hello.txt
```

## Étapes suivantes

Développez des applications qui s’appuient sur RustFS avec un [SDK S3](../sdk/index.md), ou gérez les objets avec [`rc`](/fr/operations/rc).
