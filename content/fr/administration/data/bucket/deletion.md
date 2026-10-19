---
title: "Suppression d’un compartiment RustFS"
description: "Supprimez des compartiments avec l’interface RustFS, rc ou l’API S3."
---

Ce guide explique comment supprimer des compartiments (buckets) avec l’interface RustFS, `rc` ou l’API S3.

## Prérequis

- Installez et configurez [`rc`](/fr/operations/rc) avant d’utiliser le flux en ligne de commande.
- Videz le compartiment cible avant de le supprimer, ou n’utilisez `--force` qu’après avoir examiné les objets qui seront supprimés.

:::warning[La suppression est définitive]

La suppression d’un compartiment est irréversible et peut empêcher les applications qui en dépendent de fonctionner. Sauvegardez les données dont vous avez besoin avant de continuer.

:::

## Avec l’interface RustFS

1. Connectez-vous à la Console RustFS.
2. Sur la page d’accueil, sélectionnez le compartiment à supprimer.
3. À l’extrême droite, sélectionnez le bouton **Delete** (supprimer).
4. Dans la boîte de dialogue de confirmation, sélectionnez **Confirm** (confirmer).

![suppression d’un compartiment](images/bucket-deletion-on-ui.png)

## Avec `rc`

Consultez le [guide `rc`](/fr/operations/rc) pour l’installation et la configuration de l’alias.

Supprimez un compartiment :

```bash
rc bucket remove rustfs/my-bucket
```

```text
✓ Bucket 'rustfs/my-bucket' removed successfully.
```

## Avec l’API

Supprimez un compartiment via l’API :

```http
DELETE /{bucketName} HTTP/1.1
```

Les requêtes S3 doivent être signées avec AWS Signature V4 ; utilisez donc un client S3 plutôt que de composer les en-têtes à la main. Avec l’[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configurée pour vos clés d’accès :

```bash
aws s3api delete-bucket \
  --bucket bucket-creation-by-api \
  --endpoint-url http://localhost:9000
```

Vérifiez la suppression du compartiment dans la Console RustFS.
