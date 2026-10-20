---
title: "boto3 (Python)"
description: "Verbinden Sie boto3 mit RustFS und führen Sie grundlegende Objektoperationen aus Python aus."
---

[boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) ist das AWS SDK für Python und verbindet sich über einen benutzerdefinierten Endpunkt mit RustFS.

## Installation

```bash
pip install boto3
```

## Konfiguration

Richten Sie den Client auf Ihren RustFS-Endpunkt aus. Ersetzen Sie `http://localhost:9000` durch Ihre Serveradresse und verwenden Sie Ihre eigenen [Zugriffsschlüssel](../../security-compliance/iam/access-token.md). RustFS erfordert pfadbasierte Adressierung (Path-Style). Setzen Sie sie über die botocore-`Config`:

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

## Überprüfung

Erstellen Sie einen Bucket, laden Sie eine Datei hoch und listen Sie den Bucket auf:

```python
s3.create_bucket(Bucket="my-bucket")

s3.upload_file("/path/to/hello.txt", "my-bucket", "hello.txt")

for obj in s3.list_objects_v2(Bucket="my-bucket").get("Contents", []):
    print(obj["Key"], obj["Size"])
```

Erwartete Ausgabe:

```text
hello.txt 12
```

## Nächste Schritte

Weitere Sprachen finden Sie in der [S3-SDK-Übersicht](../sdk/index.md). Objekte verwalten Sie mit [`rc`](/de/operations/rc). Wenn Sie ein von der Community entwickeltes SDK mit nativer asynchroner Unterstützung und vollständiger Typisierung bevorzugen, lesen Sie [capo (Python)](../integration/others/capo.md).
