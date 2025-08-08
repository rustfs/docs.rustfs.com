---
title: "Gestión de buckets en RustFS"
description: "Creación y eliminación de buckets en RustFS"
---

# Buckets de RustFS

Un bucket es el contenedor lógico básico para organizar y gestionar datos en RustFS. Cada bucket tiene un nombre único y puede contener múltiples objetos. Puede operar sobre los buckets mediante la UI de RustFS, `mc` (MinIO Client) o la API (crear, eliminar, subir/descargar datos, etc.).

## Crear un bucket

Requisitos previos:

- Una instancia disponible de RustFS (véase ../../installation/index.md).

## Crear un bucket en la UI de RustFS

1. Inicie sesión en la consola UI de RustFS.
1. En la página de inicio, arriba a la izquierda, seleccione «Crear bucket».
1. Introduzca el nombre del bucket y haga clic en «Crear».

![bucket creation](images/bucket-creation-by-ui.png)

### Crear un bucket con `mc`

> Consulte la guía de [`mc`](../mc.md) para instalación y configuración.

```
# creat rustfs bucket
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirm bucket creation
mc ls rustfs/bucket-creation-by-mc
```

### Crear un bucket con la API

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

Puede confirmar en la UI que `bucket-creation-by-api` fue creado correctamente.

## Eliminar un bucket

Aviso: eliminar un bucket puede provocar errores en aplicaciones dependientes. Haga copia de seguridad de los datos y confirme que ya no es necesario.

### Eliminar un bucket en la UI de RustFS

1. Inicie sesión en la consola UI de RustFS.
1. En la página de inicio, seleccione el bucket a eliminar.
1. Haga clic en el botón «Eliminar» en el extremo derecho.
1. En el diálogo, haga clic en «Confirmar».

![bucket deletion](images/bucket-deletion-on-ui.png)

### Eliminar un bucket con `mc`

> Consulte la guía de [`mc`](../mc.md).

```
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm bucket deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

### Eliminar un bucket con la API

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

En la UI de RustFS puede confirmar que `bucket-creation-by-api` fue eliminado.