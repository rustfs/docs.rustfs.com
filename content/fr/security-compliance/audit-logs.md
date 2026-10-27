---
title: "Cibles d’audit"
description: "Configurez les cibles d’audit RustFS et transmettez les enregistrements d’audit au niveau de la requête vers des systèmes externes."
---

Les cibles d’audit RustFS envoient des enregistrements d’activité au niveau de la requête vers des systèmes externes, pour la supervision de sécurité, la conformité et l’investigation d’incidents. Ce guide configure une cible webhook et vérifie la livraison d’audit avec une requête S3.

## Vue d’ensemble

Les cibles d’audit et les notifications d’événements ont des rôles distincts :

| Caractéristique | Cibles d’audit | Notifications d’événements |
| --- | --- | --- |
| Portée | Activité des requêtes et de l’API dans l’ensemble de RustFS | Événements sélectionnés par la configuration de chaque compartiment (bucket) |
| Routage | Chaque cible d’audit activée reçoit les enregistrements d’audit | Chaque règle de compartiment sélectionne une cible |
| Filtrage | Aucun filtre d’événement par cible | Filtres par événement, préfixe et suffixe |
| Usage typique | Gestion des informations et des événements de sécurité (SIEM), conformité, investigation | Flux applicatifs et pipelines de données |

RustFS prend en charge les familles de cibles d’audit webhook, Kafka, MQTT, MySQL, PostgreSQL, NATS, Redis, AMQP et Pulsar. Chaque cible activée reçoit le flux d’audit de façon indépendante.

Les enregistrements d’audit peuvent contenir les chemins de requête, les paramètres de requête, certains en-têtes, les claims d’identité, les identifiants de clé d’accès, les hôtes distants, les agents utilisateur, le statut de réponse et les erreurs. Protégez la destination et restreignez l’accès selon vos exigences de conservation et de conformité.

## Configuration

La livraison d’audit est désactivée par défaut. Les variables d’environnement suivantes activent le module et créent une cible webhook nommée `primary` :

```bash
export RUSTFS_AUDIT_ENABLE="true"
export RUSTFS_AUDIT_WEBHOOK_ENABLE_PRIMARY="on"
export RUSTFS_AUDIT_WEBHOOK_ENDPOINT_PRIMARY="https://audit.example.com/rustfs"
export RUSTFS_AUDIT_WEBHOOK_AUTH_TOKEN_PRIMARY="<your-webhook-token>"
export RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY="/var/lib/rustfs/audit-primary"
export RUSTFS_OUTBOUND_ALLOW_ORIGINS="https://audit.example.com"
```

Redémarrez RustFS après avoir modifié des cibles gérées par l’environnement. Le nom de la cible est la forme en minuscules du suffixe de la variable d’environnement : `_PRIMARY` crée donc `primary`.

RustFS envoie un contrôle d’intégrité `HEAD` vers le chemin racine de l’origine du point de terminaison, par exemple `https://audit.example.com/`, et envoie des requêtes `POST` JSON vers le point de terminaison configuré complet. L’origine doit répondre à `HEAD`, tandis que les requêtes de livraison doivent renvoyer un statut HTTP de succès. Autorisez le compte de service RustFS à écrire dans le répertoire de file d’attente.

### Réglages du webhook

Utilisez le même suffixe `_PRIMARY` pour tous les réglages de cette cible :

| Variable | Rôle |
| --- | --- |
| `RUSTFS_AUDIT_WEBHOOK_ENDPOINT_PRIMARY` | Point de terminaison de livraison HTTP ou HTTPS |
| `RUSTFS_AUDIT_WEBHOOK_AUTH_TOKEN_PRIMARY` | Jeton Bearer envoyé dans l’en-tête `Authorization` |
| `RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY` | Répertoire des enregistrements d’audit en file d’attente |
| `RUSTFS_AUDIT_WEBHOOK_QUEUE_LIMIT_PRIMARY` | Nombre maximal d’enregistrements en file d’attente |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_CERT_PRIMARY` | Certificat client pour le TLS mutuel (mTLS) |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_KEY_PRIMARY` | Clé privée associée au certificat client |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_CA_PRIMARY` | Autorité de certification utilisée pour vérifier le récepteur |
| `RUSTFS_AUDIT_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` | Désactive la vérification du certificat serveur |

:::warning[Protégez les données d’audit]

Utilisez HTTPS pour les collecteurs distants. Laissez la vérification des certificats activée, stockez les jetons Bearer hors du dépôt de code source et fournissez à la fois le certificat client et la clé lorsque vous utilisez mTLS. Les charges utiles d’audit peuvent contenir des métadonnées de requête et d’identité sensibles pour la sécurité.

:::

Pour toutes les familles de cibles et les clés propres à chaque cible, consultez les [variables d’environnement](/fr/reference/environment-variables#event--audit-targets).

### Plusieurs cibles

Ajoutez un suffixe distinct en majuscules pour définir une autre instance. Par exemple, utilisez `RUSTFS_AUDIT_WEBHOOK_ENABLE_ARCHIVE` et les réglages `_ARCHIVE` correspondants pour créer un webhook `archive` à côté de `primary`.

RustFS diffuse chaque enregistrement d’audit vers toutes les cibles activées. L’échec d’une cible n’empêche pas les tentatives de livraison vers les autres.

:::note[Cibles gérées par l’environnement]

Une cible définie par des variables d’environnement ne peut être ni modifiée ni supprimée via la Console ou l’API d’administration. Modifiez ses variables d’environnement, puis redémarrez RustFS. Ne définissez pas la même cible à la fois par des variables d’environnement et par une configuration persistée.

:::

## Utilisation

:::note[Prise en charge de la ligne de commande rc]

Le client `rc` actuel ne fournit pas de commandes pour créer, lister ou supprimer les cibles d’audit. Configurez-les par des variables d’environnement ou dans la Console. Les commandes `rc bucket event` gèrent uniquement les règles de notification des compartiments ; elles ne gèrent pas la livraison d’audit.

:::

### Vérifier le récepteur

Avant de générer du trafic, vérifiez que le collecteur est accessible depuis l’hôte RustFS et qu’il accepte le jeton Bearer configuré :

```bash
curl --fail --head \
	https://audit.example.com/
```

Le contrôle d’intégrité mesure l’accessibilité de l’origine et n’inclut pas le jeton d’autorisation du webhook. Confirmez séparément que le chemin de livraison `/rustfs` configuré accepte `Authorization: Bearer <your-webhook-token>` sur les requêtes `POST`.

Si la cible reste hors ligne, vérifiez le DNS, la politique de pare-feu, `RUSTFS_OUTBOUND_ALLOW_ORIGINS`, la confiance accordée aux certificats et la réponse de l’origine à `HEAD /`.

### Générer un enregistrement d’audit

Effectuez une opération S3 authentifiée sur RustFS :

```bash
printf 'hello from RustFS\n' > hello.txt

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 cp hello.txt s3://my-bucket/hello.txt
```

Le webhook reçoit une entrée d’audit JSON. Les champs varient selon l’opération et les champs facultatifs vides peuvent être omis. Un sous-ensemble représentatif est le suivant :

```json
{
	"version": "1",
	"time": 1719331200000,
	"event": "s3:ObjectCreated:Put",
	"trigger": "s3",
	"api": {
		"name": "PutObject",
		"bucket": "my-bucket",
		"object": "hello.txt",
		"status": "OK",
		"statusCode": 200
	},
	"remotehost": "192.0.2.10",
	"requestID": "<request-id>",
	"userAgent": "aws-cli",
	"requestPath": "/my-bucket/hello.txt",
	"accessKey": "<your-access-key>"
}
```

Considérez le schéma de la charge utile comme additif. Analysez les champs dont vous avez besoin et tolérez les champs inconnus ou absents, afin que les collecteurs restent compatibles avec les versions ultérieures de RustFS.

### Comportement de livraison

Lorsque `RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY` est configuré, RustFS stocke les enregistrements en attente sur disque et les rejoue après des échecs de livraison transitoires. Dimensionnez le répertoire de file d’attente et `RUSTFS_AUDIT_WEBHOOK_QUEUE_LIMIT_PRIMARY` pour la fenêtre d’indisponibilité attendue, puis surveillez à la fois l’utilisation du disque et l’état de la cible.

La livraison webhook est au moins une fois. Un délai d’expiration peut survenir après que le récepteur a traité une requête, mais avant que RustFS n’observe la réponse : utilisez `requestID` et d’autres champs stables pour dédupliquer les enregistrements lorsque c’est nécessaire.

Le récepteur ne devrait accuser réception d’un enregistrement qu’après l’avoir accepté de façon durable. Renvoyer un statut autre que le succès maintient les échecs visibles pour le chemin de livraison ; un enregistrement accepté puis ignoré en silence ne peut pas être récupéré par RustFS.

## Étapes suivantes

Configurez les [notifications d’événements](/fr/operations/event-notifications) pour les flux applicatifs limités à un compartiment. Consultez l’[observabilité](/fr/operations/observability) pour surveiller l’état du service et les [identifiants](/fr/operations/credentials) pour limiter l’accès administratif.
