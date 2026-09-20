---
title: "capo (Python)"
description: "Verbinden Sie capo mit RustFS und führen Sie grundlegende Objektoperationen aus Python mit synchronen oder asynchronen Clients aus."
---

[capo](https://github.com/kap-sh/capo) ist ein von der Community entwickeltes AWS-SDK für Python, das vollständig typisierte Clients mit synchroner und asynchroner Unterstützung bietet. Der S3-Client wird als Paket [`capo-s3`](https://pypi.org/project/capo-s3/) ausgeliefert und verbindet sich über einen benutzerdefinierten Endpunkt mit RustFS.

## Installation

capo erfordert Python 3.10 oder höher:

```bash
pip install capo-s3
```

## Konfiguration

Richten Sie den Client auf Ihren RustFS-Endpunkt aus. Ersetzen Sie `http://localhost:9000` durch Ihre Serveradresse und verwenden Sie Ihre eigenen [Zugriffsschlüssel](../../security-compliance/iam/access-token.md). RustFS erfordert pfadbasierte Adressierung, die capo nativ über `force_path_style` aktiviert:

```python
from capo_s3 import Credentials, S3Client

s3 = S3Client(
    region="us-east-1",
    endpoint="http://localhost:9000",
    credentials=Credentials(
        access_key="<your-access-key>",
        secret_key="<your-secret-key>",
    ),
    force_path_style=True,
)
```

## Verifikation

Erstellen Sie einen Bucket, laden Sie ein Objekt hoch und listen Sie den Bucket auf:

```python
s3.create_bucket(bucket="my-bucket")

s3.put_object(bucket="my-bucket", key="hello.txt", body=b"hello RustFS\n")

for obj in s3.list_objects_v2(bucket="my-bucket").get("contents", []):
    print(obj["key"], obj["size"])
```

Erwartete Ausgabe:

```text
hello.txt 13
```

Beim Zurücklesen gibt `get_object` eine Streaming-Antwort zurück, die als Kontextmanager verwendet wird:

```python
with s3.get_object(bucket="my-bucket", key="hello.txt") as response:
    content = b"".join(response["body"])

print(content.decode())
```

Sie können außerdem vorsignierte URLs generieren, die zeitlich begrenzten Zugriff ohne Anmeldeinformationen gewähren:

```python
url = s3.presigned_get_object(bucket="my-bucket", key="hello.txt", expire_in=3600)
print(url)
```

## Asynchroner Client

Der asynchrone Client akzeptiert dieselben Argumente und spiegelt jede Operation. Awaiten Sie jeden Aufruf und verwenden Sie asynchrone Kontextmanager für den Client sowie für Streaming-Antworten:

```python
import asyncio

from capo_s3 import AsyncS3Client, Body, Credentials


async def main() -> None:
    async with AsyncS3Client(
        region="us-east-1",
        endpoint="http://localhost:9000",
        credentials=Credentials(
            access_key="<your-access-key>",
            secret_key="<your-secret-key>",
        ),
        force_path_style=True,
    ) as s3:
        await s3.create_bucket(bucket="my-bucket")

        await s3.put_object(
            bucket="my-bucket",
            key="hello.txt",
            body=Body.async_from_path("/path/to/hello.txt"),
        )

        async with s3.get_object(bucket="my-bucket", key="hello.txt") as response:
            content = b"".join([chunk async for chunk in response["body"]])

        print(content.decode())


asyncio.run(main())
```

## Nächste Schritte

Die paginierte Auflistung folgt derselben Konvention — `iter_list_objects_v2` iteriert über die Ergebnisse. Informationen zur offiziellen AWS-SDK-Alternative finden Sie unter [boto3 (Python)](./boto3.md); weitere Sprachen finden Sie in der [S3-SDK-Übersicht](../sdk/index.md).
