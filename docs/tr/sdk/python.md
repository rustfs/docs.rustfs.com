---
title: "Python SDK"
description: "Bu makale, RustFS'ta Python SDK'nın kullanımını açıklamaktadır."
---

# RustFS S3 Python SDK (Boto3) Dokümantasyonu

## 1. Genel Bakış

RustFS, Amazon S3 protokolüyle uyumlu bir nesne depolama hizmetidir ve Python'un [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK'sı ile entegrasyonu destekler.

Bu eğitimde, Python'un RustFS ile nasıl entegre edileceği ve Boto3 aracılığıyla aşağıdaki işlemlerin nasıl gerçekleştirileceği açıklanacaktır:

* Bucket oluşturma/silme
* Nesne yükleme/indirme/silme
* Nesneleri listeleme
* Ön imzalı URL oluşturma
* Büyük dosyalar için çok parçalı yükleme

---

## 2. Ortam Hazırlığı

### 2.1 RustFS Bilgileri

RustFS'in aşağıdaki gibi dağıtıldığını varsayalım:

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Boto3 Kurulumu

`venv` sanal ortamının kullanılması önerilir:

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3, `botocore` bağımlılığına sahiptir ve otomatik olarak kurulacaktır.

---

## 3. RustFS'a Bağlanma

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

> ✅ `endpoint_url`: RustFS'ı işaret eder
> ✅ `signature_version='s3v4'`: RustFS v4 imzalarını destekler
> ✅ `region_name`: RustFS bölge doğrulaması yapmaz, herhangi bir değer kullanılabilir

---

## 4. Temel İşlemler

### 4.1 Bucket Oluşturma

```python
bucket_name = 'my-bucket'

try:
    s3.create_bucket(Bucket=bucket_name)
    print(f'{bucket_name} bucketı oluşturuldu.')
except s3.exceptions.BucketAlreadyOwnedByYou:
    print(f'{bucket_name} bucketı zaten mevcut.')
```

---

### 4.2 Dosya Yükleme

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('Dosya yüklendi.')
```

---

### 4.3 Dosya İndirme

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('Dosya indirildi.')
```

---

### 4.4 Nesneleri Listeleme

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bayt)")
```

---

### 4.5 Nesne ve Bucket Silme

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Nesne silindi.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket silindi.')
```

---

## 5. Gelişmiş Özellikler

### 5.1 Ön İmzalı URL Oluşturma

#### 5.1.1 İndirme Bağlantısı (GET)

```python
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
    ExpiresIn=600  # 10 dakika geçerlilik
)

print('Ön imzalı GET URL:', url)
```

#### 5.1.2 Yükleme Bağlantısı (PUT)

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600
)

print('Ön imzalı PUT URL:', url)
```

`curl` aracı ile yükleme yapabilirsiniz:

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

---

### 5.2 Çok Parçalı Yükleme

10 MB'tan büyük dosyalar için uygundur, her parçanın manuel kontrolüne izin verir.

```python
import os

file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024  # 5 MB

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
            print(f'{part_number}. parça yüklendi')
            part_number += 1

    # 2. Yüklemeyi tamamla
    s3.complete_multipart_upload(
        Bucket=bucket_name,
        Key=key,
        UploadId=upload_id,
        MultipartUpload={'Parts': parts}
    )
    print('Çok parçalı yükleme tamamlandı.')

except Exception as e:
    # Hata durumunda yüklemeyi iptal et
    s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
    print(f'Yükleme iptal edildi: {e}')
```

---

## 6. Hata Yönetimi

### 6.1 Yaygın Hata Türleri

```python
from botocore.exceptions import ClientError

try:
    s3.head_object(Bucket=bucket_name, Key='nonexistent.txt')
except ClientError as e:
    error_code = e.response['Error']['Code']
    if error_code == '404':
        print('Nesne bulunamadı')
    elif error_code == 'NoSuchBucket':
        print('Bucket bulunamadı')
    else:
        print(f'Hata: {error_code}')
```

### 6.2 Bağlantı Sorunları

```python
import socket

try:
    response = s3.list_buckets()
except socket.timeout:
    print('Bağlantı zaman aşımına uğradı')
except ConnectionError:
    print('Bağlantı başarısız oldu')
```

---

## 7. En İyi Uygulamalar

1. **Bağlantı Havuzu Kullanımı**: Boto3 bağlantı havuzunu otomatik yönetir
2. **Hata Yeniden Deneme**: `Config` kullanarak yeniden deneme politikalarını yapılandırın
3. **Eşzamanlı İşlemler**: Yüksek eşzamanlılık senaryolarında `aioboto3` kullanın
4. **Kaynak Yönetimi**: Mümkün olduğunda bağlam yöneticilerini kullanın

```python
# Yeniden deneme politikası yapılandırma
from botocore.config import Config

config = Config(
    retries={'max_attempts': 3, 'mode': 'adaptive'},
    max_pool_connections=50
)

s3 = boto3.client('s3', config=config, ...)
```

---

## 8. Tam Örnek

```python
#!/usr/bin/env python3
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

def main():
    # İstemciyi başlat
    s3 = boto3.client(
        's3',
        endpoint_url='http://192.168.1.100:9000',
        aws_access_key_id='rustfsadmin',
        aws_secret_access_key='rustfssecret',
        config=Config(signature_version='s3v4'),
        region_name='us-east-1'
    )

    bucket_name = 'test-bucket'

    try:
        # Bucket oluştur
        s3.create_bucket(Bucket=bucket_name)
        print(f'Bucket oluşturuldu: {bucket_name}')

        # Dosya yükle
        with open('test.txt', 'w') as f:
            f.write('Merhaba RustFS!')

        s3.upload_file('test.txt', bucket_name, 'test.txt')
        print('Dosya başarıyla yüklendi')

        # Nesneleri listele
        response = s3.list_objects_v2(Bucket=bucket_name)
        print('Bucket içindeki nesneler:')
        for obj in response.get('Contents', []):
            print(f"  - {obj['Key']}")

        # Ön imzalı URL oluştur
        url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': 'test.txt'},
            ExpiresIn=3600
        )
        print(f'Ön imzalı URL: {url}')

    except ClientError as e:
        print(f'Hata: {e}')

if __name__ == '__main__':
    main()
```