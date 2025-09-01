---
title: "Python SDK"
description: "Dieses Dokument erklärt hauptsächlich die Verwendung des Python SDK in RustFS."
---

Hier ist die **vollständige RustFS-Dokumentation für die Verwendung des S3 Python SDK (Boto3)**, einschließlich Installation, Verbindung, grundlegende Operationen, erweiterte Funktionen (Presigned URL und mehrteilige Uploads) usw., geeignet für Entwickler, die Python für die Integration mit RustFS verwenden.

---

# RustFS S3 Python SDK (Boto3) Dokumentation

## I. Überblick

RustFS ist ein Amazon S3-protokollkompatibles Objektspeichersystem, das über Pythons [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK zugänglich ist.

Dieses Tutorial erklärt, wie man Python mit RustFS integriert und folgende Operationen über Boto3 durchführt:

* Bucket-Erstellung/-Löschung
* Objekt-Upload/-Download/-Löschung
* Objekt-Auflistung
* Presigned URL-Generierung
* Mehrteiliger Upload großer Dateien

---

## II. Umgebungsvorbereitung

### 2.1 RustFS-Informationen

Angenommen, RustFS ist wie folgt bereitgestellt:

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Boto3-Installation

Empfohlen wird die Verwendung einer `venv`-virtuellen Umgebung:

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 hängt von `botocore` ab, wird automatisch installiert.

---

## III. Verbindung zu RustFS

```python
import boto3
from botocore.client import Config

s3 = boto3.client(
    's3',
    endpoint_url='http://192.168.1.100:9000',
    aws_access_key_id='rustfsadmin',
    aws_secret_access_key='rustfssecret',
    config=Config(signature_version='s3v4'),
    region_name='us-east-1'
)
```

> ✅ `endpoint_url`: Zeigt auf RustFS
> ✅ `signature_version='s3v4'`: RustFS unterstützt v4-Signierung
> ✅ `region_name`: RustFS validiert Region nicht, beliebiger Wert möglich

---

## IV. Grundoperationen

### 4.1 Bucket erstellen

```python
bucket_name = 'my-bucket'

try:
    s3.create_bucket(Bucket=bucket_name)
    print(f'Bucket {bucket_name} created.')
except s3.exceptions.BucketAlreadyOwnedByYou:
    print(f'Bucket {bucket_name} already exists.')
```

### 4.2 Datei hochladen

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

### 4.3 Datei herunterladen

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

### 4.4 Objekte auflisten

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

### 4.5 Objekt und Bucket löschen

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Object deleted.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket deleted.')
```

---

## V. Erweiterte Funktionen

### 5.1 Presigned URL generieren

#### 5.1.1 Download-Link (GET)

```python
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
    ExpiresIn=600  # 10 Minuten Gültigkeitsdauer
)

print('Presigned GET URL:', url)
```

#### 5.1.2 Upload-Link (PUT)

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600
)

print('Presigned PUT URL:', url)
```

Sie können das `curl`-Tool zum Hochladen verwenden:

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

### 5.2 Mehrteiliger Upload (Multipart Upload)

Geeignet für Dateien größer als 10 MB, manuelle Kontrolle jedes Teils möglich.

```python
import os

file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024  # 5 MB

# 1. Upload starten
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
                Body=data
            )

            parts.append({'ETag': part['ETag'], 'PartNumber': part_number})
            print(f'Uploaded part {part_number}')
            part_number += 1

    # 2. Upload abschließen
    s3.complete_multipart_upload(
        Bucket=bucket_name,
        Key=key,
        UploadId=upload_id,
        MultipartUpload={'Parts': parts}
    )
    print('Multipart upload complete.')

except Exception as e:
    # Upload abbrechen
    s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
    print('Multipart upload aborted due to error:', e)
```

---

## VI. Häufige Problembehandlung

| Problem | Ursache | Lösung |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | Keine v4-Signierung verwendet | `signature_version='s3v4'` setzen |
| `EndpointConnectionError` | RustFS-Adresse falsch oder Service nicht gestartet | Endpoint und RustFS-Service-Status prüfen |
| `AccessDenied` | Anmeldedaten falsch oder unzureichende Berechtigungen | AccessKey/SecretKey oder Bucket-Richtlinien prüfen |
| `PermanentRedirect` | Path-style nicht aktiviert | Boto3 verwendet standardmäßig virtual-host, RustFS unterstützt nur path-style, aber Endpoint-Einstellung kann umgehen |

---

## VII. Anhang: Schnelle Upload-/Download-Skriptvorlage

```python
def upload_file(local_path, bucket, object_key):
    s3.upload_file(local_path, bucket, object_key)
    print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")

def download_file(bucket, object_key, local_path):
    s3.download_file(bucket, object_key, local_path)
    print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```

