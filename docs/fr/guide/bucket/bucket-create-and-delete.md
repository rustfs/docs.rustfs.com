---
title: "Gestion des buckets RustFS"
description: "Création et suppression de buckets dans RustFS"
---

# Buckets RustFS

Un bucket est le conteneur logique de base pour organiser et gérer les données dans RustFS. Chaque bucket possède un nom unique et peut contenir plusieurs objets. Vous pouvez gérer les buckets via l’UI de RustFS, `mc` (MinIO Client) ou l’API (créer, supprimer, téléverser/télécharger des données, etc.).

## Créer un bucket

Prérequis :

- Une instance RustFS disponible (voir ../../installation/index.md).

## Créer depuis l’UI RustFS

1. Connectez‑vous à la console UI de RustFS.
1. En page d’accueil, en haut à gauche, cliquez sur « Créer un bucket ».
1. Saisissez le nom du bucket et cliquez sur « Créer ».

![bucket creation](images/bucket-creation-by-ui.png)

### Créer avec `mc`

> Voir le guide [`mc`](../mc.md) pour l’installation et la configuration.

```
# creat rustfs bucket
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirm bucket creation
mc ls rustfs/bucket-creation-by-mc
```

### Créer via l’API

```
PUT /{bucketName} HTTP/1.1
```

Exemple :

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

Vous pouvez confirmer dans l’UI que `bucket-creation-by-api` a été créé avec succès.

## Supprimer un bucket

Attention : la suppression d’un bucket peut provoquer des erreurs dans les applications qui en dépendent. Sauvegardez les données et assurez‑vous qu’il n’est plus nécessaire.

### Supprimer depuis l’UI RustFS

1. Connectez‑vous à la console UI de RustFS.
1. Sur la page d’accueil, sélectionnez le bucket à supprimer.
1. Cliquez sur « Supprimer » (à l’extrémité droite).
1. Dans la boîte de dialogue, cliquez sur « Confirmer ».

![bucket deletion](images/bucket-deletion-on-ui.png)

### Supprimer avec `mc`

> Voir le guide [`mc`](../mc.md).

```
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm bucket deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

### Supprimer via l’API

```
DELETE /{bucketName} HTTP/1.1
```

Exemple :

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

Dans l’UI RustFS, vous pouvez confirmer que `bucket-creation-by-api` a été supprimé.