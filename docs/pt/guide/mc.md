---
title: "Gerir objetos do RustFS com MinIO Client"
description: "Utilizar o MinIO Client para gerir objetos no RustFS"
---

# MinIO Client (`mc`)

O MinIO Client (`mc`) é a ferramenta oficial de linha de comando do MinIO para gerir serviços de armazenamento de objetos. Compatível com S3, o `mc` também pode gerir objetos do RustFS.

Pré‑requisitos:

- Uma instância do RustFS (../../pt/installation/index.md)
- `mc` instalado
- Uma [chave de acesso](access-token.md)

## Operações no RustFS com `mc`

Comece por definir um alias para o RustFS com `mc alias`:

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Resposta:

```
Added `rustfs` successfully.
```

Depois utilize o alias `rustfs` para criar/eliminar buckets e carregar/transferir ficheiros.

### Listar buckets

```
mc ls rustfs
```

Resposta:

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Criar bucket

```
mc mb rustfs/bucket-creation-by-mc
```

Resposta:

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### Eliminar bucket

```
mc rb rustfs/bucket-creation-by-mc
```

Resposta:

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### Carregar ficheiro

```
mc cp file_name rustfs/bucket-creation-by-mc
```

Resposta:

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### Eliminar ficheiro

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

Resposta:

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### Transferir ficheiro

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

Resposta:

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```