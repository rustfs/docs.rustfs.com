---
title: "Création de Buckets RustFS"
description: "Vous pouvez créer des buckets sur l'interface RustFS, ou via le client MinIO Client et l'API."
---

# Création de Buckets RustFS

Ce chapitre partage comment créer des buckets via l'interface RustFS, `mc` (MinIO Client) ou l'API.

## Création de Buckets

Prérequis :

- Une instance RustFS disponible. Vous pouvez vous référer au [Guide d'Installation](../../installation/index.md) pour l'installation.

## Créer un Bucket sur l'Interface RustFS

1. Connectez-vous à la console d'interface RustFS.
1. Sur la page d'accueil, en haut à gauche, sélectionnez **Créer un bucket**.
1. Entrez le nom du bucket, cliquez sur **Créer** pour terminer la création du bucket.

![bucket creation](images/bucket-creation-by-ui.png)

### Créer un Bucket avec `mc`

> Pour l'installation et la configuration de `mc`, vous pouvez consulter le chapitre [Guide d'utilisation de `mc`](../../developer/mc.md).

Utilisez la commande `mc mb` pour créer un bucket :

```
# créer un bucket rustfs
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirmer la création du bucket
mc ls rustfs/bucket-creation-by-mc
```

### Créer un Bucket avec l'API

Utilisez l'API suivante pour créer un bucket :

```
PUT /{bucketName} HTTP/1.1
```

Exemple de requête :

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

Dans l'interface RustFS, vous pouvez confirmer que le bucket `bucket-creation-by-api` a été créé avec succès.