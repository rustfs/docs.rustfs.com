---
title: "capo (Python)"
description: "Connectez capo à RustFS et effectuez des opérations objet de base depuis Python avec des clients synchrones ou asynchrones."
---

[capo](https://github.com/kap-sh/capo) est un SDK AWS pour Python développé par la communauté, qui propose des clients entièrement typés avec prise en charge synchrone et asynchrone dès l'installation. Le client S3 est distribué dans le paquet [`capo-s3`](https://pypi.org/project/capo-s3/) et se connecte à RustFS via un point de terminaison personnalisé.

## Installation

capo nécessite Python 3.10 ou ultérieur :

```bash
pip install capo-s3
```

## Configuration

Pointez le client vers votre point de terminaison RustFS. Remplacez `http://localhost:9000` par l'adresse de votre serveur et utilisez vos propres [clés d'accès](../../security-compliance/iam/access-token.md). RustFS exige l'adressage de type chemin, que capo active nativement via `force_path_style` :

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

## Vérification

Créez un compartiment, téléversez un objet et listez le contenu du compartiment :

```python
s3.create_bucket(bucket="my-bucket")

s3.put_object(bucket="my-bucket", key="hello.txt", body=b"hello RustFS\n")

for obj in s3.list_objects_v2(bucket="my-bucket").get("contents", []):
    print(obj["key"], obj["size"])
```

Sortie attendue :

```text
hello.txt 13
```

Pour relire l'objet, `get_object` renvoie une réponse en flux, à utiliser comme gestionnaire de contexte :

```python
with s3.get_object(bucket="my-bucket", key="hello.txt") as response:
    content = b"".join(response["body"])

print(content.decode())
```

Vous pouvez également générer des URL présignées qui accordent un accès limité dans le temps sans identifiants :

```python
url = s3.presigned_get_object(bucket="my-bucket", key="hello.txt", expire_in=3600)
print(url)
```

## Client asynchrone

Le client asynchrone accepte les mêmes arguments et propose les mêmes opérations. Utilisez `await` pour chaque appel ainsi que des gestionnaires de contexte asynchrones pour le client et pour les réponses en flux :

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

## Prochaines étapes

Le listage paginé suit la même convention — `iter_list_objects_v2` itère sur les résultats. Pour l'alternative officielle du SDK AWS, voir [boto3 (Python)](./boto3.md) ; la [présentation des SDK S3](../sdk/index.md) répertorie les autres langages.
