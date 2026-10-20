---
title: "Opérations du cycle de vie du cluster"
description: "Planifiez, démarrez, étendez, rééquilibrez, mettez hors service, réparez les données et redémarrez les clusters RustFS à codage d’effacement, avec un quorum et un comportement de classe de stockage vérifiés."
---

Ce runbook est le point d’entrée des opérateurs pour les déploiements RustFS avec codage d’effacement : limites de disposition, classes de stockage et quorum, mode à parité nulle, extension, rééquilibrage, mise hors service, réparation des données, remplacement de disque et redémarrages. Chaque comportement décrit ici a été vérifié par rapport au code source de RustFS ; le runbook en amont de [rustfs/rustfs#7998](https://github.com/rustfs/rustfs/pull/7998) est le changement qui l’a introduit.

Pages de tâches associées : [Extension d’un pool de stockage](./scaling/storage-pool-expansion.md), [Rééquilibrage des données](./scaling/data-rebalancing.md), [Mise hors service d’un pool de stockage](./scaling/storage-pool-decommission.md) et [Réparation des données des nœuds](./high-availability/node-healing.md).

## Contraintes de disposition

Le nombre de points de terminaison d’un pool de stockage (pool), le nombre d’ensembles, le nombre de disques par ensemble et la position dans la liste des pools constituent une disposition persistée. Au démarrage, RustFS compare le format stocké au nombre de disques configuré et à la largeur d’ensemble, puis échoue de façon permanente avec `PoolTopologyMismatch` (ou `UnsupportedSnsdExpansion` pour un déploiement mono-disque) au lieu de migrer. Restaurez les points de terminaison d’origine et la largeur d’ensemble ; ne supprimez pas `format.json` pour passer outre l’erreur.

:::warning[Ne faites jamais ceci]

- N’écrasez pas un pool existant avec plus ou moins de points de terminaison, et ne modifiez pas `RUSTFS_ERASURE_SET_DRIVE_COUNT` pour un pool initialisé.
- Ne réordonnez pas les arguments de volume et ne déplacez pas un répertoire de disque vers un autre slot.
- Ne supprimez pas, ne copiez pas et ne renommez pas à la main les shards d’objet, `xl.meta`, ni quoi que ce soit sous `.rustfs.sys`.
- Ne considérez pas une copie manuelle de fichiers comme un déplacement de données. Seuls le rééquilibrage et la mise hors service déplacent les objets, sous verrous d’objet, avec revérification des versions et nettoyage de la source.

:::

Rôles à l’exécution :

- **Pool** — une liste de points de terminaison avec une disposition persistée. Les ensembles d’effacement multi-disques contiennent de 2 à 16 disques ; un chemin local unique est la seule disposition mono-disque.
- **Leader de pool** — le premier point de terminaison d’un pool. Le démarrage, l’annulation et l’effacement d’une mise hors service peuvent être envoyés à n’importe quel nœud ; les requêtes sont transmises au leader du pool par un RPC authentifié entre nœuds.
- **État à l’échelle du cluster** — le rééquilibrage et la réparation racine des données se propagent aux pairs et se rétablissent depuis les métadonnées persistées au redémarrage.

## Planification et premier démarrage

1. Planifiez les points de terminaison selon les domaines de défaillance de nœud, de baie, d’alimentation et de réseau. L’admission de la topologie n’est pas une garantie de haute disponibilité : un pool mono-nœud perd tous ses shards en même temps que son hôte, et le démarrage journalise un avertissement `host_failure_data_unavailable` pour chaque pool multi-disques.
2. Choisissez la largeur d’ensemble de chaque pool. Les pools peuvent avoir des largeurs différentes, mais chaque pool doit se répartir exactement en ensembles d’une seule largeur, de 2 à 16 disques ; `RUSTFS_ERASURE_SET_DRIVE_COUNT` peut figer une largeur qui est déjà un diviseur valide, et rien d’autre.
3. Choisissez la parité STANDARD et RRS selon les règles de [Classes de stockage, parité et quorum](#classes-de-stockage-parité-et-quorum), puis validez-les sur le pool le plus étroit, car une parité explicite doit tenir dans chaque pool.
4. Notez la commande de lancement complète, l’ordre des points de terminaison, l’ordre des pools, la largeur d’ensemble et les variables de classe de stockage. Elles doivent être identiques sur chaque nœud et à chaque redémarrage.
5. Donnez à RustFS la propriété exclusive de chaque chemin de point de terminaison.

Les volumes proviennent des arguments positionnels ou de `RUSTFS_VOLUMES` ; `rustfs` sans argument se comporte comme `rustfs server` avec les volumes issus de l’environnement. L’expansion des ellipses suit le modèle MinIO :

```bash
# one pool, four nodes, four drives each: sixteen endpoints
rustfs server http://node{1...4}:9000/data{1...4}

# two pools; every argument must carry an ellipsis once there is more than one
rustfs server http://node{1...4}:9000/data{1...4} http://node{5...8}:9000/data{1...4}
```

Avec plusieurs arguments, chaque argument doit contenir une ellipse ; chaque pool doit s’étendre en au moins deux points de terminaison de disque distincts ; un pool mono-disque ne peut pas rejoindre un déploiement multi-pool ; une plage singleton telle que `{3...3}` ne contourne pas le minimum.

Une erreur de classe de stockage interrompt le démarrage avant qu’aucun disque ne soit touché. Le démarrage initialise ensuite les disques locaux, les clients de verrouillage et le quorum de format, dans cet ordre.

## Configuration au démarrage

| Variable | Effet | Contraintes |
|---|---|---|
| `RUSTFS_ERASURE_SET_DRIVE_COUNT` | Fige la largeur d’ensemble | Doit être un diviseur symétrique valide du pool, au plus 16 ; ne peut pas modifier un pool déjà initialisé |
| `RUSTFS_STORAGE_CLASS_STANDARD` | Parité STANDARD sous la forme `EC:<n>` | Validée pour chaque pool ; n’affecte que les nouvelles écritures |
| `RUSTFS_STORAGE_CLASS_RRS` | Parité RRS sous la forme `EC:<n>` | Validée pour chaque pool ; une valeur explicite échoue sur un seul disque, et la valeur persistée par défaut `EC:1` y est résolue en `0` |
| `RUSTFS_STORAGE_CLASS_OPTIMIZE` | Acceptée pour la compatibilité avec MinIO | Stockée mais actuellement inutilisée : elle ne change rien à l’exécution |
| `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` | Limite inline fixe par shard (syntaxe de taille en octets telle que `128KiB`) | Remplace la valeur par défaut proportionnelle des [Objets inline](#objets-inline) ; les valeurs supérieures à 128 KiB produisent un avertissement dans le journal |

Une valeur vide de `RUSTFS_STORAGE_CLASS_STANDARD` ou de `RUSTFS_STORAGE_CLASS_RRS` rétablit la politique automatique et remplace une valeur persistée. Les graphies préfixées par `MINIO_` de ces clés, de `ERASURE_SET_DRIVE_COUNT` et de `VOLUMES` sont reportées sur les noms `RUSTFS_` lorsque le nom `RUSTFS_` n’est pas défini ; lorsque les deux sont définis, la valeur `RUSTFS_` l’emporte et le conflit est signalé au démarrage.

Autres réglages de déplacement de données et de listage : `RUSTFS_REBALANCE_MAX_ATTEMPTS` (par défaut 3), `RUSTFS_DECOMMISSION_BUCKET_CONCURRENCY` (plafond par défaut 4), `RUSTFS_DECOMMISSION_ENTRY_CONCURRENCY` (plafond par défaut 8, plafond strict 64) et `RUSTFS_LIST_OBJECTS_QUORUM` (par défaut `optimal` ; accepte `disk`, `reduced`, `optimal`, `auto`, toute autre valeur signifie `strict`). Aucun d’eux n’assouplit le quorum d’objet, les verrous d’objet ni les contrôles de version.

## Classes de stockage, parité et quorum

### Géométrie

Chaque objet est codé en Reed-Solomon sur les `N` disques d’un ensemble, en `K` shards de données et `M` shards de parité, `N = K + M` ; n’importe quels `K` shards le reconstruisent. La géométrie est stockée par objet dans `xl.meta`, si bien qu’un changement ultérieur de la valeur par défaut ne réécrit rien. Les objets sont répartis par hachage sur un ensemble et les shards tournent à l’intérieur de celui-ci ; les ensembles ne partagent jamais un budget de défaillance.

Parité STANDARD par défaut selon la largeur d’ensemble : 0 pour un disque, 1 pour 2 à 3, 2 pour 4 à 5, 3 pour 6 à 7, 4 pour 8 à 16. La parité RRS par défaut est 1 (0 sur un seul disque).

Règles de validation : chaque parité vaut au plus `N/2` pour chaque pool, et la parité STANDARD est au moins égale à la parité RRS seulement lorsque les deux sont non nulles. Il n’y a pas de minimum, donc `EC:0` est accepté pour toute largeur. Seuls `STANDARD` et `REDUCED_REDUNDANCY` sont acceptés sur PUT, CopyObject et CreateMultipartUpload ; les autres classes de stockage AWS renvoient `InvalidStorageClass`.

### Quorum et capacité

```text
usable capacity  ≈ raw × K / N
read quorum      = K            (metadata vote and shard decode)
write quorum     = K, or K + 1 when K == M
delete markers   = N/2 + 1      (majority, both write and vote)
```

Seize disques avec `EC:4` : `K = 12`, environ 75 pour cent de capacité utile, quatre défaillances tolérées, douze shards valides nécessaires pour lire. Deux disques avec `EC:1` : `K = M = 1`, donc un disque hors service permet encore la lecture, mais plus l’écriture. Les métadonnées internes sous `.rustfs.sys` sont toujours écrites avec la parité `N/2`, quelle que soit la classe configurée.

### Objets inline

Un objet est stocké inline dans `xl.meta` lorsque chaque shard est au plus égal au budget par shard. Le budget par défaut est `256 KiB / K`, plafonné à 128 KiB par shard, si bien qu’un ensemble plus large n’augmente pas la taille maximale d’un objet inline ; sur un compartiment (bucket) avec gestion des versions, le budget est divisé par 8. `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` remplace la valeur par défaut proportionnelle par une limite fixe par shard. Chaque disque ne conserve inline que son propre shard, si bien que les données inline ont la même sémantique de perte que les shards externes. Les flux compressés ou chiffrés ne sont mis inline que lorsque la taille stockée est connue et reste dans le budget.

### Chemins d’écriture et de lecture

Les écritures résolvent la disposition par pool, encodent en Reed-Solomon par blocs de 1 MiB, écrivent des shards protégés contre le bitrot et ne valident qu’après le quorum d’écriture. Une écriture sous le quorum n’est jamais signalée comme un succès. Les lectures sélectionnent les métadonnées faisant autorité au quorum de lecture, vérifient le bitrot, décodent à partir d’au moins `K` shards et échouent en mode fermé en deçà ; une lecture qui réussit avec des shards manquants met en file une réparation à la lecture. Les parties d’un chargement partitionné utilisent la géométrie de l’objet et le quorum d’écriture ; `CompleteMultipartUpload` revérifie les métadonnées et le quorum de validation, si bien qu’une partie chargée n’est pas un objet validé.

## Parité nulle (EC:0)

`EC:0` est accepté pour STANDARD, pour RRS, ou pour les deux, quelle que soit la largeur d’ensemble. Il offre la capacité brute et aucune redondance.

:::danger[Avec EC:0, la perte d’un disque fait perdre des données sur l’ensemble]

Un disque remplacé ou effacé perd définitivement chaque objet à parité nulle qui y avait un shard, sauf si une copie existe en dehors de l’ensemble. La réparation des données ne peut pas reconstruire les objets à parité nulle : la réparation signale `no-parity object is unrecoverable` pour ceux-ci. Les déploiements de production devraient utiliser `EC:1` ou plus ; `EC:2` ou davantage par ensemble est le plancher habituel dès qu’un ensemble s’étend sur plus d’un nœud. N’utilisez `EC:0` que là où une couche externe (RAID, réplication, sauvegarde ou source recréable) assure la durabilité et la disponibilité, et seulement avec une validation explicite.

:::

Détail du comportement :

- **Configuration.** Un `EC:0` explicite ne produit aucun avertissement au démarrage — l’avertissement d’absence de redondance ne se déclenche que pour une parité nulle automatique, c’est-à-dire un pool mono-disque. `STANDARD=EC:2` avec `RRS=EC:0` est valide, car la règle d’ordre est ignorée lorsque l’un des deux côtés est nul ; seuls les objets écrits avec `x-amz-storage-class: REDUCED_REDUNDANCY` portent alors la sémantique de parité nulle.
- **Écritures.** Le quorum d’écriture est `N` : si un disque quelconque de l’ensemble n’est pas accessible en écriture, l’écriture échoue avec `ErasureWriteQuorum` et rien n’est validé. Comme un shard à parité nulle ne peut pas être reconstruit plus tard, le chemin d’écriture vérifie chaque shard qu’il vient d’écrire par rapport à son empreinte de bitrot avant la validation, et refuse de valider un shard qui échoue déjà.
- **Lectures.** Le quorum de lecture est `N`. Si un disque quelconque de l’ensemble est hors ligne, les HEAD et GET de chaque objet à parité nulle de cet ensemble échouent avec `ErasureReadQuorum`. Il n’existe pas de lecture dégradée.
- **Suppressions.** Les marqueurs de suppression et les suppressions de versions utilisent le quorum majoritaire (`N/2 + 1`), si bien qu’une suppression peut réussir sur un ensemble dont les lectures et les écritures échouent. Une suppression réussie ne prouve pas que l’ensemble est sain.
- **Ce qui fonctionne encore avec un disque hors service.** Les opérations sur les compartiments, les métadonnées `.rustfs.sys`, les marqueurs de suppression et les listages qui satisfont le quorum de listage. Tout le reste dans l’ensemble est indisponible, y compris le rééquilibrage et la mise hors service de ses objets, qui doivent lire l’ensemble des `N` shards.
- **Augmenter la parité plus tard ne réécrit rien.** Rechargez chaque objet, ou copiez-le côté serveur, après le changement afin de le protéger à nouveau.

## Vérification après démarrage

Contrôles d’administration en lecture seule :

```text
GET /rustfs/admin/v3/pools/list
GET /rustfs/admin/v3/pools/status?pool=<pool>[&by-id=true]
GET /rustfs/admin/v3/decommission/status[?pool=<pool>&by-id=true]
GET /rustfs/admin/v4/cluster/snapshot
GET /rustfs/admin/v4/runtime/capabilities
```

`pool` est une ligne de commande de pool, ou un index commençant à zéro avec `by-id=true`. Les requêtes d’état ignorent les paramètres inconnus ; les requêtes de mutation rejettent les paramètres inconnus ou en double, ainsi qu’une valeur de `by-id` autre que `true` ou `false`.

Vérifiez : le nombre de pools, les points de terminaison par pool, le nombre et la largeur d’ensembles par pool, les points de terminaison locaux et distants, et l’absence d’écart de topologie.

Contrôles du plan de données : écrivez un objet STANDARD et un objet RRS ; GET, HEAD, GET par plage, CopyObject et un chargement partitionné ; mettez un disque ou un nœud hors ligne dans la limite de la parité et vérifiez que les lectures continuent et que les écritures se comportent selon le tableau de quorum ; ramenez-le en ligne et vérifiez que la file de réparation des données se vide et que les erreurs de bitrot cessent ; vérifiez que chaque nœud signale les mêmes métadonnées de pool et le même instantané de cluster.

## Extension

Un pool existant ne peut pas grandir sur place. Ajoutez un pool :

1. Planifiez ses nœuds, ses disques et son domaine de défaillance ; chaque nouveau pool a besoin d’au moins deux points de terminaison de disque et de sa propre disposition d’ensembles valide.
2. Préparez, sur chaque nœud, des chemins vides dont RustFS est l’unique propriétaire.
3. Ajoutez le pool aux arguments de lancement sur **chaque** nœud, en conservant les pools existants, leur ordre, leurs points de terminaison et leur largeur d’ensemble inchangés. Un déploiement mono-nœud et mono-disque ne peut pas être étendu ; migrez par S3.
4. Redémarrez et vérifiez selon les contrôles ci-dessus.
5. Les nouvelles écritures sont placées sur les pools disponibles ; les objets existants restent là où ils sont. Pour les déplacer, lancez un rééquilibrage. Un redémarrage ne rééquilibre jamais.

L’ajout d’un pool n’ajoute pas de parité aux objets existants et ne copie rien. Le déplacement entre pools ne passe que par le rééquilibrage ou la mise hors service. Voir [Extension d’un pool de stockage](./scaling/storage-pool-expansion.md) pour un exemple concret.

## Rééquilibrage

Le rééquilibrage redistribue les objets entre les pools selon l’utilisation. Conditions préalables : plus d’un pool (un pool unique renvoie `NotImplemented`), aucune mise hors service en cours ou en conflit, et aucune chaîne de requête sur `start` ou `stop`.

```text
POST /rustfs/admin/v3/rebalance/start     → {"id": "<uuid>"}
GET  /rustfs/admin/v3/rebalance/status
POST /rustfs/admin/v3/rebalance/stop
```

L’état indique, pour chaque pool, `id`, `status`, `stopping`, `used`, `lastError`, `cleanupWarnings` et `progress` (objets, versions, octets, compartiments restants, compartiment et objet courants, temps écoulé, ETA), ainsi que `stoppedAt` et les champs de propagation de l’arrêt.

Le démarrage propage une barrière d’admission et l’état des workers vers les pairs ; un échec de propagation revient à un état terminal et signale tout pair qui n’est pas revenu en arrière. L’arrêt ferme l’admission, arrête les workers locaux et distants et persiste l’état arrêté. Ne considérez un rééquilibrage comme terminé que lorsqu’aucun pool n’est actif ou en cours d’arrêt, que `lastError` est vide ou expliqué, que les `cleanupWarnings` sont comprises, que la propagation de l’arrêt est terminée et que les objets migrés se lisent depuis leur nouveau pool. L’état par pool réside dans `rebalance.bin` ; ne le supprimez jamais pour débloquer une exécution. Voir [Rééquilibrage des données](./scaling/data-rebalancing.md) pour la procédure pas à pas.

## Mise hors service

Résumé pour l’opérateur — prise en charge seulement sur les déploiements multi-pool non historiques (avec ellipse) ; tout autre cas renvoie `NotImplemented`. Un rééquilibrage en cours bloque le démarrage.

```text
POST /rustfs/admin/v3/pools/decommission?pool=<a>[,<b>]      # by command line
POST /rustfs/admin/v3/pools/decommission?pool=1&by-id=true   # by index
GET  /rustfs/admin/v3/decommission/status[?pool=1&by-id=true]
POST /rustfs/admin/v3/pools/cancel?pool=1&by-id=true
POST /rustfs/admin/v3/pools/clear?pool=1&by-id=true
```

- Les cibles sont validées en lot avant toute persistance : les cibles inconnues, en double, actives, en file d’attente ou terminées sont rejetées ; les cibles en échec ou annulées doivent d’abord être effacées, sauf si elles contiennent des entrées de listage non résolues, auquel cas un nouveau démarrage est le chemin de nouvelle tentative.
- États d’entrée : `queued` → `active` → `completed`, `failed` ou `canceled`, persistés dans `pool.bin`. Le démarrage reprend les entrées non terminales et ignore les prédécesseurs terminaux.
- Un pool source dans n’importe quel état de mise hors service rejette les nouveaux PUT ordinaires et les nouveaux chargements partitionnés (un PUT préparé reçoit `SlowDown`) ; les chargements partitionnés existants peuvent se vider tant que la source n’est pas terminale.
- `clear` ne retire que les métadonnées en échec ou annulées et ne rapatrie jamais les données.
- Ne retirez un pool des arguments de lancement qu’une fois son entrée à l’état `completed`, une fois que les versions libres et la propriété de niveau ont convergé, et une fois que chaque nœud affiche le même état. Ne détachez jamais les disques sources avant cela, et ne substituez jamais la suppression d’un répertoire au changement de configuration.

Voir [Mise hors service d’un pool de stockage](./scaling/storage-pool-decommission.md) pour la procédure pas à pas.

## Réparation des données et remplacement de disque

### Réparation administrative des données

```text
POST /rustfs/admin/v3/heal/                    # root: cluster, or one erasure set with pool+set
POST /rustfs/admin/v3/heal/<bucket>
POST /rustfs/admin/v3/heal/<bucket>/<prefix>
POST /rustfs/admin/v3/background-heal/status
GET  /rustfs/admin/v4/heal/replacement-recovery
```

Le corps JSON porte `recursive`, `dryRun`, `remove`, `recreate`, `scanMode`, `updateParity`, `nolock`, `readRepair`, `pool` et `set`. Règles du gestionnaire :

- une réparation racine des données doit définir `recursive=true` ou nommer à la fois `pool` et `set` ; une réparation de compartiment sans préfixe est toujours récursive, et une réparation de préfixe respecte `recursive` ;
- `readRepair=true` est rejeté avec `InvalidArgument` ;
- `nolock` est accepté tel qu’il est transmis, mais toujours forcé à `false` — les réparations administratives des données prennent toujours le verrou d’espace de noms d’objet, il n’existe donc pas de contournement du verrou ;
- `clientToken` corrèle le démarrage, l’état et l’arrêt ; `forceStart` et `forceStop` sont validés par rapport à lui, et les clés de requête inconnues ou en double sont rejetées.

La réparation des données sélectionne la version faisant autorité à partir des métadonnées de quorum et refuse lorsque plus de shards manquent que la parité ne peut en reconstruire, ou lorsque la géométrie stockée ne correspond pas à l’ensemble. Elle partage le verrou `(bucket, object)` avec PUT, la suppression, la finalisation du chargement partitionné et le déplacement de données.

### Remplacement de disque

1. Vérifiez que l’ensemble concerné satisfait encore le quorum de lecture pour ses objets (impossible avec `EC:0`) et notez l’index de pool, l’index d’ensemble, le slot et l’UUID du disque en panne à partir de l’état du pool.
2. Remplacez le disque au **même** point de terminaison et au même chemin de montage par un système de fichiers vide dont RustFS est propriétaire. Ne copiez pas les répertoires de l’ancien disque ; un `format.json` copié revendique une identité que l’ensemble suit déjà.
3. Ramenez le nœud en ligne. Le disque vide n’est pas membre du quorum de format, si bien que son slot reste hors ligne jusqu’à ce que la tâche de réparation des données de l’ensemble d’effacement écrive le format dans le slot d’origine et reconstruise les shards — par l’intention de remplacement automatique enregistrée lorsque le démarrage ou l’analyseur de disques observe une identité de montage modifiée, ou par une réparation administrative de l’ensemble d’effacement (`POST /rustfs/admin/v3/heal/` avec `pool` et `set`).
4. Surveillez `GET /rustfs/admin/v4/heal/replacement-recovery`, l’état de la réparation des données en arrière-plan, l’intégrité des disques et les compteurs de bitrot. Une file `idle` ou un objet lisible ne prouve pas que l’opération est terminée.
5. Le remplacement est terminé lorsque la reprise signale `completed` pour cette instance et que les objets échantillonnés ont `xl.meta` et leurs parties sur le nouveau disque.

Si un ensemble a perdu plus de disques que sa parité, la réparation des données ne peut pas reconstruire ; récupérez les données depuis la réplication, un niveau distant ou une sauvegarde. Voir [Réparation des données des nœuds](./high-availability/node-healing.md) pour le modèle plus large de réparation des données.

## Redémarrage et reprise

- **Redémarrage ordinaire.** Aucun changement de topologie en cours, arguments identiques sur chaque nœud, un nœud à la fois. Le démarrage recharge les métadonnées de pool, `rebalance.bin`, la file de mise hors service et les enregistrements de reprise de réparation des données, puis reprend les workers selon les règles de leader et de propriétaire.
- **Rééquilibrage.** Lisez d’abord `/rebalance/status`. Traitez les pools actifs ou en cours d’arrêt, `lastError`, les avertissements de nettoyage et la propagation de l’arrêt avant de décider d’arrêter ou de redémarrer. Ne supprimez pas `rebalance.bin`.
- **Mise hors service.** Les entrées non terminales reprennent ; les entrées en échec et annulées survivent aux redémarrages jusqu’à ce qu’elles soient effacées ou retentées par le chemin autorisé.
- **Réparation racine des données.** Un arrêt propre persiste une réparation de cluster inachevée sous le nom `root-heal-<task-id>.json` dans `.rustfs.sys` et la rejoue avec le même identifiant de tâche. Les enregistrements invalides, trop volumineux ou non pris en charge sont déplacés vers des préfixes de quarantaine et ignorés, avec une ligne de journal, jusqu’à ce qu’un opérateur les répare. Ne supprimez pas les marqueurs de quarantaine et ne réutilisez pas un identifiant de tâche.
- **Arrêt non propre.** Lorsque l’exécution précédente a laissé son marqueur, le gestionnaire de réparation des données met en file une réparation complète de chaque ensemble d’effacement local ; un arrêt propre efface le marqueur.

## Exclusion mutuelle et actions interdites

| Opération | Avec un rééquilibrage | Avec une mise hors service | Notes |
|---|---|---|---|
| PUT, DELETE, finalisation de chargement partitionné | Verrou d’objet | Le pool source refuse les nouvelles publications | Ne contournez jamais la barrière du pool |
| Mise hors service | Rejetée pendant qu’un rééquilibrage s’exécute | File sérielle | Mutation réservée au leader |
| Rééquilibrage | Multi-pool seulement | Rejeté pendant qu’une mise hors service s’exécute ou entre en conflit | Aucun paramètre de requête |
| Réparation administrative des données | Verrou d’objet | Répare les données, ne change jamais l’état de mise hors service | `nolock` est ignoré |
| Remplacement de disque | Ne peut pas modifier la disposition | À éviter sur un pool source en cours de mise hors service | Même slot, disque vide |

:::warning[Interdit]

Ne modifiez pas les points de terminaison de lancement pendant qu’un rééquilibrage ou une mise hors service s’exécute ; ne supprimez pas `.rustfs.sys`, `rebalance.bin`, `pool.bin` ni les enregistrements de réparation racine des données ; n’exécutez pas en même temps, sur un même pool, une réparation manuelle des données, des copies de fichiers et un remplacement de disque ; ne considérez pas un HTTP 200 sur un appel de démarrage comme une fin d’opération.

:::

## Listes de contrôle

- **Après le démarrage ou l’extension** : points de terminaison et ordre des pools identiques sur chaque nœud ; topologie égale au format stocké ; pairs prêts ; nouveaux points de terminaison uniques et exclusifs à RustFS ; GET, HEAD, GET par plage et chargement partitionné vérifiés.
- **Après un rééquilibrage** : aucun pool actif ou en cours d’arrêt ; `lastError` vide ou expliqué ; `cleanupWarnings` traités ; propagation de l’arrêt terminée ; objets migrés lisibles.
- **Après une mise hors service** : état `completed` ; autres entrées traitées selon la politique ; le pool source refuse les nouvelles écritures ; les versions libres, la propriété de niveau et les entrées de listage ont convergé ; arguments de lancement mis à jour sur chaque nœud avant le détachement des disques.
- **Après une réparation des données ou un remplacement** : reprise de remplacement `completed` ; slot et UUID corrects ; file de réparation des données vidée ; pas de compteur de bitrot en croissance ; versions courantes et historiques échantillonnées lisibles ; aucun répertoire temporaire résiduel.

## Correspondance des commandes rc

`rc` est la CLI RustFS (voir [Client CLI (rc)](./rc.mdx)) ; son groupe `expand` est un alias de `rebalance` — il n’existe pas d’API d’extension côté serveur. Les indicateurs ci-dessous sont d’usage courant ; consultez `rc admin <group> --help` pour la version installée.

```bash
rc alias set local http://localhost:9000 <your-access-key> <your-secret-key>
rc ping local
rc ready local --timeout 2
rc admin info cluster local
rc admin info disk local --offline
rc admin pool list local
rc admin pool status local 0 --by-id
rc admin rebalance start local
rc admin rebalance status local
rc admin rebalance stop local
rc admin decommission start local '/data/pool1/disk{1...4}'
rc admin decommission status local 1 --by-id
rc admin decommission cancel local 1 --by-id
rc admin decommission clear local 1 --by-id
rc admin heal start local --scan-mode deep
rc admin heal start local --bucket logs --prefix 2026/ --scan-mode deep
rc admin heal status local --client-token <TOKEN_FROM_START>
rc admin heal stop local --client-token <TOKEN_FROM_START>
```

| Commande `rc` | Route du serveur |
|---|---|
| `rc ping` / `rc ready` | `GET /health` / `GET /health/ready` |
| `rc admin pool list` / `status` | `GET /rustfs/admin/v3/pools/list` / `GET /rustfs/admin/v3/pools/status` |
| `rc admin rebalance …` (alias `expand`) | `/rustfs/admin/v3/rebalance/*` |
| `rc admin decommission start` / `cancel` / `clear` | `POST /rustfs/admin/v3/pools/decommission` / `cancel` / `clear` |
| `rc admin decommission status` | `GET /rustfs/admin/v3/decommission/status` |
| `rc admin heal start` / `status` / `stop` | `/rustfs/admin/v3/heal/*`, `POST /rustfs/admin/v3/background-heal/status` |

`rc admin heal start` expose `--bucket`, `--prefix`, `--scan-mode`, `--remove`, `--recreate` et `--dry-run` ; il n’expose pas `nolock`, `forceStart`, `forceStop`, `pool` ni `set`. Il n’existe pas de commande `rc` pour la reprise après remplacement ; appelez directement `GET /rustfs/admin/v4/heal/replacement-recovery`.

## Références

- Runbook en amont : `docs/operations/cluster-lifecycle-operations.md` dans [rustfs/rustfs#7998](https://github.com/rustfs/rustfs/pull/7998) — source dont cette page est adaptée, vérifiée affirmation par affirmation par rapport au code source de RustFS.
- [Extension d’un pool de stockage](./scaling/storage-pool-expansion.md) · [Rééquilibrage des données](./scaling/data-rebalancing.md) · [Mise hors service d’un pool de stockage](./scaling/storage-pool-decommission.md) · [Réparation des données des nœuds](./high-availability/node-healing.md) · [Client CLI (rc)](./rc.mdx)
