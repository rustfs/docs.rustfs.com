---
title: "Управление корзинами RustFS"
description: "Управление корзинами RustFS, включая создание и удаление."
---

# Корзины RustFS

Корзина (Bucket) — это базовый контейнер для организации и управления данными в RustFS. Каждая корзина имеет уникальное имя и может содержать несколько объектов (Object). Корзины обеспечивают логическую группировку данных, что упрощает управление и доступ к данным. Вы можете управлять корзинами через RustFS UI, `mc` (MinIO Client) или API (создание, удаление, загрузка и скачивание данных и т.д.).

## Создание корзины

Предварительные условия:

- Доступный инстанс RustFS. См. раздел «Установка» по адресу ../../ru/installation/index.md.

## Создание корзины в RustFS UI

1. Войдите в консоль RustFS UI.
1. На главной странице в левом верхнем углу выберите «Создать корзину».
1. Введите имя корзины и нажмите «Создать», чтобы завершить создание корзины.

![bucket creation](images/bucket-creation-by-ui.png)

### Создание корзины с помощью `mc`

> Об установке и настройке `mc` см. раздел «Руководство по `mc`» (../mc.md).

Используйте команду `mc mb` для создания корзины:

```
# creat rustfs bucket
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirm bucket creation
mc ls rustfs/bucket-creation-by-mc
```

### Создание корзины через API

Используйте следующий API для создания корзины:

```
PUT /{bucketName} HTTP/1.1
```

Пример запроса:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

В RustFS UI можно подтвердить, что корзина `bucket-creation-by-api` создана успешно.

## Удаление корзины

Внимание: корзина является важным компонентом для хранения данных; удаление корзины может вызвать ошибки в приложениях, использующих эту корзину. Перед удалением убедитесь, что вы создали резервную копию всех данных в корзине и что эта корзина вам больше не нужна.

### Удаление корзины в RustFS UI

1. Войдите в консоль RustFS UI.
1. На главной странице выберите корзину, которую нужно удалить.
1. В правой части строки корзины нажмите кнопку «Удалить».
1. В появившемся диалоговом окне нажмите «Подтвердить», чтобы завершить удаление корзины.

![bucket deletion](images/bucket-deletion-on-ui.png)

### Удаление корзины с помощью `mc`

Об установке и настройке `mc` см. раздел «Руководство по `mc`» (../mc.md).

Используйте команду `mc rb` для удаления корзины:

```
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm bucket deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

### Удаление корзины через API

Используйте следующий API для удаления корзины:

```
DELETE /{bucketName} HTTP/1.1
```

Пример запроса:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

В RustFS UI можно подтвердить, что корзина `bucket-creation-by-api` удалена.