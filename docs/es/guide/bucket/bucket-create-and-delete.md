---
title: "Gestión de buckets en RustFS"
description: "Gestión de buckets en RustFS, incluida su creación y eliminación."
---

# Buckets de RustFS

Un bucket es el contenedor fundamental para organizar y gestionar los datos en RustFS. Cada bucket tiene un nombre único y puede contener múltiples objetos. Los buckets proporcionan una agrupación lógica que facilita la gestión y el acceso a los datos. Puedes operar con buckets mediante la UI de RustFS, `mc` (MinIO Client) o la API compatible con S3 (crear, eliminar, subir, descargar, etc.).

## Crear un bucket

Requisitos previos:

- Una instancia disponible de RustFS. Consulta la [Guía de instalación](/es/installation/index) para desplegarla.

## Crear un bucket en la UI de RustFS

1. Inicia sesión en la consola UI de RustFS.
2. En la página de inicio, haz clic en **Crear bucket** en la esquina superior izquierda.
3. Introduce el nombre del bucket y haz clic en **Crear**.

![bucket creation](./images/bucket-creation-by-ui.png)

### Crear un bucket con `mc`

> Para la instalación y configuración de `mc`, consulta la [Guía de `mc`](../mc.md).

Usa `mc mb` para crear un bucket:

```
# crear un bucket de RustFS
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirmar que el bucket existe
mc ls rustfs/bucket-creation-by-mc
```

### Crear un bucket mediante API

Usa la siguiente API para crear un bucket:

```
PUT /{bucketName} HTTP/1.1
```

Ejemplo:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

Puedes confirmar en la UI de RustFS que el bucket `bucket-creation-by-api` se ha creado.

## Eliminar un bucket

Nota: Los buckets son críticos para el almacenamiento de datos. Eliminar un bucket puede afectar a las aplicaciones que dependen de él. Antes de eliminarlo, realiza copias de seguridad de los datos necesarios y asegúrate de que el bucket ya no sea necesario.

### Eliminar un bucket en la UI de RustFS

1. Inicia sesión en la consola UI de RustFS.
2. En la página de inicio, selecciona el bucket a eliminar.
3. Haz clic en **Eliminar** a la derecha.
4. En el cuadro de diálogo, haz clic en **Confirmar**.

![bucket deletion](./images/bucket-deletion-on-ui.png)

### Eliminar un bucket con `mc`

Para la instalación y configuración de `mc`, consulta la [Guía de `mc`](../mc.md).

Usa `mc rb` para eliminar un bucket:

```
# eliminar bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirmar eliminación
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

### Eliminar un bucket mediante API

Usa la siguiente API para eliminar un bucket:

```
DELETE /{bucketName} HTTP/1.1
```

Ejemplo:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

Puedes confirmar en la UI de RustFS que el bucket `bucket-creation-by-api` se ha eliminado.