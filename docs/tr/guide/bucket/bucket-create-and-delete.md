---
title: "RustFS Kova (Bucket) Yönetimi"
description: "RustFS kovalarının oluşturulması ve silinmesi"
---

# RustFS Kovaları

Kova (Bucket), RustFS’te verileri düzenlemek ve yönetmek için kullanılan temel mantıksal kaptır. Her kovanın benzersiz bir adı vardır ve birden fazla nesne içerebilir. Kovalar, verileri mantıksal olarak gruplandırarak yönetimi ve erişimi kolaylaştırır. RustFS UI, `mc` (MinIO Client) veya API ile kovaları oluşturabilir/silebilir ve veri yükleme/indirme işlemlerini yapabilirsiniz.

## Kova oluşturma

Önkoşullar:

- Kullanılabilir bir RustFS örneği (../../installation/index.md)

## RustFS UI ile oluşturma

1. RustFS UI konsoluna giriş yapın.
1. Ana sayfada sol üstten "Kova Oluştur"u seçin.
1. Kova adını girip "Oluştur"a tıklayın.

![bucket creation](images/bucket-creation-by-ui.png)

### `mc` ile oluşturma

> Kurulum/konfigürasyon için [`mc` kılavuzu](../mc.md).

```
# creat rustfs bucket
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirm bucket creation
mc ls rustfs/bucket-creation-by-mc
```

### API ile oluşturma

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

UI’dan `bucket-creation-by-api` kovanın oluşturulduğunu doğrulayabilirsiniz.

## Kova silme

Not: Kova, verilerin kritik bileşenidir; silmek, bu kovayı kullanan uygulamalarda hataya yol açabilir. Silmeden önce yedek alın ve daha fazla gereksinim olmadığını teyit edin.

### RustFS UI ile silme

1. RustFS UI konsoluna giriş yapın.
1. Ana sayfada silinecek kovayı seçin.
1. Sağ uçtaki "Sil" düğmesine tıklayın.
1. Açılan iletişim kutusunda "Onayla"ya tıklayın.

![bucket deletion](images/bucket-deletion-on-ui.png)

### `mc` ile silme

> [`mc` kılavuzu](../mc.md).

```
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm bucket deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

### API ile silme

```
DELETE /{bucketName} HTTP/1.1
```

İstek örneği:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

RustFS UI’dan `bucket-creation-by-api` kovanın silindiğini doğrulayabilirsiniz.