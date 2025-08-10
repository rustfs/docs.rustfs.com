---
title: "Python SDK"
description: "Como usar o Boto3 (S3 Python SDK) com o RustFS: instalação, operações básicas, presigned URL e multipart."
---

Abaixo está a documentação para usar o **Boto3 (S3 Python SDK)** com o RustFS: instalação, conexão, operações básicas, URL pré‑assinada e upload multipart.

---

# RustFS com S3 Python SDK (Boto3)

## 1. Visão geral

RustFS é compatível com o protocolo Amazon S3 e pode ser acessado pelo [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html).

Este guia mostra como integrar RustFS com Python e realizar:

* Criar/Excluir buckets
* Upload/Download/Delete de objetos
* Listar objetos
* Gerar URL pré‑assinada
* Upload multipart para arquivos grandes

---

## 2. Preparação do ambiente

### 2.1 Informações do RustFS

Suponha uma instância:

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Instalar Boto3

Recomendamos `venv`:

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 depende de `botocore` (instala automaticamente).

---

## 3. Conectar ao RustFS

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

> ✅ `endpoint_url`: aponta para o RustFS
> ✅ `signature_version='s3v4'`: RustFS suporta assinatura v4
> ✅ `region_name`: RustFS não valida região (valor arbitrário)

---

## 4. Operações básicas

### 4.1 Criar bucket

```python
bucket_name = 'my-bucket'

try:
 s3.create_bucket(Bucket=bucket_name)
 print(f'Bucket {bucket_name} created.')
except s3.exceptions.BucketAlreadyOwnedByYou:
 print(f'Bucket {bucket_name} already exists.')
```

---

### 4.2 Upload de arquivo

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

---

### 4.3 Download de arquivo

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

---

### 4.4 Listar objetos

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
 print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

---

### 4.5 Excluir objeto e bucket

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Object deleted.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket deleted.')
```

---

## 5. Recursos avançados

### 5.1 URL pré‑assinada

#### 5.1.1 Link de download (GET)

```python
url = s3.generate_presigned_url(
 ClientMethod='get_object',
 Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
 ExpiresIn=600 # válido por 10 minutos
)

print('Presigned GET URL:', url)
```

#### 5.1.2 Link de upload (PUT)

```python
url = s3.generate_presigned_url(
 ClientMethod='put_object',
 Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
 ExpiresIn=600
)

print('Presigned PUT URL:', url)
```

Você pode usar `curl` para enviar:

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

---

### 5.2 Upload multipart

Indicado para arquivos >10 MB, com controle manual de partes.

```python
import os

file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024 # 5 MB

# 1. Iniciar upload
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

  # 2. Concluir upload
  s3.complete_multipart_upload(
   Bucket=bucket_name,
   Key=key,
   UploadId=upload_id,
   MultipartUpload={'Parts': parts}
  )
  print('Multipart upload complete.')

except Exception as e:
 # Abortar upload
 s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
 print('Multipart upload aborted due to error:', e)
```

---

## 6. Troubleshooting

| Problema | Causa | Solução |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | Não usa v4 | Defina `signature_version='s3v4'` |
| `EndpointConnectionError` | Endpoint incorreto/serviço inativo | Verifique endpoint e serviço |
| `AccessDenied` | Credenciais/políticas incorretas | Revise AccessKey/SecretKey ou política do bucket |
| `PermanentRedirect` | Path‑style desativado | Boto3 usa virtual‑host por padrão; use path‑style via endpoint |

---

## 7. Anexos: helpers rápidos

```python
def upload_file(local_path, bucket, object_key):
 s3.upload_file(local_path, bucket, object_key)
 print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")

def download_file(bucket, object_key, local_path):
 s3.download_file(bucket, object_key, local_path)
 print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```

