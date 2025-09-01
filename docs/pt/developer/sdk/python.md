---
title: "Python SDK"
description: "Este documento explica principalmente o uso do Python SDK no RustFS."
---

Aqui está a **documentação completa do RustFS para usar o S3 Python SDK (Boto3)**, incluindo instalação, conexão, operações básicas, recursos avançados (URL pré-assinada e upload multipartes) etc., adequada para desenvolvedores que usam Python para integrar com RustFS.

---

# Documentação do RustFS S3 Python SDK (Boto3)

## I. Visão Geral

O RustFS é um serviço de armazenamento de objetos compatível com o protocolo Amazon S3, acessível através do SDK [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) do Python.

Este tutorial explica como integrar Python com RustFS e executar as seguintes operações através do Boto3:

* Criação/exclusão de buckets
* Upload/download/exclusão de objetos
* Listagem de objetos
* Geração de URLs pré-assinadas
* Upload multipartes de arquivos grandes

---

## II. Preparação do Ambiente

### 2.1 Informações do RustFS

Assumindo que o RustFS está implantado da seguinte forma:

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Instalar Boto3

Recomendado usar ambiente virtual `venv`:

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> O Boto3 depende do `botocore`, que será instalado automaticamente.

---

## III. Conectar ao RustFS

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

> ✅ `endpoint_url`: Aponta para o RustFS
> ✅ `signature_version='s3v4'`: RustFS suporta assinatura v4
> ✅ `region_name`: RustFS não valida região, qualquer valor funciona

---

## IV. Operações Básicas

### 4.1 Criar Bucket

```python
bucket_name = 'my-bucket'

try:
    s3.create_bucket(Bucket=bucket_name)
    print(f'Bucket {bucket_name} criado.')
except s3.exceptions.BucketAlreadyOwnedByYou:
    print(f'Bucket {bucket_name} já existe.')
```

### 4.2 Fazer Upload de Arquivo

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('Arquivo enviado.')
```

### 4.3 Baixar Arquivo

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('Arquivo baixado.')
```

### 4.4 Listar Objetos

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

### 4.5 Excluir Objeto e Bucket

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Objeto excluído.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket excluído.')
```

---

## V. Recursos Avançados

### 5.1 Gerar URLs Pré-assinadas

#### 5.1.1 Link de Download (GET)

```python
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
    ExpiresIn=600  # Validade de 10 minutos
)

print('URL GET pré-assinada:', url)
```

#### 5.1.2 Link de Upload (PUT)

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600
)

print('URL PUT pré-assinada:', url)
```

Você pode usar a ferramenta `curl` para fazer upload:

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

### 5.2 Upload Multipartes

Adequado para arquivos maiores que 10 MB, permite controle manual de cada parte.

```python
import os

file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024  # 5 MB

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
            print(f'Parte {part_number} enviada')
            part_number += 1

    # 2. Completar upload
    s3.complete_multipart_upload(
        Bucket=bucket_name,
        Key=key,
        UploadId=upload_id,
        MultipartUpload={'Parts': parts}
    )
    print('Upload multipartes concluído.')

except Exception as e:
    # Cancelar upload
    s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
    print('Upload multipartes cancelado devido ao erro:', e)
```

---

## VI. Solução de Problemas Comuns

| Problema | Causa | Solução |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | Não usando assinatura v4 | Definir `signature_version='s3v4'` |
| `EndpointConnectionError` | Endereço RustFS incorreto ou serviço não iniciado | Verificar endpoint e status do serviço RustFS |
| `AccessDenied` | Credenciais incorretas ou permissões insuficientes | Verificar AccessKey/SecretKey ou políticas de bucket |
| `PermanentRedirect` | Estilo de caminho não habilitado | Boto3 usa virtual-host por padrão, RustFS suporta apenas estilo de caminho, mas configuração de endpoint pode contornar |

---

## VII. Apêndice: Modelo de Script de Upload/Download Rápido

```python
def upload_file(local_path, bucket, object_key):
    s3.upload_file(local_path, bucket, object_key)
    print(f"Enviado {local_path} para s3://{bucket}/{object_key}")

def download_file(bucket, object_key, local_path):
    s3.download_file(bucket, object_key, local_path)
    print(f"Baixado s3://{bucket}/{object_key} para {local_path}")
```
