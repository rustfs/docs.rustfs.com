---
title: "RustFS Nesne Silme"
description: "RustFS UI'da veya MinIO Client istemcisi ve API aracılığıyla nesne silebilirsiniz."
---

# RustFS Nesne

Nesne (Object), RustFS depolamanın temel birimidir ve veri, metadata ve benzersiz tanımlayıcı (Object Key) içerir. Veriler nesne biçiminde depolanır. Bu bölüm dosya yükleme ve silme örneğiyle nesne yönetimini tanıtır.

> Nesne (Object) ile ilgili kavramlar için [Temel Kavramlar](../../concepts/glossary.md) bölümüne bakabilirsiniz.

## Nesne Silme

Aynı şekilde UI'da, `mc` kullanarak veya API yöntemiyle nesne silebilirsiniz. Örneğin yukarıdaki adımlarda oluşturulan dosyayı silerek nesne silme işlemini tamamlayabilirsiniz.

## RustFS UI'da Dosya Silme

1. RustFS UI konsoluna giriş yapın.
1. Dosya silmek istediğiniz bucket'ı seçin.
1. Bucket sayfasında, silmek istediğiniz dosyayı seçin.
1. Sağ üst köşedeki **Seçilenleri Sil**'e tıklayın, çıkan dialog kutusunda dosya silme işlemini tamamlamak için **Onayla**'ya tıklayın.

![object deletion from ui](images/delete_file_from_ui.png)

### `mc` Kullanarak Dosya Silme

Dosya silmek için `mc rm` komutunu kullanın:

```
# dosya sil
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# silme işlemini onayla
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

RustFS UI'da dosyanın silindiğini onaylayabilirsiniz.

### API Kullanarak Dosya Silme

Dosya silmek için aşağıdaki API'yi kullanın:

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

İstek örneği:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```

RustFS UI'da dosyanın silindiğini onaylayabilirsiniz.