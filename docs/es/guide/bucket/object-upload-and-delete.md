---
title: "Gestión de objetos en RustFS"
description: "Gestión de objetos en RustFS, incluida la creación y eliminación."
---

# Objetos de RustFS

Un objeto es la unidad básica de almacenamiento en RustFS. Incluye datos, metadatos y un identificador único (Object Key). Esta sección utiliza la subida y eliminación de archivos para ilustrar la gestión de objetos.

> Para conceptos relacionados con objetos, consulta [Conceptos básicos](/es/concepts/glossary.md).

## Crear un objeto

Requisitos previos:

- Una instancia disponible de RustFS. Consulta la [Guía de instalación](/es/installation/index) para desplegarla.

Primero [crea un bucket](bucket-create-and-delete.md) y luego sube un archivo al bucket para crear un objeto. Puedes subir archivos desde la UI de RustFS, con `mc` o mediante la API compatible con S3.

### Subir un archivo desde la UI de RustFS

1. Inicia sesión en la consola UI de RustFS.
2. Selecciona el bucket de destino.
3. En la página del bucket, usa **Nueva carpeta**, **Nuevo archivo** o **Subir archivos/carpetas** para crear contenido.
4. Para subir desde local, haz clic en **Subir archivos/carpetas**, elige los archivos/carpetas locales y luego haz clic en **Iniciar subida**.

![object creation from ui](./images/upload_file_from_ui.png)

Tras completar la subida, haz clic en el objeto para ver sus detalles.

![object details info](./images/object_details_info.png)

### Subir un archivo con `mc`

> Para la instalación y configuración de `mc`, consulta la [Guía de `mc`](../mc.md).

Usa `mc cp` para subir:

```
# subir archivo
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirmar subida
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

También puedes verificarlo en la consola de RustFS.

### Subir un archivo mediante API

Usa la siguiente API para subir:

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

Verifica la subida en la consola de RustFS.

## Eliminar un objeto

Puedes eliminar objetos desde la UI, con `mc` o mediante API. Por ejemplo, elimina el archivo creado en los pasos anteriores.

## Eliminar un archivo desde la UI de RustFS

1. Inicia sesión en la consola UI de RustFS.
2. Selecciona el bucket que contiene el archivo.
3. En la página del bucket, selecciona el archivo a eliminar.
4. Haz clic en **Eliminar seleccionados** en la esquina superior derecha y luego en **Confirmar** en el diálogo.

![object deletion from ui](./images/delete_file_from_ui.png)

### Eliminar un archivo con `mc`

Usa `mc rm` para eliminar:

```
# eliminar archivo
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirmar eliminación
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

Puedes confirmar la eliminación en la UI de RustFS.

### Eliminar un archivo mediante API

Usa la siguiente API:

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Ejemplo:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a'
```

Verifica la eliminación en la UI de RustFS.