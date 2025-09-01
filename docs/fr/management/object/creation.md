---
title: "Création d'Objets RustFS"
description: "Vous pouvez créer des objets sur l'interface RustFS, ou via le client MinIO Client et l'API."
---

# Objets RustFS

Les objets (Object) sont l'unité de stockage de base de RustFS, contenant des données, des métadonnées et un identifiant unique (Object Key). Les données sont stockées sous forme d'objets. Ce chapitre présente la gestion des objets en prenant comme exemples le téléchargement et la suppression de fichiers.

> Pour les concepts liés aux objets (Object), vous pouvez consulter le chapitre [Concepts Fondamentaux](../../concepts/glossary.md).

## Création d'Objets

Prérequis :

- Une instance RustFS disponible. Vous pouvez vous référer au [Guide d'Installation](../../installation/index.md) pour l'installation.

[Créez un bucket](../bucket/creation.md), puis téléchargez des fichiers dans le bucket, cela complètera la création d'objets. Vous pouvez télécharger des fichiers via l'interface RustFS, `mc` ou l'API.

### Télécharger des Fichiers sur l'Interface RustFS

1. Connectez-vous à la console d'interface RustFS.
1. Sélectionnez le bucket dans lequel télécharger les fichiers.
1. Sur la page du bucket, en haut à droite, sélectionnez **Nouveau Répertoire**, **Nouveau Fichier** ou **Télécharger Fichier/Dossier** pour créer des fichiers/dossiers.
1. Pour télécharger des fichiers/dossiers depuis votre local, cliquez sur le bouton **Télécharger Fichier/Dossier**, sélectionnez les fichiers/dossiers locaux, cliquez sur **Commencer le Téléchargement** pour terminer le téléchargement.

![object creation from ui](images/upload_file_from_ui.png)

Une fois le téléchargement terminé, cliquez sur cet objet pour voir les informations détaillées de l'objet.

![object details info](images/object_details_info.png)

### Télécharger des Fichiers avec `mc`

> Pour l'installation et la configuration de `mc`, vous pouvez consulter le chapitre [Guide d'utilisation de `mc`](../../developer/mc.md).

Utilisez la commande `mc cp` pour télécharger des fichiers :

```
# télécharger un fichier
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirmer le téléchargement du fichier
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

Une fois le téléchargement terminé, vous pouvez le visualiser dans la console RustFS.

### Télécharger des Fichiers avec l'API

Utilisez l'API suivante pour télécharger des fichiers :

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

Exemple de requête :

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024840Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=b7d8dc29ee34dfdf1f3e9e8e069892a8936f478586e7a2c90cf34f5b86d3a2dc' \
--data-binary '@/path/to/password.txt'
```

Une fois le téléchargement terminé, vous pouvez le visualiser dans la console RustFS.

## Suppression d'Objets

De même, vous pouvez supprimer des objets sur l'interface utilisateur, avec `mc` ou l'API. Par exemple, supprimer les fichiers créés dans les étapes ci-dessus permettra de compléter la suppression d'objets.

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