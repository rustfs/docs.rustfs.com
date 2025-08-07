---
title: "Gestionar objetos de RustFS con MinIO Client"
description: "Usa MinIO Client para gestionar los objetos de RustFS."
---

# MinIO Client (`mc`)

MinIO Client (`mc`) es la herramienta oficial de línea de comandos de MinIO para gestionar almacenamiento de objetos MinIO. `mc` puede interactuar con MinIO, Amazon S3 y otros servicios compatibles con S3, proporcionando una forma sencilla y eficiente de gestionar datos. Dado que RustFS es compatible con S3, `mc` también puede utilizarse para gestionar objetos en RustFS.

Requisitos previos:

- Una instancia disponible de RustFS. Consulta la [Guía de instalación](/es/installation/index) para desplegarla.
- `mc` instalado.
- Una [clave de acceso](access-token.md) válida.

## Operar RustFS con `mc`

Primero, configura un alias para RustFS usando `mc alias`:

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Respuesta:

```
Added `rustfs` successfully.
```

A continuación, puedes usar `mc` con el alias `rustfs` para crear/eliminar buckets y subir/descargar objetos.

### Listar buckets

Usa `mc ls` para listar todos los buckets de la instancia actual de RustFS:

```
mc ls rustfs
```

Respuesta:

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Crear un bucket

Usa `mc mb` para crear un bucket:

```
mc mb rustfs/bucket-creation-by-mc
```

Respuesta:

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### Eliminar un bucket

Usa `mc rb` para eliminar un bucket:

```
mc rb rustfs/bucket-creation-by-mc
```

Respuesta:

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### Subir un archivo a un bucket

Usa `mc cp` para subir un archivo a un bucket:

```
mc cp file_name rustfs/bucket-creation-by-mc
```

Respuesta:

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### Eliminar un objeto del bucket

Usa `mc rm` para eliminar un objeto del bucket:

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

Respuesta:

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### Descargar un objeto

Usa `mc get` para descargar un objeto:

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

Respuesta:

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```