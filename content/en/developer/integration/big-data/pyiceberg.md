---
title: "PyIceberg"
description: "Create, write, and read an Iceberg table through the RustFS S3 Tables REST catalog with PyIceberg."
---

Use **PyIceberg** to create a namespace and table in the RustFS S3 Tables catalog, append two rows, and verify the data after reloading the table. This walkthrough uses PyIceberg `0.10.0` and Python `3.12` with explicitly configured access credentials.

## Before you begin

- Complete [S3 Tables setup](/administration/data/s3-tables), including creating and enabling `my-bucket` and meeting the account and TLS requirements.
- Keep `RUSTFS_ENDPOINT`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_DEFAULT_REGION` set as in that guide.

## 1. Install the client

Create a directory and an isolated Python environment:

```bash
mkdir rustfs-s3-tables
cd rustfs-s3-tables
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install 'pyiceberg[pyarrow]==0.10.0' boto3
```

## 2. Configure the catalog connection

Save the following connection module. It signs both the initial catalog discovery request and subsequent REST requests using the S3 SigV4 signing behavior used by RustFS's [verified client example](https://github.com/rustfs/rustfs/blob/7e0c67111b97703d47e23719b0264a739c8acea8/scripts/table-catalog/pyiceberg_smoke.py).

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

`s3.force-virtual-addressing=false` selects path-style access for this custom endpoint in PyIceberg's PyArrow file implementation.

:::note[Client version]

The adapter overrides PyIceberg's `_init_sigv4` hook so that discovery is signed before the catalog constructor finishes. Keep the pinned PyIceberg version when using this module, and rerun the full walkthrough before changing it.

:::

## 3. Create and read a table

The example creates namespace `analytics` and table `events` and stops if either already exists. Each namespace segment and table name must contain 1–64 ASCII characters: lowercase letters, digits, `_`, or `-`, with a letter or digit at each end. The full namespace, including dots, is limited to 512 characters.

For other names, update `identifier` in `example.py` and the inspection and removal commands below.

Save the following program in the same directory:

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

Run it:

```bash
python example.py
```

The output includes the two complete rows and the current metadata object's S3 URI:

```text
rows: [{"id": 1, "payload": "alpha"}, {"id": 2, "payload": "beta"}]
metadata: s3://my-bucket/<metadata-object-key>
```

The generated metadata object key varies. Successful verification means the table was reloaded from the catalog and its data files were read through S3; table creation alone does not verify either result.

## 4. Inspect or unregister the example

List the table from a new Python process using the same connection module:

```bash
python - <<'PY'
from rustfs_catalog import catalog

print(catalog.list_tables("analytics"))
PY
```

The result should contain `("analytics", "events")`.

:::note[Catalog entries only]

The following commands remove this tutorial’s table entry and its now-empty namespace. The bucket and underlying objects remain. Plan any data cleanup before proceeding: after `drop_table`, table maintenance can no longer find the table. See [maintenance and data protection](/administration/data/s3-tables).

:::

```bash
python - <<'PY'
from rustfs_catalog import catalog

catalog.drop_table(("analytics", "events"))
catalog.drop_namespace("analytics")
PY
```

## Next steps

- Follow the [PyIceberg API documentation](https://py.iceberg.apache.org/api/) for client operations, checking each operation against RustFS's supported scope.
- Use the [external Iceberg catalog integration](/developer/integration/big-data/iceberg) if you manage a separate catalog service.
