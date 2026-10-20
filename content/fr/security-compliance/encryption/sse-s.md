---
title: "SSE-S3"
description: "Configurez le chiffrement SSE-S3 géré par le serveur pour les compartiments RustFS et les écritures d’objets."
---

SSE-S3 utilise le mode de chiffrement S3 `AES256`. RustFS génère une clé de chiffrement des données unique pour chaque objet chiffré et utilise le service KMS configuré pour envelopper cette clé. Les clients ne fournissent ni ne conservent la clé de chiffrement.

## Prérequis

- Configurez et démarrez [KMS](./kms.md), créez sa clé par défaut et vérifiez que la clé est disponible avant d’activer SSE-S3.
- Installez et configurez [`rc`](/fr/operations/rc).
- Créez le compartiment (bucket) cible et vérifiez que les écritures d’objets ordinaires réussissent.

:::warning[La disponibilité du KMS est exigée]

RustFS accepte une valeur par défaut SSE-S3 sur le compartiment même lorsque le KMS est indisponible, mais les écritures d’objets chiffrés échouent alors. Vérifiez une écriture et une lecture chiffrées avant d’utiliser le compartiment pour des données de production.

:::

## Définir le chiffrement par défaut du compartiment

Appliquez SSE-S3 aux nouvelles écritures qui ne précisent pas de mode de chiffrement au niveau de l’objet :

```bash
rc bucket encryption set rustfs/my-bucket --mode sse-s3
rc bucket encryption info rustfs/my-bucket
```

Le mode indiqué devrait être `SSE-S3`.

Chargez (upload) et lisez un objet de test :

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object show rustfs/my-bucket/hello.txt
```

## Chiffrer un objet explicitement

Appliquez SSE-S3 à une seule destination sans modifier la valeur par défaut du compartiment :

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	--enc-s3 rustfs/my-bucket/hello.txt
```

Pour les écritures récursives, le sélecteur de chiffrement doit correspondre exactement au préfixe de destination :

```bash
rc object copy ./reports/ rustfs/my-bucket/reports/ --recursive \
	--enc-s3 rustfs/my-bucket/reports/
```

## Effacer la valeur par défaut du compartiment

Supprimez la règle par défaut :

```bash
rc bucket encryption clear rustfs/my-bucket
rc bucket encryption info rustfs/my-bucket
```

Effacer ou modifier la valeur par défaut du compartiment n’affecte que les écritures ultérieures. Cela ne déchiffre ni ne réécrit les objets existants.

## En-têtes de requête

Les clients S3 demandent SSE-S3 avec :

```http
x-amz-server-side-encryption: AES256
```

Une requête au niveau de l’objet remplace la valeur par défaut du compartiment pour cette écriture. Si aucun mode au niveau de l’objet n’est fourni, RustFS détermine le mode effectif à partir de la configuration de chiffrement du compartiment.

## Étapes suivantes

Utilisez [SSE-KMS](./kms.md#vérifier-le-chiffrement-reposant-sur-le-kms) lorsque vous avez besoin d’un ID de clé KMS explicite, ou comparez [SSE-C](./sse-c.md) pour des clés détenues par le client.
