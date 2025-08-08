---
title: "Управление объектами RustFS с помощью MinIO Client"
description: "Использование MinIO Client для управления объектами RustFS"
---

# MinIO Client (`mc`)

MinIO Client (`mc`) — это официальная консольная утилита MinIO для управления сервисами объектного хранилища MinIO. `mc` может взаимодействовать с MinIO, Amazon S3 и другими сервисами объектного хранилища, совместимыми с S3, предоставляя простой и эффективный способ управления данными. Поскольку MinIO совместим с S3, `mc` также может использоваться для управления объектами RustFS.

Предварительные условия:

- Доступный инстанс RustFS. См. раздел «Установка» по адресу ../../ru/installation/index.md.
- Установленная утилита `mc`.
- Доступные [ключи доступа](access-token.md).

## Работа с RustFS с помощью `mc`

Сначала необходимо настроить алиас RustFS с помощью команды `mc alias`:

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Ответ:

```
Added `rustfs` successfully.
```

Далее можно использовать алиас `rustfs` для создания/удаления корзин, загрузки/скачивания файлов и т.д.

### Список корзин

Используйте `mc ls`, чтобы перечислить все корзины в текущем инстансе RustFS:

```
mc ls rustfs
```

Ответ:

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Создание корзины

Используйте `mc mb` для создания корзины:

```
mc mb rustfs/bucket-creation-by-mc
```

Ответ:

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### Удаление корзины

Используйте `mc rb` для удаления корзины:

```
mc rb rustfs/bucket-creation-by-mc
```

Ответ:

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### Загрузка файла в корзину

Используйте `mc cp` для загрузки файла в корзину:

```
mc cp file_name rustfs/bucket-creation-by-mc
```

Ответ:

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### Удаление файла из корзины

Используйте `mc rm` для удаления файла из корзины:

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

Ответ:

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### Загрузка файла из корзины

Используйте `mc get` для скачивания файла из корзины:

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

Ответ:

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```