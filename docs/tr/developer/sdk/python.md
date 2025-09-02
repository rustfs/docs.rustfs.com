---
title: "Python SDK"
description: "Bu makale RustFS'de Python SDK kullanımını açıklar."
---

Aşağıda **RustFS'in S3 Python SDK (Boto3) ile kullanımına** yönelik eksiksiz dokümantasyon bulunmaktadır, kurulum, bağlantı, temel işlemler, gelişmiş özellikler (Presigned URL ve parçalı yükleme) gibi içerikler dahildir ve geliştiricilerin Python ile RustFS entegrasyonu için uygundur.

---

# RustFS ile S3 Python SDK (Boto3) Dokümantasyonu

## Bir. Genel Bakış

RustFS, Amazon S3 protokolü uyumlu bir nesne depolama hizmetidir ve Python'un [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK'sı aracılığıyla erişimi destekler.

Bu eğitim Python ile RustFS entegrasyonunu anlatacak ve Boto3 aracılığıyla aşağıdaki işlemleri tamamlayacaktır:

* Bucket oluşturma/silme
* Nesne yükleme/indirme/silme
* Nesneleri listeleme
* Önceden imzalı URL oluşturma
* Büyük dosyaları parçalı yükleme

---

## İki. Ortam Hazırlığı

### 2.1 RustFS Bilgileri

RustFS'in aşağıdaki şekilde dağıtıldığını varsayın:

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Boto3 Kurulumu

`venv` sanal ortamı kullanmanız önerilir:

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3, `botocore`'a bağımlıdır ve otomatik olarak yüklenir.

---

## Üç. RustFS'e Bağlanma

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

> ✅ `endpoint_url`: RustFS'i işaret eder
> ✅ `signature_version='s3v4'`: RustFS v4 imzasını destekler
> ✅ `region_name`: RustFS region doğrulaması yapmaz, herhangi bir değer girebilirsiniz

---

## Dört. Temel İşlemler

### 4.1 Bucket Oluşturma

```python
bucket_name = 'my-bucket'

try:
 s3.create_bucket(Bucket=bucket_name)
 print(f'Bucket {bucket_name} created.')
except s3.exceptions.BucketAlreadyOwnedByYou:
 print(f'Bucket {bucket_name} already exists.')
```

---

### 4.2 Dosya Yükleme

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

---

### 4.3 Dosya İndirme

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

---

### 4.4 Nesneleri Listeleme

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
 print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

---

### 4.5 Nesne ve Bucket Silme

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Object deleted.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket deleted.')
```

---

## Beş. Gelişmiş Özellikler

### 5.1 Önceden İmzalı URL Oluşturma

#### 5.1.1 İndirme Bağlantısı (GET)

```python
url = s3.generate_presigned_url(
 ClientMethod='get_object',
 Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
 ExpiresIn=600 # 10 dakika geçerlilik süresi
)

print('Presigned GET URL:', url)
```

#### 5.1.2 Yükleme Bağlantısı (PUT)

```python
url = s3.generate_presigned_url(
 ClientMethod='put_object',
 Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
 ExpiresIn=600
)

print('Presigned PUT URL:', url)
```

`curl` aracını kullanarak yükleme yapabilirsiniz:

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

---

### 5.2 Parçalı Yükleme (Multipart Upload)

10 MB'dan büyük dosyalar için uygundur, her parçayı manuel olarak kontrol edebilirsiniz.

```python
import os

file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024 # 5 MB

# 1. Yüklemeyi başlat
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

 # 2. Yüklemeyi tamamla
 s3.complete_multipart_upload(
 Bucket=bucket_name,
 Key=key,
 UploadId=upload_id,
 MultipartUpload={'Parts': parts}
 )
 print('Multipart upload complete.')

except Exception as e:
 # Yüklemeyi iptal et
 s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
 print('Multipart upload aborted due to error:', e)
```

---

## Altı. Yaygın Sorun Giderme

| Sorun | Sebep | Çözüm |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | v4 imzası kullanılmamış | `signature_version='s3v4'` ayarlayın |
| `EndpointConnectionError` | RustFS adresi yanlış veya hizmet başlatılmamış | endpoint ve RustFS hizmet durumunu kontrol edin |
| `AccessDenied` | Kimlik bilgisi hatası veya yetki yetersiz | AccessKey/SecretKey veya bucket politikasını kontrol edin |
| `PermanentRedirect` | Path-style etkinleştirilmemiş | Boto3 varsayılan olarak virtual-host kullanır, RustFS sadece path-style destekler, ancak endpoint ayarlayarak aşılabilir |

---

## Yedi. Ek: Hızlı Yükleme/İndirme Script Şablonu

```python
def upload_file(local_path, bucket, object_key):
 s3.upload_file(local_path, bucket, object_key)
 print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")

def download_file(bucket, object_key, local_path):
 s3.download_file(bucket, object_key, local_path)
 print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```