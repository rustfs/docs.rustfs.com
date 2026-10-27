---
title: "Notifications d’événements"
description: "Configurez les notifications d’événements de compartiment RustFS et livrez les événements d’objets filtrés à des cibles externes."
---

Les notifications d’événements RustFS transmettent l’activité S3 des compartiments (bucket) vers des systèmes externes. Ce guide configure une cible webhook, l’associe à un compartiment et vérifie la livraison avec AWS CLI.

## Vue d’ensemble

Une notification d’événement comporte deux parties indépendantes :

- Une **cible de notification** définit l’endroit où RustFS envoie les événements.
- Une **configuration de notification de compartiment** sélectionne la cible, les types d’événements et les filtres facultatifs de clé d’objet pour un compartiment.

RustFS prend en charge les familles de cibles webhook, Kafka, MQTT, MySQL, PostgreSQL, NATS, Redis, AMQP et Pulsar. Le flux webhook ci-dessous convient aux services HTTP, aux fonctions sans serveur et aux plateformes d’intégration.

Les règles de compartiment utilisent les API S3 `PutBucketNotificationConfiguration` et `GetBucketNotificationConfiguration`. RustFS accepte actuellement les configurations de file d’attente ; les configurations de rubrique AWS SNS et de fonction Lambda ne sont pas prises en charge.

Les familles d’événements courantes sont les suivantes :

| Famille d’événements | Exemples d’événements |
| --- | --- |
| Création d’objet | `s3:ObjectCreated:Put`, `s3:ObjectCreated:Copy`, `s3:ObjectCreated:CompleteMultipartUpload` |
| Suppression d’objet | `s3:ObjectRemoved:Delete`, `s3:ObjectRemoved:DeleteMarkerCreated` |
| Accès à l’objet | `s3:ObjectAccessed:Get`, `s3:ObjectAccessed:Head` |
| Étiquetage d’objet | `s3:ObjectTagging:Put`, `s3:ObjectTagging:Delete` |
| Cycle de vie et hiérarchisation | Événements d’expiration, de restauration, de réplication et de transition |

Utilisez un caractère générique tel que `s3:ObjectCreated:*` pour vous abonner à tous les événements d’une famille.

## Configuration

Les notifications d’événements sont désactivées par défaut. Les variables d’environnement suivantes activent le module et créent une cible webhook nommée `primary` :

```bash
export RUSTFS_NOTIFY_ENABLE="true"
export RUSTFS_NOTIFY_WEBHOOK_ENABLE_PRIMARY="on"
export RUSTFS_NOTIFY_WEBHOOK_ENDPOINT_PRIMARY="https://events.example.com/rustfs"
export RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN_PRIMARY="<your-webhook-token>"
export RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR_PRIMARY="/var/lib/rustfs/notify-primary"
export RUSTFS_OUTBOUND_ALLOW_ORIGINS="https://events.example.com"
```

Redémarrez RustFS après avoir modifié des cibles gérées par des variables d’environnement. Le nom de la cible est la forme en minuscules du suffixe de la variable d’environnement : `_PRIMARY` crée donc `primary`. Utilisez l’ARN de cible `arn:rustfs:sqs:us-east-1:primary:webhook` dans la configuration du compartiment.

RustFS envoie un contrôle d’intégrité `HEAD` vers le chemin racine de l’origine du point de terminaison, par exemple `https://events.example.com/`, et envoie des requêtes `POST` JSON vers le point de terminaison configuré complet. L’origine doit répondre à `HEAD`, tandis que les requêtes de livraison doivent renvoyer un statut HTTP réussi. Autorisez le compte de service RustFS à écrire dans le répertoire de file d’attente.

### Réglages du webhook

Utilisez le même suffixe `_PRIMARY` pour tous les réglages de cette cible :

| Variable | Rôle |
| --- | --- |
| `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT_PRIMARY` | Point de terminaison de livraison HTTP ou HTTPS |
| `RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN_PRIMARY` | Jeton Bearer envoyé dans l’en-tête `Authorization` |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR_PRIMARY` | Répertoire de la file d’attente des livraisons |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_LIMIT_PRIMARY` | Nombre maximal d’événements en file d’attente |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CERT_PRIMARY` | Certificat client pour le TLS mutuel (mTLS) |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_KEY_PRIMARY` | Clé privée associée au certificat client |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA_PRIMARY` | Autorité de certification utilisée pour vérifier le récepteur |
| `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` | Désactive la vérification du certificat du serveur |

:::warning[Conservez la vérification des certificats]

N’activez pas `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` en production. Configurez `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA_PRIMARY` lorsque le récepteur utilise une autorité de certification privée. Si vous utilisez mTLS, fournissez à la fois le certificat client et la clé privée.

:::

Pour toutes les familles de cibles et les clés propres à chaque cible, consultez les [variables d’environnement](/fr/reference/environment-variables#event--audit-targets).

## Utilisation

L’exemple suivant envoie les événements de création et de suppression des objets `.dat` situés sous `uploads/` vers le webhook `primary`.

### Configurer la règle du compartiment

Créez la configuration de notification :

```json title="notification.json"
{
	"QueueConfigurations": [
		{
			"Id": "primary-uploads",
			"QueueArn": "arn:rustfs:sqs:us-east-1:primary:webhook",
			"Events": [
				"s3:ObjectCreated:*",
				"s3:ObjectRemoved:*"
			],
			"Filter": {
				"Key": {
					"FilterRules": [
						{ "Name": "prefix", "Value": "uploads/" },
						{ "Name": "suffix", "Value": ".dat" }
					]
				}
			}
		}
	]
}
```

Appliquez-la à `my-bucket` avec l’[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) :

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api put-bucket-notification-configuration \
	--bucket my-bucket \
	--notification-configuration file://notification.json
```

L’enregistrement d’une règle de compartiment ne prouve pas que sa cible existe ou qu’elle est en ligne. Confirmez que le module et la cible sont activés, que le récepteur répond aux contrôles d’intégrité et qu’une opération de test sur un objet produit une livraison.

Lisez la configuration active :

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api get-bucket-notification-configuration \
	--bucket my-bucket
```

Les filtres de préfixe et de suffixe sont sensibles à la casse et se combinent selon une logique ET. Une règle peut contenir au plus un filtre de préfixe et un filtre de suffixe.

### Gérer les règles avec rc

Le client `rc` peut ajouter, lister et supprimer des règles de notification de compartiment. Il ne configure pas le module de notification et ne crée pas la cible webhook, le courtier ou la base de données sous-jacents ; configurez-les d’abord au moyen de variables d’environnement ou de la Console.

Ajoutez les événements de création et de suppression pour la cible `primary` :

```bash
rc bucket event add \
	rustfs/my-bucket \
	arn:rustfs:sqs:us-east-1:primary:webhook \
	--event put,delete
```

Listez les règles actives :

```bash
rc --json bucket event list rustfs/my-bucket
```

Supprimez toutes les règles associées à cet ARN de cible :

```bash
rc bucket event remove \
	rustfs/my-bucket \
	arn:rustfs:sqs:us-east-1:primary:webhook
```

La commande actuelle `rc bucket event add` n’expose pas d’options de filtre de préfixe ou de suffixe. Utilisez AWS CLI lorsque la règle doit filtrer les clés d’objet.

### Déclencher et inspecter les événements

Chargez un objet correspondant, puis supprimez-le :

```bash
printf 'hello from RustFS\n' > hello.txt

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 cp hello.txt s3://my-bucket/uploads/hello.dat

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 rm s3://my-bucket/uploads/hello.dat
```

Le webhook reçoit une enveloppe JSON compatible avec S3. Les champs importants sont le nom de l’événement, le compartiment, la clé d’objet, la taille, l’ETag et les identifiants de requête :

```json
{
	"EventName": "s3:ObjectCreated:Put",
	"Records": [
		{
			"eventName": "s3:ObjectCreated:Put",
			"s3": {
				"bucket": { "name": "my-bucket" },
				"object": { "key": "uploads%2Fhello.dat" }
			}
		}
	]
}
```

Décodez la clé d’objet comme une donnée encodée pour l’URL avant de l’utiliser. Les consommateurs devraient aussi être idempotents : la livraison en file d’attente assure une reprise par stockage puis retransmission (store-and-forward), mais un récepteur peut observer le même événement plus d’une fois.

### Remplacer ou supprimer des règles

`PutBucketNotificationConfiguration` remplace l’intégralité de la configuration de notification du compartiment. Lorsque vous la mettez à jour, incluez toutes les règles que vous souhaitez conserver.

Supprimez toutes les règles en appliquant une configuration vide :

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api put-bucket-notification-configuration \
	--bucket my-bucket \
	--notification-configuration '{}'
```

## Étapes suivantes

Configurez les [cibles d’audit](/fr/security-compliance/audit-logs) lorsque vous avez besoin d’enregistrements de sécurité et de conformité au niveau des requêtes, plutôt que d’événements d’objets limités à un compartiment. Consultez [Observabilité](/fr/operations/observability) pour superviser le service RustFS.
