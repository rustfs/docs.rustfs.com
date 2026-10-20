---
title: "boto3 (Python)"
description: "Connectez boto3 à RustFS et effectuez des opérations objet de base depuis Python."
---

[boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) est le SDK AWS pour Python. Il se connecte à RustFS par un point de terminaison personnalisé.

## Installation

```bash
pip install boto3
```

## Configuration

Pointez le client vers votre point de terminaison RustFS. Remplacez `http://localhost:9000` par l’adresse de votre serveur et utilisez vos propres [clés d’accès](../../security-compliance/iam/access-token.md). RustFS exige l’adressage de type chemin (path-style), défini via le `Config` de botocore :

```python
import boto3
from botocore.config import Config

s3 = boto3.client(
    "s3",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="<your-access-key>",
    aws_secret_access_key="<your-secret-key>",
    region_name="us-east-1",
    config=Config(s3={"addressing_style": "path"}),
)
```

## Vérification

Créez un compartiment (bucket), chargez (upload) un fichier et listez le compartiment :

```python
s3.create_bucket(Bucket="my-bucket")

s3.upload_file("/path/to/hello.txt", "my-bucket", "hello.txt")

for obj in s3.list_objects_v2(Bucket="my-bucket").get("Contents", []):
    print(obj["Key"], obj["Size"])
```

Sortie attendue :

```text
hello.txt 12
```

## Étapes suivantes

Consultez la [présentation des SDK S3](../sdk/index.md) pour d’autres langages, ou gérez les objets avec [`rc`](/fr/operations/rc). Si vous préférez un SDK communautaire avec une prise en charge asynchrone native et un typage complet, consultez [capo (Python)](../integration/others/capo.md).
