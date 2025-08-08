---
title: "Gestión de objetos en RustFS"
description: "Creación y eliminación de objetos"
---

# Objetos en RustFS

Un objeto es la unidad básica de almacenamiento en RustFS. Incluye datos, metadatos y un identificador único (Object Key). En esta sección se explica cómo gestionar objetos a través de ejemplos de subida y eliminación de archivos.

> Para conceptos relacionados con «Objeto», consulte la sección de [Conceptos](../../concepts/glossary.md).

## Crear un objeto

Requisitos previos:

- Una instancia disponible de RustFS (véase ../../installation/index.md).

Cree un [bucket](bucket-create-and-delete.md) y suba un archivo al bucket para crear un objeto. Puede hacerlo desde la UI de RustFS, con `mc` o mediante la API.

### Subir archivos desde la UI de RustFS

1. Inicie sesión en la consola UI de RustFS.
1. Seleccione el bucket de destino.
1. En la página del bucket, arriba a la derecha, elija «Nueva carpeta», «Nuevo archivo» o «Subir archivo/carpeta».
1. Para subida local, haga clic en «Subir archivo/carpeta», seleccione los elementos y luego «Iniciar subida».

![object creation from ui](images/upload_file_from_ui.png)

Tras la subida, haga clic en el objeto para ver sus detalles.

![object details info](images/object_details_info.png)

### Subir archivos con `mc`

> Consulte la guía de [`mc`](../mc.md).

```
# upload file
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirm file uploaded
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

### Subir archivos con la API

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

Ejemplo:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024840Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=b7d8dc29ee34dfdf1f3e9e8e069892a8936f478586e7a2c90cf34f5b86d3a2dc' \
--data-binary '@/path/to/password.txt'
```

## Eliminar un objeto

Puede eliminar objetos desde la UI, con `mc` o con la API. Por ejemplo, elimine el archivo creado en los pasos anteriores.

## Eliminar archivos en la UI de RustFS

1. Inicie sesión en la consola UI de RustFS.
1. Seleccione el bucket correspondiente.
1. En la página del bucket, seleccione el archivo a eliminar.
1. Haga clic en «Eliminar seleccionados» y confirme en el diálogo.

![object deletion from ui](images/delete_file_from_ui.png)

### Eliminar archivos con `mc`

```
# delete file
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirm deletion
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

### Eliminar archivos con la API

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Ejemplo:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```