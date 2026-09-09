---
title: "PyIceberg"
description: "Erstellen, schreiben und lesen Sie mit PyIceberg eine Iceberg-Tabelle über den REST-Katalog von RustFS S3 Tables."
---

Mit **PyIceberg** erstellen Sie einen Namespace und eine Tabelle im RustFS-S3-Tables-Katalog, hängen zwei Zeilen an und prüfen die Daten nach erneutem Laden der Tabelle. Diese Anleitung verwendet PyIceberg `0.10.0`, Python `3.12` und ausdrücklich konfigurierte Zugangsdaten.

## Voraussetzungen

- Schließen Sie die [Einrichtung von S3 Tables](/administration/data/s3-tables) ab: Erstellen und aktivieren Sie `my-bucket` und erfüllen Sie die Anforderungen an Konto und TLS.
- Behalten Sie `RUSTFS_ENDPOINT`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` und `AWS_DEFAULT_REGION` wie dort beschrieben bei.

## 1. Client installieren

Erstellen Sie ein Verzeichnis und eine isolierte Python-Umgebung:

```bash
mkdir rustfs-s3-tables
cd rustfs-s3-tables
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install 'pyiceberg[pyarrow]==0.10.0' boto3
```

## 2. Katalogverbindung konfigurieren

Speichern Sie das folgende Verbindungsmodul. Es signiert sowohl die erste Anfrage zur Katalogerkennung als auch nachfolgende REST-Anfragen mit demselben S3-SigV4-Verhalten wie das [validierte Client-Beispiel](https://github.com/rustfs/rustfs/blob/7e0c67111b97703d47e23719b0264a739c8acea8/scripts/table-catalog/pyiceberg_smoke.py) von RustFS.

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

`s3.force-virtual-addressing=false` wählt für diesen benutzerdefinierten Endpunkt die pfadbasierte Adressierung in der PyArrow-Dateiimplementierung von PyIceberg.

:::note[Client-Version]

Der Adapter überschreibt den PyIceberg-Hook `_init_sigv4`, damit die Katalogerkennung bereits vor Abschluss des Konstruktors signiert wird. Behalten Sie bei Verwendung dieses Moduls die festgelegte PyIceberg-Version bei und führen Sie vor einem Versionswechsel die gesamte Anleitung erneut aus.

:::

## 3. Tabelle erstellen und lesen

Das Beispiel erstellt den Namespace `analytics` und die Tabelle `events` und stoppt, wenn eine der Ressourcen bereits vorhanden ist. Jedes Namespace-Segment und jeder Tabellenname muss aus 1–64 ASCII-Zeichen bestehen: Kleinbuchstaben, Ziffern, `_` oder `-`, mit einem Buchstaben oder einer Ziffer an beiden Enden. Der vollständige Namespace darf einschließlich der Punkte höchstens 512 Zeichen lang sein.

Für andere Namen ändern Sie `identifier` in `example.py` sowie die Namen in den nachfolgenden Prüf- und Entfernungsbefehlen.

Speichern Sie das folgende Programm im selben Verzeichnis:

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

Führen Sie es aus:

```bash
python example.py
```

Die Ausgabe enthält die beiden vollständigen Zeilen und den S3-URI des aktuellen Metadatenobjekts:

```text
rows: [{"id": 1, "payload": "alpha"}, {"id": 2, "payload": "beta"}]
metadata: s3://my-bucket/<metadata-object-key>
```

Der erzeugte Objektschlüssel für die Metadaten variiert. Eine erfolgreiche Prüfung bedeutet, dass die Tabelle aus dem Katalog neu geladen und ihre Datendateien über S3 gelesen wurden. Das Erstellen der Tabelle allein prüft keines dieser Ergebnisse.

## 4. Beispiel prüfen oder aus dem Katalog entfernen

Listen Sie die Tabelle in einem neuen Python-Prozess mit demselben Verbindungsmodul auf:

```bash
python - <<'PY'
from rustfs_catalog import catalog

print(catalog.list_tables("analytics"))
PY
```

Das Ergebnis sollte `("analytics", "events")` enthalten.

:::note[Nur Katalogeinträge entfernen]

Die folgenden Befehle entfernen den Tabelleneintrag dieser Anleitung und den anschließend leeren Namespace. Bucket und zugrunde liegende Objekte bleiben erhalten. Planen Sie eine eventuelle Datenbereinigung vorab: Nach `drop_table` kann die Tabellenwartung die Tabelle nicht mehr finden. Siehe [Wartung und Schutz vor Datenverlust](/administration/data/s3-tables).

:::

```bash
python - <<'PY'
from rustfs_catalog import catalog

catalog.drop_table(("analytics", "events"))
catalog.drop_namespace("analytics")
PY
```

## Nächste Schritte

- Nutzen Sie die [PyIceberg-API-Dokumentation](https://py.iceberg.apache.org/api/) für Client-Operationen und gleichen Sie jede Operation mit dem RustFS-Supportumfang ab.
- Verwenden Sie die [Integration mit externem Iceberg-Katalog](/developer/integration/big-data/iceberg), wenn Sie einen separaten Katalogdienst betreiben.
