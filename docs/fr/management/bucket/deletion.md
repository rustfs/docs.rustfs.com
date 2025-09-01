---
title: "Suppression de Buckets RustFS"
description: "Vous pouvez supprimer des buckets sur l'interface RustFS, ou via le client MinIO Client et l'API."
---

# Suppression de Buckets RustFS

Ce chapitre partage comment supprimer des buckets via l'interface RustFS, `mc` (MinIO Client) ou l'API.

**Attention** : Les buckets sont des composants importants pour le stockage de données, supprimer un bucket peut causer des erreurs dans les applications utilisant ce bucket. Avant de supprimer un bucket, assurez-vous d'avoir sauvegardé toutes les données dans le bucket et que vous n'avez plus besoin d'utiliser ce bucket.

## Supprimer un Bucket sur l'Interface RustFS

1. Connectez-vous à la console d'interface RustFS.
1. Sur la page d'accueil, sélectionnez le bucket à supprimer.
1. À l'extrême droite, sélectionnez le bouton **Supprimer**.
1. Dans la boîte de dialogue qui apparaît, cliquez sur **Confirmer** pour terminer la suppression du bucket.

![bucket deletion](images/bucket-deletion-on-ui.png)

## Supprimer un Bucket avec `mc`

Pour l'installation et la configuration de `mc`, vous pouvez consulter le chapitre [Guide d'utilisation de `mc`](../../developer/mc.md).

Utilisez la commande `mc rb` pour supprimer un bucket :

```
# supprimer un bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirmer la suppression du bucket
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

## Supprimer un Bucket avec l'API

Utilisez l'API suivante pour supprimer un bucket :

```
DELETE /{bucketName} HTTP/1.1
```

Exemple de requête :

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

Vous pouvez confirmer dans l'interface RustFS que le bucket `bucket-creation-by-api` a été supprimé.