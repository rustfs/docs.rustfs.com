---
title: "Python-SDK-Anleitung"
description: "Verwenden Sie das offizielle AWS SDK für Python (Boto3) mit RustFS."
---

## 1. Überblick

RustFS enthält keine eigenen SDKs. Der Dienst ist S3-kompatibel, daher verwenden Sie das offizielle AWS SDK für Python, [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html), und richten es auf Ihren RustFS-Server aus.

Diese Anleitung behandelt:

* das Erstellen und Löschen von Buckets
* das Hochladen, Herunterladen und Löschen von Objekten
* das Auflisten von Objekten
* das Erzeugen vorsignierter URLs
* den mehrteiligen Upload für große Dateien

---

## 2. Voraussetzungen

* Python 3.8 oder höher
* Eine laufende RustFS-Instanz (siehe [Installationsanleitung](../../installation/index.md)). Die S3-API nimmt Verbindungen auf Port `9000` entgegen, die Console (Weboberfläche) auf Port `9001`
* Zugriffsschlüssel, die Sie bei der Installation über die Umgebungsvariablen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` setzen (siehe [Zugriffsschlüssel-Verwaltung](../../security-compliance/iam/access-token.md))

:::tip[Lokaler Test]

Wenn Sie bei der Installation keine Anmeldedaten gesetzt haben, verwendet der Server standardmäßig `rustfsadmin` / `rustfsadmin`. Das reicht für einen wegwerfbaren lokalen Test, niemals für eine Instanz, die andere erreichen können.

:::

### 2.1 Boto3 installieren

Wir empfehlen eine virtuelle Umgebung:

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 hängt von `botocore` ab. Das Paket wird automatisch installiert.

---

## 3. Verbindung mit RustFS

Das folgende Skript ist vollständig und ausführbar. Ersetzen Sie `localhost` durch die IP-Adresse Ihres Servers, wenn RustFS auf einem anderen Rechner läuft, und tragen Sie Ihre eigenen Zugriffsschlüssel ein:

```python title="main.py"
import boto3
from botocore.client import Config

s3 = boto3.client(
    's3',
    endpoint_url='http://localhost:9000',
    aws_access_key_id='<your-access-key>',
    aws_secret_access_key='<your-secret-key>',
    region_name='us-east-1',
    config=Config(
        signature_version='s3v4',
        s3={'addressing_style': 'path'},
    ),
)

response = s3.list_buckets()
for bucket in response['Buckets']:
    print(bucket['Name'])
```

Führen Sie es aus:

```bash
python main.py
```

:::note[Erläuterung der Client-Parameter]

- `endpoint_url`: zeigt auf Ihre RustFS-S3-API (Port `9000`, nicht der Port `9001` der Console)
- `signature_version='s3v4'`: RustFS unterstützt v4-Signaturen
- `region_name='us-east-1'`: die Standardregion von RustFS
- `addressing_style='path'`: RustFS verwendet standardmäßig pfadbasierte Adressierung (Path-Style). Für die Adressierung im Virtual-Hosted-Stil ist `RUSTFS_SERVER_DOMAINS` erforderlich

:::

---

## 4. Grundlegende Operationen

### 4.1 Bucket erstellen

```python
bucket_name = 'my-bucket'

try:
    s3.create_bucket(Bucket=bucket_name)
    print(f'Bucket {bucket_name} created.')
except s3.exceptions.BucketAlreadyOwnedByYou:
    print(f'Bucket {bucket_name} already exists.')
```

```text
Bucket my-bucket created.
```

---

### 4.2 Datei hochladen

```python
s3.upload_file('/path/to/hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

```text
File uploaded.
```

---

### 4.3 Datei herunterladen

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

```text
File downloaded.
```

---

### 4.4 Objekte auflisten

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

```text
- hello.txt (12 bytes)
```

---

### 4.5 Objekt und Bucket löschen

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Object deleted.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket deleted.')
```

```text
Object deleted.
Bucket deleted.
```

---

## 5. Erweiterte Funktionen

### 5.1 Vorsignierte URLs erzeugen

#### 5.1.1 Download-Link (GET)

```python
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
    ExpiresIn=600,  # 10 minutes validity
)

print('Presigned GET URL:', url)
```

```text
Presigned GET URL: http://localhost:9000/my-bucket/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

#### 5.1.2 Upload-Link (PUT)

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600,
)

print('Presigned PUT URL:', url)
```

Sie können mit `curl` hochladen:

```bash
curl -X PUT --upload-file /path/to/hello.txt "http://localhost:9000/my-bucket/upload-by-url.txt?X-Amz-Algorithm=..."
```

---

### 5.2 Mehrteiliger Upload

Verwenden Sie den mehrteiligen Upload für Dateien über 10 MB, wenn Sie jeden Teil steuern müssen.

```python
file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024  # 5 MB

# 1. Start upload
response = s3.create_multipart_upload(Bucket=bucket_name, Key=key)
upload_id = response['UploadId']
parts = []

try:
    with open(file_path, 'rb') as f:
        part_number = 1
        while True:
            data = f.read(part_size)
            if not data:
                break

            part = s3.upload_part(
                Bucket=bucket_name,
                Key=key,
                PartNumber=part_number,
                UploadId=upload_id,
                Body=data,
            )

            parts.append({'ETag': part['ETag'], 'PartNumber': part_number})
            print(f'Uploaded part {part_number}')
            part_number += 1

    # 2. Complete upload
    s3.complete_multipart_upload(
        Bucket=bucket_name,
        Key=key,
        UploadId=upload_id,
        MultipartUpload={'Parts': parts},
    )
    print('Multipart upload complete.')

except Exception as e:
    # Abort upload
    s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
    print('Multipart upload aborted due to error:', e)
```

```text
Uploaded part 1
Uploaded part 2
Uploaded part 3
Multipart upload complete.
```

---

## 6. Fehlerbehebung

| Problem | Ursache | Lösung |
| --- | --- | --- |
| `SignatureDoesNotMatch` | Es wird keine v4-Signatur verwendet | Setzen Sie `signature_version='s3v4'` |
| `EndpointConnectionError` | Falsche RustFS-Adresse, oder der Dienst ist nicht gestartet | Prüfen Sie den Endpunkt und den Status des RustFS-Dienstes |
| `AccessDenied` | Falsche Zugangsdaten oder unzureichende Berechtigungen | Prüfen Sie Zugriffsschlüssel, geheimen Zugriffsschlüssel und die Bucket-Richtlinien |
| `PermanentRedirect` oder falsche Bucket-URL | Pfadbasierte Adressierung ist nicht aktiviert | Setzen Sie in der `Config` den Wert `s3={'addressing_style': 'path'}` |

---

## 7. Anhang: Kurzes Skript zum Hoch- und Herunterladen

```python
def upload_file(local_path, bucket, object_key):
    s3.upload_file(local_path, bucket, object_key)
    print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")


def download_file(bucket, object_key, local_path):
    s3.download_file(bucket, object_key, local_path)
    print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```

Weitere Operationen (Objekt-Tagging, Bucket-Richtlinien und mehr) stehen in der [Boto3-S3-Dokumentation](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html). Die meisten S3-Operationen funktionieren gegenüber RustFS auf dieselbe Weise. Ausnahmen stehen unter [S3-Kompatibilität](/de/reference/s3-compatibility).

Wenn Sie native asynchrone Unterstützung und vollständige Typhinweise bevorzugen, funktioniert auch das von der Community entwickelte SDK [capo](https://github.com/kap-sh/capo) mit RustFS. Lesen Sie die [Integrationsanleitung für capo (Python)](../integration/others/capo.md).
