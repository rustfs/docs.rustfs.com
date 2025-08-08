---
title: "Gestionar objetos de RustFS con MinIO Client"
description: "Uso de MinIO Client para gestionar objetos en RustFS"
---

# MinIO Client (`mc`)

MinIO Client (`mc`) es la herramienta de línea de comandos oficial de MinIO para gestionar servicios de almacenamiento de objetos. Al ser compatible con S3, `mc` también puede gestionar objetos de RustFS.

Requisitos previos:

- Una instancia de RustFS (../../es/installation/index.md)
- `mc` instalado
- [Clave de acceso](access-token.md) disponible

## Operar RustFS con `mc`

Primero configure un alias para RustFS con `mc alias`:

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Respuesta:

```
Added `rustfs` successfully.
```

A partir de aquí, utilice el alias `rustfs` para crear/eliminar buckets y subir/descargar archivos.

### Listar buckets

```
mc ls rustfs
```

Respuesta:

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Crear bucket

```
mc mb rustfs/bucket-creation-by-mc
```

Respuesta:

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### Eliminar bucket

```
mc rb rustfs/bucket-creation-by-mc
```

Respuesta:

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### Subir archivo al bucket

```
mc cp file_name rustfs/bucket-creation-by-mc
```

Respuesta:

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### Eliminar archivo del bucket

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

Respuesta:

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### Descargar archivo del bucket

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

Respuesta:

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```