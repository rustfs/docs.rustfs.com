---
title: "RustFS Nesne Yönetimi"
description: "Nesnelerin yüklenmesi ve silinmesi"
---

# RustFS Nesneleri

Nesne (Object), RustFS depolamasının temel birimidir; veri, meta veri ve benzersiz tanımlayıcıdan (Object Key) oluşur. Bu bölüm, dosya yükleme ve silme örnekleriyle nesne yönetimini açıklar.

> Nesne ile ilgili kavramlar için [Temel Kavramlar](../../concepts/glossary.md) bölümüne bakın.

## Nesne oluşturma

Önkoşullar:

- Kullanılabilir bir RustFS örneği (../../installation/index.md)

Önce bir [kova oluşturun](bucket-create-and-delete.md), ardından bu kovaya dosya yükleyerek nesne oluşturun. Yükleme RustFS UI, `mc` veya API ile yapılabilir.

### RustFS UI ile yükleme

1. RustFS UI konsoluna giriş yapın.
1. Yüklemek istediğiniz kovayı seçin.
1. Kova sayfasının sağ üstünde "Yeni Dizin", "Yeni Dosya" veya "Dosya/Klasör Yükle"yi seçin.
1. Yerelden yüklemede, "Dosya/Klasör Yükle" > dosya/klasör seç > "Yüklemeyi Başlat" tıklayın.

![object creation from ui](images/upload_file_from_ui.png)

Yükleme sonrası, nesneye tıklayarak ayrıntılarını görüntüleyin.

![object details info](images/object_details_info.png)

### `mc` ile yükleme

> Kurulum/konfigürasyon için [`mc` kılavuzu](../mc.md).

```
# upload file
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirm file uploaded
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

### API ile yükleme

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

İstek örneği:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024840Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=b7d8dc29ee34dfdf1f3e9e8e069892a8936f478586e7a2c90cf34f5b86d3a2dc' \
--data-binary '@/path/to/password.txt'
```

## Nesne silme

UI, `mc` veya API ile nesneleri silebilirsiniz. Yukarıda oluşturulan dosyayı silerek tamamlayın.

## RustFS UI ile silme

1. RustFS UI konsoluna giriş yapın.
1. Silinecek dosyanın bulunduğu kovayı seçin.
1. Silinecek dosyayı işaretleyin.
1. Sağ üstte "Seçili olanları sil" > "Onayla".

![object deletion from ui](images/delete_file_from_ui.png)

### `mc` ile silme

```
# delete file
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirm deletion
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

### API ile silme

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