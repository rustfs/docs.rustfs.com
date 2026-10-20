---
title: "Suppression d’objets"
description: "Supprimez des objets avec la Console RustFS, rc ou l’API S3."
---

Ce guide décrit la suppression d’objets.

## Prérequis

- Installez et configurez [`rc`](/fr/operations/rc) avant d’utiliser le travail en ligne de commande.
- Confirmez l’alias, le compartiment (bucket) et la clé d’objet avant de supprimer un objet.

## Avec la Console RustFS

1. Connectez-vous à la Console RustFS.
2. Sélectionnez le compartiment qui contient l’objet à supprimer.
3. Sur la page du compartiment, sélectionnez l’objet à supprimer.
4. Sélectionnez **Delete Selected Items** dans le coin supérieur droit, puis sélectionnez **Confirm**.

![suppression d’un objet depuis la Console](images/delete_file_from_ui.png)

## Avec `rc`

Supprimez un objet :

```bash
rc object remove rustfs/my-bucket/hello.txt
rc object list rustfs/my-bucket
```

```text
Removed: rustfs/my-bucket/hello.txt
✓ Removed 1 object(s).
```

Vérifiez la suppression dans la Console RustFS.

## Avec l’API

Supprimez un objet via l’API :

```http
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Les requêtes S3 doivent être signées avec AWS Signature V4 ; utilisez donc un client S3 plutôt que de composer les en-têtes à la main. Avec l’[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configurée pour vos clés d’accès :

```bash
aws s3api delete-object \
  --bucket bucket-creation-by-api \
  --key hello.txt \
  --endpoint-url http://localhost:9000
```

Vérifiez la suppression dans la Console RustFS.
