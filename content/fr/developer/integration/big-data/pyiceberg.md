---
title: "PyIceberg"
description: "Créez, écrivez et lisez une table Iceberg avec PyIceberg via le catalogue REST de RustFS S3 Tables."
---

Utilisez **PyIceberg** pour créer un espace de noms et une table dans le catalogue RustFS S3 Tables, ajouter deux lignes et vérifier les données après avoir rechargé la table. Ce tutoriel utilise PyIceberg `0.10.0` et Python `3.12`, avec des informations d’identification configurées explicitement.

## Prérequis

- Terminez la [configuration de S3 Tables](/administration/data/s3-tables) : créez et activez `my-bucket` et respectez les exigences relatives au compte et à TLS.
- Conservez les variables `RUSTFS_ENDPOINT`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` et `AWS_DEFAULT_REGION` définies dans ce guide.

## 1. Installer le client

Créez un répertoire et un environnement Python isolé :

```bash
mkdir rustfs-s3-tables
cd rustfs-s3-tables
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install 'pyiceberg[pyarrow]==0.10.0' boto3
```

## 2. Configurer la connexion au catalogue

Enregistrez le module de connexion suivant. Il signe la requête initiale de découverte du catalogue et les requêtes REST suivantes avec le même comportement S3 SigV4 que l’[exemple client validé](https://github.com/rustfs/rustfs/blob/7e0c67111b97703d47e23719b0264a739c8acea8/scripts/table-catalog/pyiceberg_smoke.py) de RustFS.

```python title="rustfs_catalog.py"
import hashlib
import os

from botocore.auth import S3SigV4Auth
from botocore.awsrequest import AWSRequest
from botocore.credentials import Credentials
from pyiceberg.catalog.rest import RestCatalog
from requests.adapters import HTTPAdapter

endpoint = os.environ["RUSTFS_ENDPOINT"].rstrip("/")
region = os.environ["AWS_DEFAULT_REGION"]
access_key = os.environ["AWS_ACCESS_KEY_ID"]
secret_key = os.environ["AWS_SECRET_ACCESS_KEY"]
credentials = Credentials(access_key, secret_key)


class RustFSSigV4Adapter(HTTPAdapter):
    def add_headers(self, request, **kwargs):
        body = request.body or b""
        if isinstance(body, str):
            body = body.encode("utf-8")
        request.headers["x-amz-content-sha256"] = hashlib.sha256(body).hexdigest()
        request.headers.pop("connection", None)
        signed = AWSRequest(
            method=request.method,
            url=request.url,
            data=body,
            headers=dict(request.headers),
        )
        S3SigV4Auth(credentials, "s3", region).add_auth(signed)
        request.headers.update(signed.headers)


class RustFSRestCatalog(RestCatalog):
    def _init_sigv4(self, session):
        session.mount(self.uri, RustFSSigV4Adapter())


catalog = RustFSRestCatalog(
    "rustfs",
    **{
        "uri": f"{endpoint}/iceberg",
        "warehouse": "my-bucket",
        "prefix": "my-bucket",
        "rest.sigv4-enabled": "true",
        "rest.signing-name": "s3",
        "rest.signing-region": region,
        "py-io-impl": "pyiceberg.io.pyarrow.PyArrowFileIO",
        "s3.endpoint": endpoint,
        "s3.access-key-id": access_key,
        "s3.secret-access-key": secret_key,
        "s3.region": region,
        "s3.force-virtual-addressing": "false",
    },
)
```

`s3.force-virtual-addressing=false` sélectionne l’adressage de type chemin pour ce point de terminaison personnalisé dans l’implémentation de fichiers PyArrow de PyIceberg.

:::note[Version du client]

L’adaptateur redéfinit le hook `_init_sigv4` de PyIceberg afin que la découverte soit signée avant la fin du constructeur du catalogue. Conservez la version PyIceberg fixée pour ce module et réexécutez tout le tutoriel avant d’en changer.

:::

## 3. Créer et lire une table

L’exemple crée l’espace de noms `analytics` et la table `events` et s’arrête si l’une de ces ressources existe déjà. Chaque segment d’espace de noms et chaque nom de table doit comporter 1–64 caractères ASCII : lettres minuscules, chiffres, `_` ou `-`, avec une lettre ou un chiffre à chaque extrémité. L’espace de noms complet est limité à 512 caractères, points compris.

Pour utiliser d’autres noms, modifiez `identifier` dans `example.py` ainsi que les noms dans les commandes d’inspection et de suppression ci-dessous.

Enregistrez le programme suivant dans le même répertoire :

```python title="example.py"
import json

import pyarrow as pa

from rustfs_catalog import catalog

identifier = ("analytics", "events")
schema = pa.schema(
    [
        pa.field("id", pa.int64(), nullable=False),
        pa.field("payload", pa.string(), nullable=False),
    ]
)
expected = [{"id": 1, "payload": "alpha"}, {"id": 2, "payload": "beta"}]

catalog.create_namespace(identifier[0])
catalog.create_table(identifier, schema=schema)
table = catalog.load_table(identifier)
table.append(pa.Table.from_pylist(expected, schema=schema))

loaded = catalog.load_table(identifier)
actual = sorted(loaded.scan().to_arrow().to_pylist(), key=lambda row: row["id"])
assert actual == expected, f"Unexpected table contents: {actual}"
print("rows:", json.dumps(actual))
print("metadata:", loaded.metadata_location)
```

Exécutez-le :

```bash
python example.py
```

La sortie contient les deux lignes complètes et l’URI S3 de l’objet de métadonnées courant :

```text
rows: [{"id": 1, "payload": "alpha"}, {"id": 2, "payload": "beta"}]
metadata: s3://my-bucket/<metadata-object-key>
```

La clé générée pour l’objet de métadonnées varie. Une vérification réussie signifie que la table a été rechargée depuis le catalogue et que ses fichiers de données ont été lus via S3. La seule création de la table ne vérifie aucun de ces deux résultats.

## 4. Inspecter l’exemple ou le retirer du catalogue

Listez la table dans un nouveau processus Python avec le même module de connexion :

```bash
python - <<'PY'
from rustfs_catalog import catalog

print(catalog.list_tables("analytics"))
PY
```

Le résultat devrait contenir `("analytics", "events")`.

:::note[Suppression des entrées du catalogue uniquement]

Les commandes suivantes retirent l’entrée de table de ce tutoriel et son espace de noms devenu vide. Le compartiment et les objets sous-jacents sont conservés. Planifiez tout nettoyage de données avant de continuer : après `drop_table`, la maintenance ne peut plus trouver la table. Consultez la [maintenance et la protection des données](/administration/data/s3-tables).

:::

```bash
python - <<'PY'
from rustfs_catalog import catalog

catalog.drop_table(("analytics", "events"))
catalog.drop_namespace("analytics")
PY
```

## Étapes suivantes

- Suivez la [documentation de l’API PyIceberg](https://py.iceberg.apache.org/api/) pour les opérations client, en vérifiant chacune par rapport au périmètre pris en charge par RustFS.
- Utilisez l’[intégration avec un catalogue Iceberg externe](/developer/integration/big-data/iceberg) si vous gérez un service de catalogue séparé.
