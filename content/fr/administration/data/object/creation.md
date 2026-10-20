---
title: "Création d’objets"
description: "Créez des objets avec la Console RustFS, rc ou l’API S3."
---

Les objets sont les unités fondamentales de stockage dans RustFS : ils contiennent les données, les métadonnées et une clé unique. Ce guide décrit la création d’objets, c’est-à-dire le chargement (upload).

## Prérequis

- Une instance RustFS en cours d’exécution (voir le [guide d’installation](../../../installation/index.md)).
- [`rc`](/fr/operations/rc) installé et configuré avec un alias pour le travail en ligne de commande.
- Un compartiment (bucket) cible. Créez-en un en suivant [Création d’un compartiment](../bucket/creation.md).

## Créer des objets

### Avec la Console RustFS

1. Connectez-vous à la Console RustFS.
2. Sélectionnez le compartiment cible.
3. Sur la page du compartiment, dans le coin supérieur droit, sélectionnez **New Directory**, **New File** ou **Upload File/Folder**.
4. Pour charger depuis votre machine locale, cliquez sur **Upload File/Folder**, sélectionnez les fichiers, puis cliquez sur **Start Upload**.

![création d’un objet depuis la Console](images/upload_file_from_ui.png)

Sélectionnez un objet pour afficher ses détails.

![informations de détail de l’objet](images/object_details_info.png)

### Avec `rc`

Consultez le [guide `rc`](/fr/operations/rc) pour l’installation et la configuration de l’alias.

Chargez un fichier :

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object list rustfs/my-bucket
```

Vérifiez le chargement dans la Console RustFS.

### Avec l’API

Chargez un fichier via l’API :

```http
PUT /{bucketName}/{objectName} HTTP/1.1
```

Les requêtes S3 doivent être signées avec AWS Signature V4 ; utilisez donc un client S3 plutôt que de composer les en-têtes à la main. Avec l’[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configurée pour vos clés d’accès :

```bash
aws s3api put-object \
  --bucket bucket-creation-by-api \
  --key hello.txt \
  --body /path/to/hello.txt \
  --endpoint-url http://localhost:9000
```

Vérifiez le chargement dans la Console RustFS.

## Supprimer des objets

Consultez [Suppression d’objets](./deletion.md).

Pour supprimer un objet avec l’API S3, utilisez :

```http
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Exemple de requête :

```bash
aws s3api delete-object \
  --bucket bucket-creation-by-api \
  --key hello.txt \
  --endpoint-url http://localhost:9000
```

Confirmez dans la Console RustFS que l’objet n’apparaît plus.
