---
title: "Suppression d'Objets RustFS"
description: "Vous pouvez supprimer des objets sur l'interface RustFS, ou via le client MinIO Client et l'API."
---

# Objets RustFS

Les objets (Object) sont l'unité de stockage de base de RustFS, contenant des données, des métadonnées et un identifiant unique (Object Key). Les données sont stockées sous forme d'objets. Ce chapitre présente la gestion des objets en prenant comme exemples le téléchargement et la suppression de fichiers.

> Pour les concepts liés aux objets (Object), vous pouvez consulter le chapitre [Concepts Fondamentaux](../../concepts/glossary.md).

## Suppression d'Objets

De même, vous pouvez supprimer des objets sur l'interface utilisateur, avec `mc` ou l'API. Par exemple, supprimer les fichiers créés dans les étapes précédentes permettra de compléter la suppression d'objets.

## Supprimer des Fichiers sur l'Interface RustFS

1. Connectez-vous à la console d'interface RustFS.
1. Sélectionnez le bucket contenant les fichiers à supprimer.
1. Sur la page du bucket, sélectionnez les fichiers à supprimer.
1. Cliquez sur **Supprimer les Éléments Sélectionnés** en haut à droite, puis cliquez sur **Confirmer** dans la boîte de dialogue qui apparaît pour terminer la suppression des fichiers.

![object deletion from ui](images/delete_file_from_ui.png)

### Supprimer des Fichiers avec `mc`

Utilisez la commande `mc rm` pour supprimer des fichiers :

```
# supprimer un fichier
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirmer la suppression
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

Vous pouvez confirmer dans l'interface RustFS que le fichier a été supprimé.

### Supprimer des Fichiers avec l'API

Utilisez l'API suivante pour supprimer des fichiers :

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Exemple de requête :

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```

Vous pouvez confirmer dans l'interface RustFS que le fichier a été supprimé.