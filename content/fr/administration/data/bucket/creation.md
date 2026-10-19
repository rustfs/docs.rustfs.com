---
title: "Créer un compartiment"
description: "Créez des compartiments avec l’interface RustFS, rc ou l’API S3."
---

Ce guide explique comment créer des compartiments (buckets) avec l’interface RustFS, `rc` ou l’API S3.

## Prérequis

- Une instance RustFS en cours d’exécution (voir le [guide d’installation](../../../installation/index.md)).
- [`rc`](/fr/operations/rc) installé et configuré avec un alias pour le flux en ligne de commande.

## Utiliser la Console RustFS

1. Connectez-vous à la Console RustFS.
2. Sur la page **Buckets** (compartiments), dans le coin supérieur droit, sélectionnez **Create Bucket** (créer un compartiment).
3. Saisissez un nom de compartiment et sélectionnez **Create** (créer).

![création d’un compartiment](images/bucket-creation-by-ui.png)

## Avec `rc`

Consultez le [guide `rc`](/fr/operations/rc) pour l’installation et la configuration de l’alias.

Créez un compartiment :

```bash
rc bucket create rustfs/my-bucket
rc bucket list rustfs/
```

```text
✓ Bucket 'rustfs/my-bucket' created successfully.
```

## Avec l’API

Créez un compartiment via l’API :

```http
PUT /{bucketName} HTTP/1.1
```

Les requêtes S3 doivent être signées avec AWS Signature V4 ; utilisez donc un client S3 plutôt que de composer les en-têtes à la main. Avec l’[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configurée pour vos clés d’accès :

```bash
aws s3api create-bucket \
  --bucket bucket-creation-by-api \
  --endpoint-url http://localhost:9000
```

Confirmez que le compartiment apparaît dans la Console RustFS.
