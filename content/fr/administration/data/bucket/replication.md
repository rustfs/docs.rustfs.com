---
title: "Réplication de compartiment"
description: "Configurez, validez et surveillez la réplication asynchrone entre des compartiments RustFS dont la gestion des versions est activée."
---

La réplication de compartiment (bucket) RustFS copie les versions d’objets sélectionnées d’un compartiment source vers un compartiment cible. Utilisez-la pour conserver une copie distante des données du compartiment, répartir des objets entre des déploiements ou préparer une copie secondaire pour des flux de reprise.

## Vue d’ensemble

La réplication de compartiment comporte deux couches de configuration :

1. Une **cible distante** enregistre le point de terminaison cible, le compartiment, les identifiants et l’ARN de cible généré.
2. Une **configuration de réplication** S3 attache des règles au compartiment source et référence cet ARN de cible.

Le compartiment source et le compartiment cible doivent tous deux avoir la gestion des versions activée. RustFS vérifie la connexion à la cible et la gestion des versions du compartiment cible lorsque vous enregistrez la cible distante. Il rejette une configuration de réplication dont les règles activées référencent un ARN de cible inconnu ou obsolète.

La réplication est asynchrone par défaut. Un chargement (upload) source réussi signifie que RustFS a accepté l’objet source ; cela ne signifie pas que la copie cible est déjà terminée.

Les règles peuvent sélectionner des objets par préfixe ou par étiquettes d’objet, et contrôler ces comportements :

| Réglage de règle | Comportement |
| --- | --- |
| `Status` | Active ou désactive la règle. |
| `Filter` | Restreint la réplication par préfixe de clé, par étiquettes d’objet, ou par les deux. |
| `ExistingObjectReplication` | Inclut les objets qui existaient avant la règle lorsqu’il vaut `Enabled`. |
| `DeleteMarkerReplication` | Réplique les marqueurs de suppression lorsqu’il vaut `Enabled`. |
| `DeleteReplication` | Réplique la suppression d’une version d’objet précise lorsqu’il vaut `Enabled`. |
| `Destination` | Identifie la cible distante enregistrée par son ARN. |

La réplication de compartiment est directionnelle. Configurez une cible et une règle distinctes dans le sens inverse si les deux compartiments doivent accepter des écritures et les répliquer l’un vers l’autre. Ne confondez pas la réplication de compartiment avec la [réplication de site](/fr/operations/high-availability/site-replication), qui synchronise une configuration de site et des données d’identité plus larges.

## Configuration

### Prérequis

- Un déploiement RustFS source et un déploiement cible joignable, compatible avec S3.
- Un compartiment source et un compartiment cible avec la gestion des versions activée.
- Un identifiant cible dédié qui peut inspecter la gestion des versions du compartiment cible et écrire les versions d’objets répliquées ainsi que les marqueurs de suppression.
- Un administrateur source autorisé à gérer les cibles distantes et la configuration de réplication.
- Un accès réseau vers le point de terminaison cible, depuis chaque nœud source qui peut exécuter le travail de réplication.
- Le client RustFS [`rc`](/fr/operations/rc) installé sur un hôte d’administration.

Configurez un alias `rc` pour chaque déploiement. Utilisez des identifiants dédiés et remplacez les points de terminaison d’exemple avant d’exécuter les commandes :

```bash
rc alias set source https://source.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias set target https://target.example.com:9000 \
	<target-access-key> <target-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias list
```

Le déploiement source utilise les identifiants de l’alias cible lorsqu’il enregistre la cible distante. `rc alias list` affiche les points de terminaison, mais n’affiche pas les clés secrètes.

:::warning[Protégez les identifiants cibles]

RustFS stocke l’identifiant cible dans la configuration de cible distante du compartiment source. Utilisez un identifiant dédié dont l’accès est limité au compartiment cible, et ne réutilisez pas un identifiant racine.

:::

### Autorisations

L’administration côté source utilise ces actions de politique :

| Opération | Action requise |
| --- | --- |
| Enregistrer, mettre à jour ou supprimer une cible distante | `admin:SetBucketTarget` |
| Lister les cibles distantes | `admin:GetBucketTarget` |
| Lire les métriques de réplication | `admin:GetReplicationMetrics` |
| Appliquer ou supprimer la configuration de réplication | `s3:PutReplicationConfiguration` |
| Lire la configuration de réplication | `s3:GetReplicationConfiguration` |

L’identifiant cible doit réussir la validation de cible de RustFS, qui vérifie l’accès au compartiment, la gestion des versions, les écritures d’objets répliqués, les marqueurs de suppression répliqués et la suppression de versions d’objet. Lorsque le verrouillage d’objet (Object Lock) est activé sur le compartiment source, la cible doit offrir une prise en charge compatible du verrouillage d’objet.

### Créer les compartiments et activer la gestion des versions

Créez le compartiment source :

```bash
rc bucket create source/my-bucket
```

Créez le compartiment cible :

```bash
rc bucket create target/my-bucket-replica
```

Activez la gestion des versions sur les deux compartiments :

```bash
rc bucket version enable source/my-bucket
rc bucket version enable target/my-bucket-replica

rc bucket version info source/my-bucket
rc bucket version info target/my-bucket-replica
```

Ne suspendez pas la gestion des versions du compartiment source tant que la réplication est configurée.

## Utilisation

### Configurer la réplication dans la Console

La Console RustFS regroupe l’enregistrement de la cible distante et la configuration des règles de réplication dans un seul formulaire.

1. Connectez-vous à la Console du déploiement source.
2. Ouvrez **Buckets** (compartiments), localisez le compartiment source et sélectionnez **Settings** (paramètres).
3. Sous **Data Protection** (protection des données), activez **Versioning** (gestion des versions) s’il est désactivé.
4. Sous **Automation** (automatisation), sélectionnez **Open Bucket Replication** (ouvrir la réplication de compartiment).
5. Sélectionnez **Add Replication Rule** (ajouter une règle de réplication).
6. Configurez la destination et la règle :

| Champ de la Console | Valeur |
| --- | --- |
| **Priority** (priorité) | Priorité d’évaluation de la règle. La valeur initiale est `1`. |
| **Mode** | Sélectionnez **Asynchronous** (asynchrone) ou **Synchronous** (synchrone). Le mode asynchrone est sélectionné par défaut. |
| **Endpoint** (point de terminaison) | Adresse de l’API S3 cible sous la forme `host:port`, sans schéma d’URL. |
| **Bucket** (compartiment) | Nom du compartiment de destination avec gestion des versions. |
| **Access Key** (clé d’accès) et **Secret Key** (clé secrète) | Identifiants dédiés autorisés à répliquer vers le compartiment de destination. |
| **Region** (région) | Région cible. La valeur initiale est `us-east-1`. |
| **Storage Class** (classe de stockage) | Classe de stockage appliquée à la destination. La valeur initiale est `STANDARD`. |
| **Prefix** (préfixe) | Préfixe de clé facultatif qui limite les objets correspondants. |
| **Tags** (étiquettes) | Filtres facultatifs sur le nom et la valeur d’une étiquette d’objet. Sélectionnez **Add Tag** (ajouter une étiquette) pour des filtres supplémentaires. |
| **Use TLS** (utiliser TLS) | Active HTTPS pour la connexion à la destination. |
| **Replicate Existing Objects** (répliquer les objets existants) | Inclut les objets créés avant la règle. Activé par défaut. |
| **Replicate Delete Markers** (répliquer les marqueurs de suppression) | Copie les marqueurs de suppression vers la destination. Activé par défaut. |
| **Replicate Delete** (répliquer la suppression) | Copie la suppression d’une version d’objet précise. Activé par défaut. |
| **Health Check Interval** (intervalle de contrôle d’intégrité) | Intervalle de contrôle d’intégrité de la cible, en secondes. La valeur initiale est `60`. |
| **Bandwidth Limit** (limite de bande passante) | Limite de transfert par cible, au choix en KiB/s, MiB/s ou GiB/s. |

7. Sélectionnez **Save** (enregistrer). RustFS valide le compartiment source, la connexion à la cible, les identifiants cibles et la gestion des versions du compartiment cible avant d’accepter la règle.
8. Revenez à **Bucket Replication** (réplication de compartiment) pour examiner la règle, ou sélectionnez **Refresh** (actualiser) afin de mettre à jour l’état affiché.

:::warning[Activez la gestion des versions sur les deux déploiements]

Le compartiment source et le compartiment de destination doivent tous deux avoir la gestion des versions activée avant l’enregistrement de la règle. Connectez-vous à la Console du déploiement cible et activez la gestion des versions sous **Buckets** → **Settings** → **Data Protection** si nécessaire.

:::

Pour une automatisation reproductible ou une gestion de la configuration, utilisez le flux `rc` ci-dessous.

### Ajouter une règle de réplication avec rc

Créez une règle asynchrone qui copie les objets nouveaux et existants, et qui propage les marqueurs de suppression ainsi que les suppressions explicites de version :

```bash
rc bucket replication add source/my-bucket \
	--remote-bucket target/my-bucket-replica \
	--id replicate-all \
	--priority 1 \
	--replicate delete,delete-marker,existing-objects
```

`rc` enregistre la cible, obtient l’ARN qu’elle a généré et applique la règle de réplication en une seule opération. Omettez les options `--replicate` correspondant aux comportements que vous ne souhaitez pas. N’ajoutez `--sync` que lorsque les écritures doivent attendre la réplication synchrone.

Pour limiter la réplication à un préfixe, ajoutez `--prefix` :

```bash
rc bucket replication add source/my-bucket \
	--remote-bucket target/my-bucket-replica \
	--id replicate-documents \
	--priority 2 \
	--prefix documents/ \
	--replicate delete-marker,existing-objects
```

Les objets qui ne correspondent à aucune règle activée restent uniquement dans le compartiment source. Utilisez `--bandwidth` pour fixer une limite en octets par seconde, `--healthcheck-seconds` pour modifier l’intervalle de contrôle d’intégrité de la cible, et `--storage-class` pour remplacer la classe de stockage de destination.

### Lister et mettre à jour les règles

Listez les règles actives :

```bash
rc bucket replication list source/my-bucket
rc bucket replication list source/my-bucket --json
```

Mettez à jour une règle à l’aide de son ID. Seuls les réglages fournis sont modifiés :

```bash
rc bucket replication update source/my-bucket \
	--id replicate-all \
	--priority 2 \
	--bandwidth 104857600 \
	--healthcheck-seconds 60
```

Utilisez `--status Enabled|Disabled` pour activer ou désactiver une règle, et `--sync true|false` pour changer son mode de réplication.

### Exporter et importer la configuration

Exportez la configuration de réplication complète à des fins d’examen ou de sauvegarde :

```bash
rc bucket replication export source/my-bucket --json > replication.json
```

L’export inclut les métadonnées de la cible distante et la clé d’accès cible, bien que la clé secrète soit omise. Protégez ce fichier comme une configuration sensible.

Importez une configuration exportée auparavant :

```bash
rc bucket replication import source/my-bucket replication.json
```

### Supprimer la configuration de réplication

```bash
rc bucket replication remove source/my-bucket --id replicate-all

# Remove every replication rule from the bucket.
rc bucket replication remove source/my-bucket --all
```

RustFS supprime également les cibles distantes de réplication référencées par la configuration supprimée. Il ne supprime pas les objets ni les versions déjà copiés dans le compartiment cible. Supprimez ou conservez ces objets selon les exigences de gestion du cycle de vie et de conservation du compartiment cible.

:::note[Réponse de suppression de rc 0.1.29]

Après que RustFS a supprimé la configuration de réplication et ses cibles, `rc 0.1.29` peut signaler `Remote target not found` lors d’une seconde tentative de nettoyage de la cible. Exécutez `rc bucket replication list source/my-bucket --json` ; un tableau `rules` vide confirme que la configuration a été supprimée.

:::

## Vérification

### Vérifier l’état de préparation de la cible

`rc bucket replication add` vérifie l’accès à la source, la connectivité de la cible, les identifiants cibles et la gestion des versions des compartiments avant de créer la règle. Confirmez la destination obtenue et les réglages de la règle :

```bash
rc bucket replication list source/my-bucket --json
```

### Répliquer un objet

Chargez un objet de test sur la source :

```bash
printf 'hello from RustFS replication\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt source/my-bucket/hello.txt
```

Inspectez l’objet source :

```bash
rc object stat source/my-bucket/hello.txt --json
```

La réplication étant asynchrone par défaut, l’objet cible peut ne pas apparaître immédiatement. Répétez cette commande jusqu’à ce qu’elle réussisse :

```bash
rc object stat target/my-bucket-replica/hello.txt --json
rc object show target/my-bucket-replica/hello.txt
```

Comparez les valeurs `etag` et `size_bytes` de la source et de la cible, puis confirmez que `object show` renvoie le contenu attendu.

Pour vérifier la réplication des marqueurs de suppression, supprimez l’objet source et listez les versions dans les deux compartiments :

```bash
rc object remove source/my-bucket/hello.txt --force

rc bucket version list source/my-bucket/hello.txt --json
rc bucket version list target/my-bucket-replica/hello.txt --json
```

Lorsque la réplication du marqueur de suppression réussit, la dernière entrée de chaque compartiment contient `is_delete_marker: true`.

### Inspecter les métriques de réplication

```bash
rc bucket replication status source/my-bucket
rc bucket replication status source/my-bucket --json
```

La commande renvoie les statistiques de réplication en mémoire actuelles du nœud source. Les métriques peuvent rester à zéro même après l’arrivée d’un objet à destination. Utilisez-les donc conjointement aux contrôles de l’objet cible et des versions, et non comme unique signal de vérification.

### Diagnostiquer les échecs

| Symptôme | Vérification |
| --- | --- |
| `bucket versioning must be enabled` | Activez la gestion des versions sur le compartiment source. |
| L’enregistrement de la cible indique `not versioned` | Activez la gestion des versions sur le compartiment cible. |
| `replication target configuration not found` | Vérifiez de nouveau l’alias cible, les identifiants et le compartiment de destination, puis relancez `replication add`. |
| La règle signale une cible obsolète | Actualisez la liste des règles et réessayez `replication add` ; s’il persiste, supprimez la configuration en échec et recréez la cible. |
| L’objet cible n’apparaît pas | Vérifiez la joignabilité de la cible, les identifiants, le quota cible et `rc bucket replication status`. |
| La réplication échoue | Examinez les journaux du nœud source pour y trouver l’ARN de cible et la clé d’objet. |
| La suppression de la cible n’est pas autorisée | Supprimez ou remplacez la configuration de réplication avant de supprimer une cible référencée. |

## Étapes suivantes

- [Gérer le cycle de vie du compartiment](../lifecycle-management.md)
- [Configurer les quotas de compartiment](./quota.md)
- [Configurer l’observabilité](/fr/operations/observability)
