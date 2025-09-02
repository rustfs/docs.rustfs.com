---
title: "Python SDK"
description: "Dieser Artikel erklärt hauptsächlich die Verwendung des Python SDK in RustFS."
---

Dies ist die **vollständige Dokumentation für die Verwendung des S3 Python SDK (Boto3) mit RustFS**, die Installation, Verbindung, grundlegende Operationen, erweiterte Funktionen (Presigned URL und Multipart-Upload) und mehr enthält, geeignet für Entwickler, die Python mit RustFS integrieren möchten.

---

# RustFS S3 Python SDK (Boto3) Dokumentation

## I. Übersicht

RustFS ist ein Amazon S3-kompatibler Objektspeicherdienst, der über das [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK von Python integriert werden kann.

Dieses Tutorial erklärt, wie Sie Python mit RustFS integrieren und die folgenden Operationen mit Boto3 durchführen:

* Bucket erstellen/löschen
* Objekte hochladen/herunterladen/löschen
* Objekte auflisten
* Presigned URLs generieren
* Große Dateien mit Multipart-Upload hochladen

---

## II. Umgebungsvorbereitung

### 2.1 RustFS-Informationen

Angenommen, RustFS ist wie folgt bereitgestellt:

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Boto3 installieren

Empfohlen wird die Verwendung einer `venv` virtuellen Umgebung:

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 hängt von `botocore` ab und wird automatisch installiert.

---

## III. Grundlegende Konfiguration

### 3.1 S3-Client erstellen

```python
import boto3
from botocore.config import Config

# S3-Client konfigurieren
s3_client = boto3.client(
    's3',
    endpoint_url='http://192.168.1.100:9000',
    aws_access_key_id='rustfsadmin',
    aws_secret_access_key='rustfssecret',
    region_name='us-east-1',
    config=Config(signature_version='s3v4')
)

print("S3-Client erfolgreich erstellt!")
```

### 3.2 Verbindung testen

```python
# Verbindung testen
try:
    response = s3_client.list_buckets()
    print("Verbindung erfolgreich!")
    print(f"Verfügbare Buckets: {[bucket['Name'] for bucket in response['Buckets']]}")
except Exception as e:
    print(f"Verbindungsfehler: {e}")
```

---

## IV. Bucket-Operationen

### 4.1 Bucket erstellen

```python
def create_bucket(bucket_name):
    try:
        s3_client.create_bucket(Bucket=bucket_name)
        print(f"Bucket '{bucket_name}' erfolgreich erstellt!")
    except Exception as e:
        print(f"Fehler beim Erstellen des Buckets: {e}")

# Beispiel
create_bucket('mein-test-bucket')
```

### 4.2 Bucket auflisten

```python
def list_buckets():
    try:
        response = s3_client.list_buckets()
        print("Verfügbare Buckets:")
        for bucket in response['Buckets']:
            print(f"- {bucket['Name']} (erstellt: {bucket['CreationDate']})")
    except Exception as e:
        print(f"Fehler beim Auflisten der Buckets: {e}")

list_buckets()
```

### 4.3 Bucket löschen

```python
def delete_bucket(bucket_name):
    try:
        s3_client.delete_bucket(Bucket=bucket_name)
        print(f"Bucket '{bucket_name}' erfolgreich gelöscht!")
    except Exception as e:
        print(f"Fehler beim Löschen des Buckets: {e}")

# Beispiel
delete_bucket('mein-test-bucket')
```

---

## V. Objekt-Operationen

### 5.1 Objekt hochladen

```python
def upload_object(bucket_name, object_key, file_path):
    try:
        s3_client.upload_file(file_path, bucket_name, object_key)
        print(f"Objekt '{object_key}' erfolgreich hochgeladen!")
    except Exception as e:
        print(f"Fehler beim Hochladen: {e}")

# Beispiel
upload_object('mein-test-bucket', 'test-dokument.txt', '/pfad/zur/datei.txt')
```

### 5.2 Objekt herunterladen

```python
def download_object(bucket_name, object_key, local_path):
    try:
        s3_client.download_file(bucket_name, object_key, local_path)
        print(f"Objekt '{object_key}' erfolgreich heruntergeladen!")
    except Exception as e:
        print(f"Fehler beim Herunterladen: {e}")

# Beispiel
download_object('mein-test-bucket', 'test-dokument.txt', '/pfad/zur/heruntergeladenen/datei.txt')
```

### 5.3 Objekt löschen

```python
def delete_object(bucket_name, object_key):
    try:
        s3_client.delete_object(Bucket=bucket_name, Key=object_key)
        print(f"Objekt '{object_key}' erfolgreich gelöscht!")
    except Exception as e:
        print(f"Fehler beim Löschen: {e}")

# Beispiel
delete_object('mein-test-bucket', 'test-dokument.txt')
```

### 5.4 Objekte auflisten

```python
def list_objects(bucket_name, prefix=''):
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        if 'Contents' in response:
            print(f"Objekte im Bucket '{bucket_name}':")
            for obj in response['Contents']:
                print(f"- {obj['Key']} ({obj['Size']} Bytes)")
        else:
            print("Keine Objekte gefunden.")
    except Exception as e:
        print(f"Fehler beim Auflisten: {e}")

# Beispiel
list_objects('mein-test-bucket')
```

---

## VI. Erweiterte Funktionen

### 6.1 Presigned URL generieren

```python
def generate_presigned_url(bucket_name, object_key, expiration=3600):
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_key},
            ExpiresIn=expiration
        )
        print(f"Presigned URL: {url}")
        return url
    except Exception as e:
        print(f"Fehler beim Generieren der Presigned URL: {e}")
        return None

# Beispiel
generate_presigned_url('mein-test-bucket', 'test-dokument.txt', 3600)
```

### 6.2 Multipart-Upload für große Dateien

```python
def multipart_upload(bucket_name, object_key, file_path, chunk_size=8*1024*1024):
    try:
        # Upload initialisieren
        response = s3_client.create_multipart_upload(
            Bucket=bucket_name,
            Key=object_key
        )
        upload_id = response['UploadId']
        
        # Datei in Teile aufteilen und hochladen
        parts = []
        with open(file_path, 'rb') as f:
            part_number = 1
            while True:
                chunk = f.read(chunk_size)
                if not chunk:
                    break
                
                response = s3_client.upload_part(
                    Bucket=bucket_name,
                    Key=object_key,
                    PartNumber=part_number,
                    UploadId=upload_id,
                    Body=chunk
                )
                parts.append({
                    'ETag': response['ETag'],
                    'PartNumber': part_number
                })
                part_number += 1
        
        # Upload abschließen
        s3_client.complete_multipart_upload(
            Bucket=bucket_name,
            Key=object_key,
            UploadId=upload_id,
            MultipartUpload={'Parts': parts}
        )
        print(f"Multipart-Upload für '{object_key}' erfolgreich abgeschlossen!")
        
    except Exception as e:
        # Upload abbrechen bei Fehlern
        s3_client.abort_multipart_upload(
            Bucket=bucket_name,
            Key=object_key,
            UploadId=upload_id
        )
        print(f"Fehler beim Multipart-Upload: {e}")

# Beispiel
multipart_upload('mein-test-bucket', 'große-datei.zip', '/pfad/zur/großen/datei.zip')
```

---

## VII. Fehlerbehandlung

### 7.1 Häufige Fehler

```python
import botocore.exceptions

def handle_s3_errors(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except botocore.exceptions.ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'NoSuchBucket':
                print("Bucket existiert nicht.")
            elif error_code == 'NoSuchKey':
                print("Objekt existiert nicht.")
            elif error_code == 'AccessDenied':
                print("Zugriff verweigert.")
            else:
                print(f"Client-Fehler: {e}")
        except Exception as e:
            print(f"Unbekannter Fehler: {e}")
    return wrapper

# Verwendung
@handle_s3_errors
def safe_upload(bucket_name, object_key, file_path):
    s3_client.upload_file(file_path, bucket_name, object_key)
```

---

## VIII. Best Practices

### 8.1 Ressourcenverwaltung

```python
from contextlib import contextmanager

@contextmanager
def s3_client_context():
    client = boto3.client(
        's3',
        endpoint_url='http://192.168.1.100:9000',
        aws_access_key_id='rustfsadmin',
        aws_secret_access_key='rustfssecret',
        region_name='us-east-1'
    )
    try:
        yield client
    finally:
        # Client wird automatisch geschlossen
        pass

# Verwendung
with s3_client_context() as s3:
    s3.list_buckets()
```

### 8.2 Konfiguration

```python
from botocore.config import Config

# Optimierte Konfiguration
config = Config(
    signature_version='s3v4',
    max_pool_connections=50,
    retries={'max_attempts': 3}
)

s3_client = boto3.client(
    's3',
    endpoint_url='http://192.168.1.100:9000',
    aws_access_key_id='rustfsadmin',
    aws_secret_access_key='rustfssecret',
    region_name='us-east-1',
    config=config
)
```

---

## IX. Zusammenfassung

Dieses Tutorial hat gezeigt, wie Sie:

1. Boto3 mit RustFS konfigurieren
2. Bucket-Operationen durchführen
3. Objekt-Operationen durchführen
4. Erweiterte Funktionen wie Presigned URLs und Multipart-Upload nutzen
5. Fehlerbehandlung implementieren
6. Best Practices anwenden

RustFS ist vollständig kompatibel mit dem AWS S3 SDK, sodass Sie alle Standard-S3-Operationen mit Python verwenden können. Weitere Informationen finden Sie in der [Boto3 Dokumentation](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html).
