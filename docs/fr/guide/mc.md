---
title: "Gérer les objets RustFS avec MinIO Client"
description: "Utiliser MinIO Client pour gérer les objets dans RustFS"
---

# MinIO Client (`mc`)

MinIO Client (`mc`) est l’outil en ligne de commande officiel de MinIO pour gérer les services de stockage d’objets. Compatible S3, `mc` peut aussi gérer les objets RustFS.

Prérequis :

- Une instance RustFS (../../fr/installation/index.md)
- `mc` installé
- [Clé d’accès](access-token.md) disponible

## Opérations RustFS avec `mc`

Commencez par définir un alias RustFS avec `mc alias` :

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Réponse :

```
Added `rustfs` successfully.
```

Ensuite, utilisez l’alias `rustfs` pour créer/supprimer des buckets et téléverser/télécharger des fichiers.

### Lister les buckets

```
mc ls rustfs
```

Réponse :

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Créer un bucket

```
mc mb rustfs/bucket-creation-by-mc
```

Réponse :

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### Supprimer un bucket

```
mc rb rustfs/bucket-creation-by-mc
```

Réponse :

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### Téléverser un fichier

```
mc cp file_name rustfs/bucket-creation-by-mc
```

Réponse :

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### Supprimer un fichier

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

Réponse :

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### Télécharger un fichier

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

Réponse :

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```