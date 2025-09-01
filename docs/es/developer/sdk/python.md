---
title: "SDK Python"
description: "Este documento explica principalmente el uso del SDK Python en RustFS."
---

Aquí está la **documentación completa de RustFS para el uso del S3 Python SDK (Boto3)**, incluyendo instalación, conexión, operaciones básicas, funcionalidades avanzadas (URL prefirmadas y subida multi-parte) etc., adecuada para desarrolladores que usan Python para integración con RustFS.

---

# Documentación RustFS S3 Python SDK (Boto3)

## I. Resumen

RustFS es un servicio de almacenamiento de objetos compatible con el protocolo Amazon S3, accesible a través del SDK Python [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html).

Este tutorial explica cómo integrar Python con RustFS y realizar las siguientes operaciones a través de Boto3:

* Creación/eliminación de buckets
* Subida/descarga/eliminación de objetos
* Listado de objetos
* Generación de URL prefirmadas
* Subida multi-parte de archivos grandes

---

## II. Preparación del entorno

### 2.1 Información de RustFS

Supongamos que RustFS está desplegado como sigue:

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Instalación de Boto3

Se recomienda usar un entorno virtual `venv`:

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 depende de `botocore`, se instalará automáticamente.

---

## III. Conexión a RustFS

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

> ✅ `endpoint_url`: Apunta a RustFS
> ✅ `signature_version='s3v4'`: RustFS soporta firma v4
> ✅ `region_name`: RustFS no valida región, cualquier valor funciona

---

## IV. Operaciones básicas

### 4.1 Crear bucket

```python
bucket_name = 'my-bucket'

try:
    s3.create_bucket(Bucket=bucket_name)
    print(f'Bucket {bucket_name} created.')
except s3.exceptions.BucketAlreadyOwnedByYou:
    print(f'Bucket {bucket_name} already exists.')
```

### 4.2 Subir archivo

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

### 4.3 Descargar archivo

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

### 4.4 Listar objetos

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

### 4.5 Eliminar objeto y bucket

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Object deleted.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket deleted.')
```

---

## V. Funcionalidades avanzadas

### 5.1 Generar URL prefirmadas

#### 5.1.1 Enlace de descarga (GET)

```python
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
    ExpiresIn=600  # Validez de 10 minutos
)

print('Presigned GET URL:', url)
```

#### 5.1.2 Enlace de subida (PUT)

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600
)

print('Presigned PUT URL:', url)
```

Puedes usar la herramienta `curl` para subir:

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

### 5.2 Subida multi-parte (Multipart Upload)

Adecuado para archivos mayores a 10 MB, control manual de cada parte posible.

```python
import os

file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024  # 5 MB

# 1. Iniciar subida
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

    # 2. Completar subida
    s3.complete_multipart_upload(
        Bucket=bucket_name,
        Key=key,
        UploadId=upload_id,
        MultipartUpload={'Parts': parts}
    )
    print('Multipart upload complete.')

except Exception as e:
    # Abortar subida
    s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
    print('Multipart upload aborted due to error:', e)
```

---

## VI. Resolución de problemas comunes

| Problema | Causa | Solución |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | No usa firma v4 | Establecer `signature_version='s3v4'` |
| `EndpointConnectionError` | Dirección RustFS incorrecta o servicio no iniciado | Verificar endpoint y estado del servicio RustFS |
| `AccessDenied` | Credenciales incorrectas o permisos insuficientes | Verificar AccessKey/SecretKey o políticas de bucket |
| `PermanentRedirect` | Path-style no habilitado | Boto3 usa virtual-host por defecto, RustFS solo soporta path-style, pero la configuración de endpoint puede evitarlo |

---

## VII. Apéndice: Plantilla de script rápido subida/descarga

```python
def upload_file(local_path, bucket, object_key):
    s3.upload_file(local_path, bucket, object_key)
    print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")

def download_file(bucket, object_key, local_path):
    s3.download_file(bucket, object_key, local_path)
    print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```

