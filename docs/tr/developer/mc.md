---
title: "MinIO Client ile RustFS Nesnelerini Yönetme"
description: "RustFS nesnelerini MinIO Client ile yönetme"
---

# MinIO Client (`mc`)

MinIO Client (`mc`), MinIO resmi tarafından sağlanan komut satırı aracıdır ve MinIO nesne depolama hizmetlerini yönetmek için kullanılır. `mc`, MinIO, Amazon S3 ve diğer S3 uyumlu nesne depolama hizmetleri ile etkileşim kurabilir, nesne depolama hizmetlerindeki verileri yönetmek için basit ve verimli bir yöntem sağlar. MinIO S3 uyumlu olduğu için, `mc` RustFS nesnelerini yönetmek için de kullanılabilir.

Ön koşullar:

- Kullanılabilir bir RustFS örneği. Kurulum için [kurulum rehberine](../installation/index.md) bakabilirsiniz.
- `mc` aracının kurulu olması.
- Kullanılabilir [erişim anahtarları](../administration/iam/access-token.md).

## `mc` ile RustFS İşlemleri

İlk olarak `mc alias` komutu kullanarak RustFS'nin takma adını yapılandırmanız gerekir:

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Dönüş yanıtı:

```
Added `rustfs` successfully.
```

Ardından, bucket oluşturma/silme, dosya yükleme/indirme vb. işlemler için `mc` ile `rustfs` takma adını kullanabilirsiniz.

### Bucket'ları Listeleme

Mevcut RustFS örneğindeki tüm bucket'ları listelemek için `mc ls` kullanın:

```
mc ls rustfs
```

Dönüş yanıtı:

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Bucket Oluşturma

`mc mb` komutu ile bucket oluşturun:

```
mc mb rustfs/bucket-creation-by-mc
```

Dönüş yanıtı:  

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### Bucket Silme

Bucket silmek için `mc rb` komutunu kullanın:

```
mc rb rustfs/bucket-creation-by-mc
```

Dönüş yanıtı:

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### Dosya Bucket'a Yükleme

Dosyayı bucket'a yüklemek için `mc cp` komutunu kullanın:

```
mc cp file_name rustfs/bucket-creation-by-mc
```

Dönüş yanıtı:

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### Bucket'taki Dosyaları Silme

Bucket'taki dosyaları silmek için `mc rm` komutunu kullanın:

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

Dönüş yanıtı:

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### Depolamadaki Dosyaları İndirme

Bucket'taki dosyaları indirmek için `mc get` komutunu kullanın:

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

Dönüş yanıtı:

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```

