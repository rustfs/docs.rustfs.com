---
title: "SDK Python"
description: "Ce document explique principalement l'utilisation du SDK Python dans RustFS."
---

Voici la **documentation complète de RustFS pour l'utilisation du S3 Python SDK (Boto3)**, incluant l'installation, la connexion, les opérations de base, les fonctionnalités avancées (URL pré-signées et téléchargement en plusieurs parties) etc., adaptée aux développeurs utilisant Python pour l'intégration avec RustFS.

---

# Documentation RustFS S3 Python SDK (Boto3)

## I. Aperçu

RustFS est un service de stockage d'objets compatible avec le protocole Amazon S3, accessible via le SDK Python [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html).

Ce tutoriel explique comment intégrer Python avec RustFS et effectuer les opérations suivantes via Boto3 :

* Création/suppression de buckets
* Téléchargement/téléversement/suppression d'objets
* Liste des objets
* Génération d'URL pré-signées
* Téléchargement en plusieurs parties de gros fichiers

---

## II. Préparation de l'environnement

### 2.1 Informations RustFS

Supposons que RustFS soit déployé comme suit :

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Installation de Boto3

Il est recommandé d'utiliser un environnement virtuel `venv` :

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 dépend de `botocore`, qui sera installé automatiquement.

---

## III. Connexion à RustFS

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

> ✅ `endpoint_url` : Pointe vers RustFS
> ✅ `signature_version='s3v4'` : RustFS supporte la signature v4
> ✅ `region_name` : RustFS ne valide pas la région, n'importe quelle valeur fonctionne

---

## IV. Opérations de base

### 4.1 Créer un bucket

```python
bucket_name = 'my-bucket'

try:
    s3.create_bucket(Bucket=bucket_name)
    print(f'Bucket {bucket_name} created.')
except s3.exceptions.BucketAlreadyOwnedByYou:
    print(f'Bucket {bucket_name} already exists.')
```

### 4.2 Téléverser un fichier

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

### 4.3 Télécharger un fichier

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

### 4.4 Lister les objets

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

### 4.5 Supprimer un objet et un bucket

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Object deleted.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket deleted.')
```

---

## V. Fonctionnalités avancées

### 5.1 Générer des URL pré-signées

#### 5.1.1 Lien de téléchargement (GET)

```python
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
    ExpiresIn=600  # Validité de 10 minutes
)

print('Presigned GET URL:', url)
```

#### 5.1.2 Lien de téléversement (PUT)

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600
)

print('Presigned PUT URL:', url)
```

Vous pouvez utiliser l'outil `curl` pour téléverser :

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

### 5.2 Téléchargement en plusieurs parties (Multipart Upload)

Adapté pour les fichiers de plus de 10 MB, contrôle manuel de chaque partie possible.

```python
import os

file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024  # 5 MB

# 1. Démarrer le téléchargement
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

    # 2. Terminer le téléchargement
    s3.complete_multipart_upload(
        Bucket=bucket_name,
        Key=key,
        UploadId=upload_id,
        MultipartUpload={'Parts': parts}
    )
    print('Multipart upload complete.')

except Exception as e:
    # Abandonner le téléchargement
    s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
    print('Multipart upload aborted due to error:', e)
```

---

## VI. Résolution des problèmes courants

| Problème | Cause | Solution |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | Signature v4 non utilisée | Définir `signature_version='s3v4'` |
| `EndpointConnectionError` | Adresse RustFS incorrecte ou service non démarré | Vérifier l'endpoint et le statut du service RustFS |
| `AccessDenied` | Identifiants incorrects ou permissions insuffisantes | Vérifier AccessKey/SecretKey ou les politiques de bucket |
| `PermanentRedirect` | Path-style non activé | Boto3 utilise virtual-host par défaut, RustFS ne supporte que path-style, mais la configuration d'endpoint peut contourner |

---

## VII. Annexe : Modèle de script rapide téléversement/téléchargement

```python
def upload_file(local_path, bucket, object_key):
    s3.upload_file(local_path, bucket, object_key)
    print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")

def download_file(bucket, object_key, local_path):
    s3.download_file(bucket, object_key, local_path)
    print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```

