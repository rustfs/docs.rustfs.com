---
title: "Управление объектами RustFS"
description: "Управление объектами RustFS, включая создание и удаление."
---

# Объекты RustFS

Объект (Object) — базовая единица хранения в RustFS, включающая данные, метаданные и уникальный идентификатор (Object Key). Данные сохраняются в форме объектов. В этом разделе на примере загрузки и удаления файлов рассматривается управление объектами.

> Понятия, связанные с объектами (Object), см. раздел «Основные концепции» (../../concepts/glossary.md).

## Создание объекта

Предварительные условия:

- Доступный инстанс RustFS. См. раздел «Установка» по адресу ../../ru/installation/index.md.

[Создайте корзину](bucket-create-and-delete.md), а затем загрузите файл в корзину — это и будет созданием объекта. Загрузка возможна через RustFS UI, `mc` или по API.

### Загрузка файла в RustFS UI

1. Войдите в консоль RustFS UI.
1. Выберите корзину, в которую необходимо загрузить файл.
1. На странице корзины в правом верхнем углу выберите «Создать каталог», «Создать файл» или «Загрузить файл/папку», чтобы создать файл/папку.
1. Для загрузки локального файла/папки нажмите кнопку «Загрузить файл/папку», выберите локальные элементы и нажмите «Начать загрузку».

![object creation from ui](images/upload_file_from_ui.png)

После завершения загрузки нажмите на объект, чтобы просмотреть его подробные сведения.

![object details info](images/object_details_info.png)

### Загрузка файла с помощью `mc`

> Об установке и настройке `mc` см. раздел «Руководство по `mc`» (../mc.md).

Используйте команду `mc cp` для загрузки файла:

```
# upload file
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirm file uploaded
mc ls rustfs/bucket-creation-by-mc
```

После завершения загрузки проверьте результат в консоли RustFS.

### Загрузка файла через API

Используйте следующий API для загрузки файла:

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

Пример запроса:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024840Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=b7d8dc29ee34dfdf1f3e9e8e069892a8936f478586e7a2c90cf34f5b86d3a2dc' \
--data-binary '@/path/to/password.txt'
```

После завершения загрузки проверьте результат в консоли RustFS.

## Удаление объекта

Удаление объекта возможно через UI, с помощью `mc` или по API. Например, удалите файл, созданный на предыдущем шаге, — объект будет удален.

## Удаление файла в RustFS UI

1. Войдите в консоль RustFS UI.
1. Выберите корзину, из которой необходимо удалить файл.
1. На странице корзины выберите нужный файл.
1. Нажмите «Удалить выбранные», затем в появившемся диалоговом окне нажмите «Подтвердить».

![object deletion from ui](images/delete_file_from_ui.png)

### Удаление файла с помощью `mc`

Используйте команду `mc rm` для удаления файла:

```
# delete file
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirm deletion
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

Проверьте в RustFS UI, что файл удален.

### Удаление файла через API

Используйте следующий API для удаления файла:

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Пример запроса:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```

Проверьте в RustFS UI, что файл удален.