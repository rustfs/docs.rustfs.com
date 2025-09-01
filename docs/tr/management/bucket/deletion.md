---
title: "RustFS Bucket Silme"
description: "RustFS UI'da veya MinIO Client istemcisi ve API aracılığıyla bucket silebilirsiniz."
---

# RustFS Bucket Silme

Bu bölüm RustFS UI, `mc` (MinIO Client) veya API aracılığıyla bucket silme işlemini paylaşır.

**Not**: Bucket, veri depolamanın önemli bir bileşenidir ve bucket silme işlemi bu bucket'ı kullanan uygulamalarda hatalara neden olabilir. Bucket'ı silmeden önce, bucket içindeki tüm verileri yedeklediğinizden ve artık bu bucket'ı kullanmayacağınızdan emin olun.

## RustFS UI'da Bucket Silme

1. RustFS UI konsoluna giriş yapın.
1. Ana sayfada, silinecek bucket'ı seçin.
1. En sağ tarafta **Sil** düğmesini seçin.
1. Çıkan dialog kutusunda, bucket silme işlemini tamamlamak için **Onayla**'ya tıklayın.

![bucket deletion](images/bucket-deletion-on-ui.png)

## `mc` Kullanarak Bucket Silme

`mc` kurulumu ve yapılandırması için [`mc` Kullanım Kılavuzu](../../developer/mc.md) bölümüne bakabilirsiniz.

Bucket silmek için `mc rb` komutunu kullanın:

```
# bucket sil
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# bucket silme işlemini onayla
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

## API Kullanarak Bucket Silme

Bucket silmek için aşağıdaki API'yi kullanın:

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

RustFS UI'da `bucket-creation-by-api` bucket'ının silinmiş olduğunu onaylayabilirsiniz.
