---
title: "MinIO Client ile RustFS Nesnelerini Yönetme"
description: "MinIO Client kullanarak RustFS nesnelerini yönetme"
---

# MinIO Client (`mc`)

MinIO Client (`mc`), MinIO tarafından sağlanan resmi komut satırı aracıdır ve MinIO, Amazon S3 ile diğer S3 uyumlu nesne depolama hizmetlerini yönetir. S3 uyumlu olduğundan, `mc` RustFS nesnelerinin yönetiminde de kullanılabilir.

Önkoşullar:

- Bir RustFS örneği (../../tr/installation/index.md)
- `mc` kurulu
- Geçerli bir [erişim anahtarı](access-token.md)

## `mc` ile RustFS kullanımı

Önce `mc alias` komutuyla RustFS için bir takma ad tanımlayın:

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Yanıt:

```
Added `rustfs` successfully.
```

Ardından `rustfs` takma adı ile kova oluşturma/silme ve dosya yükleme/indirme işlemlerini yapabilirsiniz.

### Kovaları listeleme

```
mc ls rustfs
```

Yanıt:

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Kova oluşturma

```
mc mb rustfs/bucket-creation-by-mc
```

Yanıt:

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### Kova silme

```
mc rb rustfs/bucket-creation-by-mc
```

Yanıt:

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### Dosya yükleme

```
mc cp file_name rustfs/bucket-creation-by-mc
```

Yanıt:

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### Dosya silme

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

Yanıt:

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### Dosya indirme

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

Yanıt:

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```