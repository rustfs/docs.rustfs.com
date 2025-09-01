---
title: "RustFS Bucket Oluşturma"
description: "RustFS UI'da veya MinIO Client istemcisi ve API aracılığıyla bucket oluşturabilirsiniz."
---

# RustFS Bucket Oluşturma

Bu bölüm RustFS UI, `mc` (MinIO Client) veya API aracılığıyla bucket oluşturma işlemini paylaşır.

## Bucket Oluşturma

Ön koşullar:

- Kullanılabilir bir RustFS örneği. Kurulum için [Kurulum Kılavuzu](../../installation/index.md) 'na başvurabilirsiniz.

## RustFS UI'da Bucket Oluşturma

1. RustFS UI konsoluna giriş yapın.
1. Ana sayfada, sol üst köşede **Bucket Oluştur**'u seçin.
1. Bucket adını girin, bucket oluşturmayı tamamlamak için **Oluştur**'a tıklayın.

![bucket creation](images/bucket-creation-by-ui.png)

### `mc` Kullanarak Bucket Oluşturma

> `mc` kurulumu ve yapılandırması için [`mc` Kullanım Kılavuzu](../../developer/mc.md) bölümüne bakabilirsiniz.

Bucket oluşturmak için `mc mb` komutunu kullanın:

```
# rustfs bucket oluştur
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# bucket oluşturma işlemini onayla
mc ls rustfs/bucket-creation-by-mc
```

### API Kullanarak Bucket Oluşturma

Bucket oluşturmak için aşağıdaki API'yi kullanın:

```
PUT /{bucketName} HTTP/1.1
```

İstek örneği:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

RustFS UI'da `bucket-creation-by-api` bucket'ının başarıyla oluşturulduğunu onaylayabilirsiniz.
