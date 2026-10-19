---
title: "Réparation des données des nœuds"
description: "Récupérez les nœuds et les disques RustFS en panne, surveillez la réparation automatique des données et exécutez avec rc des tâches manuelles de réparation bornées."
---

La réparation des données RustFS reconstitue les données à codage d’effacement manquantes ou incohérentes à partir des shards sains qui restent dans un ensemble de stockage. Utilisez ce flux après avoir restauré un nœud indisponible, remplacé un disque en panne ou examiné des alertes du scanner et de la réparation des données.

La réparation des données est une opération de stockage du cluster. Elle diffère de la [réplication de site](/fr/operations/high-availability/site-replication), qui copie les données et la configuration d’identité entre des déploiements RustFS indépendants.

:::warning[La réparation des données n’est pas une sauvegarde]

RustFS ne peut reconstituer des données que tant qu’il reste assez de shards sains dans l’ensemble d’effacement concerné. La réparation des données ne peut pas récupérer un objet lorsque les défaillances dépassent la redondance disponible de l’ensemble, et elle ne protège ni contre une suppression intentionnelle ni contre une corruption au niveau de l’application. Conservez des sauvegardes ou une réplication indépendantes, selon vos exigences de reprise.

:::

## Fonctionnement de la réparation des données

RustFS coordonne plusieurs sources de réparation des données par la file de réparation du cluster :

- `autoHeal` : le scanner automatique de disques détecte les disques non formatés ou revenus après une interruption et met en file la réparation des données de l’ensemble d’effacement.
- `scanner` : le scanner de données en arrière-plan peut mettre en file la réparation des données d’un objet ou d’un compartiment (bucket) lorsqu’il trouve un état de stockage incohérent.
- `readRepair` : les chemins de réparation à la lecture peuvent soumettre du travail découvert pendant le service des requêtes.
- `internal` : les chemins de reprise internes peuvent soumettre du travail initié par le système.
- `admin` : les administrateurs peuvent soumettre une réparation des données récursive, de compartiment ou de préfixe avec `rc admin heal start`.

La réparation automatique des disques s’exécute à faible priorité. L’objet d’état `healOperations` utilise ces noms de source pour séparer le travail en file, actif et en nouvel essai.

:::note[La reconstitution consomme des ressources du cluster]

La réparation des données lit les shards sains et écrit les données reconstituées. Les analyses approfondies ajoutent des lectures et des calculs d’empreinte. Surveillez la latence des clients, l’utilisation des disques, la capacité disponible et la file de réparation des données pendant que la reprise est active.

:::

## Conditions requises

Avant de récupérer un nœud ou un disque, préparez :

- Un déploiement RustFS qui dispose encore d’assez de shards sains pour reconstituer les données concernées.
- Des adresses de nœud stables et les chemins de montage de stockage configurés à l’origine.
- Un stockage de remplacement dont la capacité convient à l’ensemble d’effacement concerné.
- Le client RustFS [`rc`](/fr/operations/rc) sur un hôte d’administration sécurisé.
- Des identifiants d’administration qui autorisent les opérations d’information de cluster, de scanner et de réparation des données.
- Une fenêtre de maintenance lorsque vous remplacez du matériel ou exécutez une analyse récursive approfondie.

Notez le nœud en panne, le pool, l’ensemble, le point de terminaison du disque, le chemin de montage et l’UUID du système de fichiers avant de modifier le matériel. Ne retirez pas d’autres disques du même ensemble d’effacement tant que la reprise n’est pas terminée.

## 1. Identifier le composant en panne

Configurez un alias `rc` si vous n’en avez pas déjà un :

```bash
rc alias set rustfs https://rustfs.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

Vérifiez l’état de préparation du cluster, la topologie, l’intégrité du stockage et l’activité de réparation des données :

```bash
rc ready rustfs
rc admin info cluster rustfs
rc admin info storage rustfs
rc admin scanner status rustfs
rc admin heal status rustfs
```

L’état de préparation peut échouer alors que le cluster est dégradé. Utilisez les commandes d’information d’administration pour identifier le nœud ou le disque indisponible et notez son pool ainsi que l’emplacement de son ensemble d’effacement.

Pour une sortie lisible par une machine, demandez le JSON :

```bash
rc --json admin info storage rustfs
rc --json admin heal status rustfs
```

L’état agrégé de réparation des données indique l’état d’exécution, les tâches en file et actives, le travail en nouvel essai, les sources de requête, les priorités et les compteurs de progression disponibles. Une file de longueur nulle ne prouve pas qu’un disque hors ligne a été remplacé ni que chaque objet est récupérable ; corrélez-la avec la topologie de stockage et l’état de préparation.

## 2. Restaurer le nœud ou le disque

Corrigez la défaillance sous-jacente avant de lancer une réparation manuelle des données.

Pour une interruption de nœud :

1. Restaurez l’identité réseau configurée du nœud et sa connectivité vers chaque autre nœud RustFS sur le port de l’API S3, normalement `9000`.
2. Montez les disques de données d’origine à leurs chemins configurés.
3. Vérifiez que le processus RustFS utilise la même configuration de points de terminaison de stockage que le reste du cluster.
4. Démarrez RustFS et vérifiez que le nœud rejoint le cluster.

Pour un disque en panne :

1. Arrêtez le processus RustFS sur le nœud concerné avant de retirer ou de remonter le stockage.
2. Remplacez le périphérique en panne et préparez son système de fichiers selon [Préparation des disques](/fr/installation/requirement/disk-preparation).
3. Montez le remplacement au chemin exact utilisé par le disque en panne et mettez à jour `/etc/fstab` avec l’UUID de son système de fichiers.
4. Vérifiez le montage, le type de système de fichiers, le propriétaire et la capacité disponible avant de démarrer RustFS.
5. Démarrez RustFS et vérifiez que le disque apparaît dans le pool et l’ensemble d’effacement attendus.

```bash
findmnt /data/rustfs0
df -hT /data/rustfs0
rc admin info storage rustfs
```

:::warning[Ne réutilisez pas à l’aveugle un stockage obsolète]

Confirmez l’identité et le contenu de chaque périphérique avant de le monter sur un chemin de données RustFS. Ne copiez pas les métadonnées internes d’un disque à l’autre, ne regroupez pas plusieurs points de terminaison configurés sur un seul système de fichiers de remplacement, et ne montez pas un remplacement sur un chemin qui contient encore des données requises.

:::

## 3. Surveiller la réparation automatique des données

Une fois le nœud ou le disque de remplacement en ligne, RustFS peut détecter le candidat à la reprise et mettre en file la réparation des données de l’ensemble d’effacement. Vérifiez à la fois l’état du stockage et l’activité agrégée de réparation des données :

```bash
rc admin info storage rustfs
rc admin heal status rustfs
rc admin scanner status rustfs
```

Dans la sortie JSON, surveillez ces groupes :

| Champ | Signification |
| --- | --- |
| `state` | État d’exécution de la réparation des données, par exemple `active` ou `idle`. |
| `healQueueLength` | Travail total en attente dans la file de réparation des données. |
| `healActiveTasks` | Nombre total de tâches de réparation des données en cours d’exécution. |
| `healOperations` | Comptes de file, d’activité et de nouvel essai, regroupés par source (`scanner`, `admin`, `autoHeal`, `internal` et `readRepair`) et par priorité. |
| `progress` | Totaux disponibles pour les objets analysés, réparés, en échec et les octets traités. |
| `clusterStatusComplete` | Indique si la réponse inclut chaque nœud attendu. |

Ne considérez pas `idle` à lui seul comme une reprise réussie. Vérifiez que le disque de remplacement est en ligne, qu’il ne reste aucun échec de réparation des données, que le cluster est à l’état de préparation et que des objets représentatifs sont lisibles.

## 4. Exécuter une réparation manuelle ciblée des données

Utilisez une tâche manuelle lorsque la reprise automatique ne couvre pas le chemin requis, ou lorsque vous avez besoin d’une analyse explicite après un incident. Commencez par le compartiment ou le préfixe le plus étroit qui contient les données concernées.

Prévisualisez une réparation de compartiment sans appliquer de modifications :

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--scan-mode normal \
	--dry-run
```

Exécutez la réparation ciblée après avoir examiné la prévisualisation :

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--scan-mode normal
```

Limitez la tâche à un préfixe d’objet lorsque le périmètre concerné est connu :

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--scan-mode deep
```

`normal` est le mode d’analyse par défaut. Utilisez `deep` lorsque vous avez besoin d’une vérification plus approfondie des données et que vous avez prévu les E/S disque supplémentaires. N’omettez `--bucket` que lorsqu’une analyse récursive de tous les compartiments est nécessaire.

:::warning[Examinez séparément les options de mutation]

L’option `--remove` retire les objets ou parties orphelins, et `--recreate` demande la recréation des données manquantes. N’ajoutez aucune de ces options à une commande d’incident tant que vous n’avez pas inspecté l’état du stockage concerné, testé avec `--dry-run` et confirmé le résultat attendu.

:::

## 5. Suivre la tâche manuelle

Chaque réparation manuelle des données renvoie un `clientToken`. Conservez-le avec le dossier d’incident, car les opérations d’état et d’arrêt de cette tâche exigent le jeton.

Pour une tâche de compartiment ou de préfixe, transmettez la cible d’origine et le jeton :

```bash
rc admin heal status rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--client-token <client-token>
```

Pour une tâche récursive démarrée sans `--bucket`, utilisez le jeton seul :

```bash
rc admin heal status rustfs --client-token <client-token>
```

La commande sans jeton reste le résumé d’arrière-plan à l’échelle du cluster :

```bash
rc admin heal status rustfs
```

L’état de la tâche peut inclure les totaux d’éléments analysés, réparés et en échec, les octets traités, l’élément courant, le mode d’analyse, l’heure de début et la dernière mise à jour. Examinez les éléments en échec plutôt que de vous fier seulement à l’état agrégé de la tâche.

## 6. Valider la reprise

Une fois la file de réparation des données vidée, vérifiez le cluster et le chemin de données récupéré :

```bash
rc ready rustfs
rc admin info cluster rustfs
rc admin info storage rustfs
rc admin heal status rustfs
```

Lisez des objets représentatifs dans les compartiments et versions concernés. Pour un objet de test connu :

```bash
rc object stat rustfs/my-bucket/hello.txt
rc object copy rustfs/my-bucket/hello.txt ./hello-recovered.txt
```

Comparez l’objet téléchargé à une empreinte indépendante ou à une source de confiance lorsqu’il en existe une. Une lecture d’objet réussie valide cette requête, et non chaque objet ni chaque shard du cluster.

Continuez à surveiller l’intégrité du stockage et les échecs de réparation des données une fois que le cluster a atteint l’état de préparation. Conservez la chronologie de l’incident, les informations sur le périphérique en panne, le jeton de tâche et la sortie d’état finale pour la revue.

## 7. Arrêter une réparation manuelle des données

N’arrêtez que la tâche que vous avez identifiée. Pour une tâche de compartiment ou de préfixe, incluez la cible d’origine et le jeton :

```bash
rc admin heal stop rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--client-token <client-token>
```

Arrêtez une tâche récursive limitée à un jeton avec :

```bash
rc admin heal stop rustfs --client-token <client-token>
```

La commande d’arrêt sans jeton vise l’opération globale de réparation des données en arrière-plan :

```bash
rc admin heal stop rustfs
```

N’utilisez l’arrêt global que lorsque la poursuite du travail en arrière-plan crée un risque opérationnel plus important. Arrêter la réparation des données laisse la reprise incomplète ; notez la raison et confirmez comment la réparation des données reprendra avant de clore l’incident.

## Dépannage

### Le disque de remplacement ne fait pas l’objet d’une réparation des données

Vérifiez que le remplacement est monté au point de terminaison configuré et qu’il apparaît dans `rc admin info storage`. Consultez les journaux RustFS pour les échecs d’identification de disque, de formatage, de permission ou d’admission dans la file. Vérifiez aussi que les services de réparation des données sont initialisés avec `rc admin heal status`.

### L’état de réparation des données est partiel

Si `clusterStatusComplete` vaut false, un ou plusieurs nœuds attendus n’ont pas contribué à la réponse agrégée. Restaurez la connectivité de nœud à nœud et vérifiez l’intégrité du stockage et du processus de chaque nœud avant de faire confiance aux totaux du cluster.

### La file reste active

Comparez le travail en file, actif et en nouvel essai par source. Un compte `autoHeal` qui augmente indique une reprise de disque ou d’ensemble d’effacement ; le travail du scanner indique une découverte en arrière-plan ; le travail admin appartient aux tâches soumises manuellement. Vérifiez la latence des disques, la capacité libre, la connectivité des nœuds et les échecs répétés d’éléments avant de lancer une autre tâche.

### Les objets ne peuvent pas être reconstitués

Arrêtez toute maintenance supplémentaire sur l’ensemble d’effacement concerné. Préservez les disques restants et les journaux, puis déterminez si assez de shards sains subsistent. Des analyses approfondies répétées ne peuvent pas reconstituer des données lorsque la redondance disponible a déjà été dépassée.

### Une tâche manuelle ne peut pas être interrogée

Utilisez le `clientToken` renvoyé par `heal start`. Les tâches de compartiment et de préfixe doivent être interrogées avec les mêmes cibles `--bucket` et `--prefix` que celles utilisées au démarrage ; une tâche racine récursive utilise le jeton sans compartiment.

## Étapes suivantes

- Consultez [Contrôle d’état](/fr/operations/status-check) pour les contrôles d’état de préparation, de cluster et de capacité.
- Configurez l’[Observabilité](/fr/operations/observability) pour alerter sur l’intégrité des disques et un travail de reprise prolongé.
- Consultez la [Réplication de site](/fr/operations/high-availability/site-replication) lorsque la reprise exige un déploiement RustFS indépendant.
