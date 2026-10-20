---
title: "Guide du SDK Python"
description: "Utilisez le SDK AWS officiel pour Python (Boto3) avec RustFS."
---

## 1. Présentation

RustFS ne fournit pas de SDK propres. Il est compatible avec S3 : vous utilisez donc le SDK AWS officiel pour Python, [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html), configuré pour pointer vers votre serveur RustFS.

Ce guide couvre :

* La création et la suppression de compartiments (buckets)
* Le chargement (upload), le téléchargement et la suppression d’objets
* Le listage des objets
* La génération d’URL présignées
* Le chargement partitionné des fichiers volumineux

---

## 2. Prérequis

* Python 3.8 ou ultérieur
* Une instance RustFS en cours d’exécution (consultez le [guide d’installation](../../installation/index.md)) : l’API S3 écoute sur le port `9000`, la Console sur le port `9001`
* Des clés d’accès, définies à l’installation par les variables d’environnement `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` (consultez la [gestion des clés d’accès](../../security-compliance/iam/access-token.md))

:::tip[Essai local]

Si vous n’avez pas défini d’identifiants à l’installation, le serveur utilise par défaut `rustfsadmin` / `rustfsadmin`. Cela convient à un essai local jetable, jamais à une instance accessible à d’autres personnes.

:::

### 2.1 Installer Boto3

Nous recommandons d’utiliser un environnement virtuel :

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 dépend de `botocore`, qui sera installé automatiquement.

---

## 3. Connexion à RustFS

Le script suivant est complet et exécutable. Remplacez `localhost` par l’adresse IP de votre serveur si RustFS s’exécute sur une autre machine, et renseignez vos propres clés d’accès :

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

Exécutez-le :

```bash
python main.py
```

:::note[Paramètres du client]

- `endpoint_url` : pointe vers votre API S3 RustFS (port `9000`, et non le port de la Console `9001`)
- `signature_version='s3v4'` : RustFS prend en charge les signatures v4
- `region_name='us-east-1'` : région par défaut de RustFS
- `addressing_style='path'` : RustFS utilise par défaut des URL en adressage de type chemin (path-style) ; l’adressage de type hôte virtuel exige `RUSTFS_SERVER_DOMAINS`

:::

---

## 4. Opérations de base

### 4.1 Créer un compartiment

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

### 4.2 Charger un fichier

```python
s3.upload_file('/path/to/hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

```text
File uploaded.
```

---

### 4.3 Télécharger un fichier

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

```text
File downloaded.
```

---

### 4.4 Lister les objets

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

```text
- hello.txt (12 bytes)
```

---

### 4.5 Supprimer un objet et un compartiment

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

## 5. Fonctionnalités avancées

### 5.1 Générer des URL présignées

#### 5.1.1 Lien de téléchargement (GET)

```python
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
    ExpiresIn=600,  # expires in 10 minutes
)

print('Presigned GET URL:', url)
```

```text
Presigned GET URL: http://localhost:9000/my-bucket/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

#### 5.1.2 Lien de chargement (PUT)

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600,
)

print('Presigned PUT URL:', url)
```

Vous pouvez utiliser l’outil `curl` pour charger un fichier :

```bash
curl -X PUT --upload-file /path/to/hello.txt "http://localhost:9000/my-bucket/upload-by-url.txt?X-Amz-Algorithm=..."
```

---

### 5.2 Chargement partitionné

Utilisez le chargement partitionné pour les fichiers de plus de 10 MB lorsque vous devez contrôler chaque partie.

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

## 6. Dépannage

| Problème | Cause | Solution |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | Signature v4 non utilisée | Définissez `signature_version='s3v4'` |
| `EndpointConnectionError` | Adresse RustFS incorrecte, ou service non démarré | Vérifiez le point de terminaison et l’état du service RustFS |
| `AccessDenied` | Identifiants incorrects ou autorisations insuffisantes | Vérifiez la clé d’accès, la clé secrète et les politiques de compartiment |
| `PermanentRedirect` / URL de compartiment incorrecte | Adressage de type chemin non activé | Définissez `s3={'addressing_style': 'path'}` dans le `Config` |

---

## 7. Annexe : modèle de script rapide de chargement et de téléchargement

```python
def upload_file(local_path, bucket, object_key):
    s3.upload_file(local_path, bucket, object_key)
    print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")


def download_file(bucket, object_key, local_path):
    s3.download_file(bucket, object_key, local_path)
    print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```

Pour les autres opérations (étiquetage d’objets, politiques de compartiment, etc.), consultez la [documentation S3 de Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html). La plupart des opérations S3 fonctionnent de la même manière avec RustFS ; les exceptions sont décrites dans la [compatibilité S3](/fr/reference/s3-compatibility).

Si vous préférez une prise en charge asynchrone native et des indications de type complètes, le SDK communautaire [capo](https://github.com/kap-sh/capo) fonctionne aussi avec RustFS. Consultez le [guide d’intégration capo (Python)](../integration/others/capo.md).
