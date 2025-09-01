---
title: "Gérer les Objets RustFS avec MinIO Client"
description: "Utilisez MinIO Client pour gérer les objets RustFS"
---

# MinIO Client (`mc`)

MinIO Client (`mc`) est l'outil en ligne de commande officiel fourni par MinIO, utilisé pour gérer les services de stockage d'objets MinIO. `mc` peut interagir avec MinIO, Amazon S3 et autres services de stockage d'objets compatibles S3, fournissant un moyen simple et efficace de gérer les données dans les services de stockage d'objets. Puisque MinIO est compatible S3, `mc` peut également être utilisé pour gérer les objets RustFS.

Prérequis :

- Une instance RustFS disponible. Vous pouvez vous référer au [Guide d'Installation](../installation/index.md) pour l'installation.
- Outil `mc` installé.
- [Clés d'accès](../administration/iam/access-token.md) disponibles.

## Opérer RustFS avec `mc`

Il faut d'abord utiliser la commande `mc alias` pour configurer l'alias RustFS :

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Réponse retournée :

```
Added `rustfs` successfully.
```

Ensuite, vous pouvez utiliser `mc` pour opérer l'alias `rustfs` pour la création/suppression de buckets, téléchargement/téléchargement de fichiers, etc.

### Lister les Buckets

Utilisez `mc ls` pour lister tous les buckets sous l'instance RustFS actuelle :

```
mc ls rustfs
```

Réponse retournée :

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Créer un Bucket

Utilisez la commande `mc mb` pour créer un bucket :