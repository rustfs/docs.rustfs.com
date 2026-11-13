---
title: "Politique de compartiment"
description: "Créez, appliquez, inspectez et vérifiez les politiques de compartiment RustFS avec l’API S3."
---

Les politiques de compartiment (bucket) RustFS sont des politiques de ressource compatibles avec S3, attachées directement à un compartiment. Utilisez-les pour accorder ou refuser l’accès au compartiment et à ses objets, y compris un accès anonyme contrôlé pour les téléchargements publics.

## Vue d’ensemble

Une politique de compartiment contient une ou plusieurs instructions qui correspondent à un principal, à une action, à une ressource et à des conditions facultatives. RustFS évalue la politique pour les requêtes adressées au compartiment avant d’autoriser l’opération de stockage.

Les politiques de compartiment et les politiques IAM ont des rôles distincts :

| Type de politique | Attachée à | Usage typique |
| --- | --- | --- |
| Politique de compartiment | Un compartiment | Accorder un accès public, ajouter des restrictions au niveau de la ressource ou autoriser l’accès à un seul compartiment. |
| Politique IAM | Un utilisateur ou un groupe | Définir ce qu’une identité authentifiée peut faire sur une ou plusieurs ressources. |

Un `Deny` explicite l’emporte sur un `Allow`. Les propriétaires du compartiment peuvent toujours lire, remplacer ou supprimer la politique de compartiment, afin qu’une instruction de refus ne puisse pas verrouiller définitivement l’administration des politiques.

RustFS implémente les opérations S3 standard `PutBucketPolicy`, `GetBucketPolicy`, `GetBucketPolicyStatus` et `DeleteBucketPolicy`.

:::warning[Politiques publiques]

Une instruction avec `"Principal": "*"` peut accorder un accès sans authentification. Restreignez autant que possible la portée de l’action et de la ressource, et vérifiez le résultat de façon anonyme avant d’utiliser la politique en production.

:::

## Configuration

### Prérequis

- Créez le compartiment cible avant d’appliquer une politique.
- Configurez l’AWS CLI avec un identifiant RustFS et la région `us-east-1`.
- Utilisez un identifiant autorisé à effectuer l’action de gestion de politique requise.

Définissez des variables réutilisables :

```bash
export RUSTFS_ENDPOINT=http://localhost:9000
export BUCKET_NAME=my-bucket
```

La gestion des politiques exige ces actions :

| Opération | Action requise |
| --- | --- |
| Appliquer ou remplacer une politique | `s3:PutBucketPolicy` |
| Lire une politique | `s3:GetBucketPolicy` |
| Lire l’état public | `s3:GetBucketPolicyStatus` |
| Supprimer une politique | `s3:DeleteBucketPolicy` |

### Structure du document de politique

Une politique de compartiment utilise la version `2012-10-17` et un tableau `Statement` :

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadObjects",
			"Effect": "Allow",
			"Principal": "*",
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws:s3:::my-bucket/public/*"]
		}
	]
}
```

L’ARN du compartiment et l’ARN d’objet sont distincts :

| Ressource | Format d’ARN | Exemples d’actions |
| --- | --- | --- |
| Compartiment | `arn:aws:s3:::my-bucket` | `s3:ListBucket`, `s3:GetBucketLocation` |
| Objets | `arn:aws:s3:::my-bucket/*` | `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` |

Utilisez un préfixe dans l’ARN d’objet, par exemple `arn:aws:s3:::my-bucket/public/*`, afin de limiter l’accès à une partie du compartiment. Pour le format complet des instructions et les opérateurs de condition pris en charge, consultez [Utilisateurs, groupes et politiques](/fr/security-compliance/iam/policies#policy-document-format).

### Blocage de l’accès public

Si `BlockPublicPolicy` est activé dans la configuration de blocage de l’accès public (Public Access Block) du compartiment, RustFS rejette une nouvelle politique qui contient une instruction `Allow` dont le principal est un caractère générique. Laissez cette protection activée, sauf si l’accès anonyme est intentionnel.

Le blocage de l’accès public ne remplace pas un examen attentif de la politique. Un `Deny` explicite existant continue de l’emporter sur les autorisations, et les requêtes authentifiées continuent d’être évaluées au regard des politiques IAM et des politiques de compartiment.

## Utilisation

### Créer une politique de lecture publique

Créez une politique qui n’autorise les téléchargements anonymes que depuis le préfixe `public/` :

```bash
cat > /tmp/my-bucket-policy.json <<'EOF'
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadObjects",
			"Effect": "Allow",
			"Principal": "*",
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws:s3:::my-bucket/public/*"]
		}
	]
}
EOF
```

Cette politique n’autorise pas le listage anonyme du compartiment, les chargements (uploads), les remplacements ni les suppressions.

### Appliquer la politique

```bash
aws s3api put-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--policy file:///tmp/my-bucket-policy.json \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

L’application d’une autre politique remplace intégralement la politique existante. Récupérez et examinez le document actuel avant de le mettre à jour ; les instructions ne sont pas fusionnées automatiquement.

### Lire la politique

```bash
aws s3api get-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT" \
	--query Policy \
	--output text
```

RustFS conserve le JSON de politique soumis. Si aucune politique n’existe, l’API renvoie `NoSuchBucketPolicy`.

### Vérifier l’état public

```bash
aws s3api get-bucket-policy-status \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

La réponse contient un état global d’accès public :

```json
{
	"PolicyStatus": {
		"IsPublic": false
	}
}
```

Le contrôle d’état actuel détecte le listage anonyme du compartiment (`s3:ListBucket`) et les chargements (`s3:PutObject`). Une politique qui n’expose que les téléchargements d’objets, comme l’exemple `public/` ci-dessus, peut encore indiquer `false`. Testez toujours l’action anonyme exacte, le préfixe d’objet et les conditions, plutôt que de traiter cet état comme une analyse d’accès complète.

### Supprimer la politique

```bash
aws s3api delete-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

La suppression d’une politique de compartiment ne supprime que cette politique de ressource. Les politiques IAM attachées aux utilisateurs et aux groupes restent inchangées.

## Vérification

Chargez un objet de test avec un identifiant authentifié :

```bash
printf 'hello from RustFS\n' > /tmp/hello.txt

aws s3api put-object \
	--bucket "$BUCKET_NAME" \
	--key public/hello.txt \
	--body /tmp/hello.txt \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

Vérifiez que l’objet autorisé peut être téléchargé sans identifiants :

```bash
curl --fail-with-body \
	"${RUSTFS_ENDPOINT}/${BUCKET_NAME}/public/hello.txt"
```

Vérifiez ensuite qu’un objet situé hors du préfixe autorisé n’est pas public :

```bash
aws s3api put-object \
	--bucket "$BUCKET_NAME" \
	--key private/hello.txt \
	--body /tmp/hello.txt \
	--endpoint-url "$RUSTFS_ENDPOINT"

curl --fail-with-body \
	"${RUSTFS_ENDPOINT}/${BUCKET_NAME}/private/hello.txt"
```

La seconde requête `curl` devrait échouer avec `AccessDenied`. Testez aussi chaque rôle d’utilisateur authentifié qui dépend de la politique, en particulier lorsque le document contient des conditions ou des instructions de refus explicites.

## Étapes suivantes

- [Gérer les politiques IAM](/fr/security-compliance/iam/policies)
- [Gérer les identifiants](/fr/operations/credentials)
- [Configurer les journaux d’audit](/fr/security-compliance/audit-logs)
