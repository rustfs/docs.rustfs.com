---
title: "Gestion des objets RustFS"
description: "Création et suppression d’objets"
---

# Objets RustFS

Un objet est l’unité de base du stockage dans RustFS. Il contient des données, des métadonnées et un identifiant unique (Object Key). Cette section illustre la gestion des objets via l’exemple du téléversement et de la suppression de fichiers.

> Pour les notions liées aux objets, voir la section [Concepts](../../concepts/glossary.md).

## Créer un objet

Prérequis :

- Une instance RustFS disponible (voir ../../installation/index.md).

Créez d’abord un [bucket](bucket-create-and-delete.md), puis téléversez un fichier dans ce bucket pour créer un objet. Cela peut se faire via l’UI, `mc` ou l’API.

### Téléverser depuis l’UI

1. Connectez‑vous à la console UI de RustFS.
1. Sélectionnez le bucket de destination.
1. En haut à droite de la page du bucket, choisissez « Nouveau dossier », « Nouveau fichier » ou « Téléverser fichier/dossier ».
1. Pour un téléversement local, cliquez sur « Téléverser fichier/dossier », choisissez les éléments, puis « Démarrer le téléversement ».

![object creation from ui](images/upload_file_from_ui.png)

Après le téléversement, cliquez sur l’objet pour afficher ses détails.

![object details info](images/object_details_info.png)

### Téléverser avec `mc`

> Voir le guide [`mc`](../mc.md).

```
# upload file
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirm file uploaded
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

### Téléverser via l’API

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

Exemple :

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024840Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=b7d8dc29ee34dfdf1f3e9e8e069892a8936f478586e7a2c90cf34f5b86d3a2dc' \
--data-binary '@/path/to/password.txt'
```

## Supprimer un objet

La suppression d’un objet peut se faire via l’UI, `mc` ou l’API. Par exemple, supprimez le fichier créé ci‑dessus.

## Supprimer depuis l’UI

1. Connectez‑vous à la console UI de RustFS.
1. Sélectionnez le bucket contenant le fichier.
1. Sélectionnez le fichier à supprimer.
1. Cliquez sur « Supprimer la sélection », puis « Confirmer ».

![object deletion from ui](images/delete_file_from_ui.png)

### Supprimer avec `mc`

```
# delete file
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirm deletion
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

### Supprimer via l’API

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Exemple :

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```