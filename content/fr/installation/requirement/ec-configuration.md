---
title: "Configuration du codage d’effacement"
description: "Planifiez et configurez la taille des ensembles d’effacement et la parité de RustFS avant de déployer des pools de stockage."
---

RustFS utilise le codage d’effacement (EC) de Reed-Solomon pour répartir chaque objet sur les disques d’un ensemble d’effacement. Utilisez cette page pour estimer la capacité utile, comprendre les valeurs par défaut automatiques et décider si votre déploiement exige un réglage de parité explicite.

## Comprendre la disposition

Chaque pool de stockage est divisé en un ou plusieurs ensembles d’effacement. Pour un ensemble comportant `N` disques et `M` shards de parité :

- shards de données : `N - M`
- shards de parité : `M`
- nombre maximal de shards indisponibles pouvant être reconstruits : `M`
- efficacité de capacité approximative : `(N - M) / N`

Par exemple, un ensemble de 16 disques avec `EC:4` stocke 12 shards de données et 4 shards de parité. Son efficacité de capacité approximative est de 75 % avant la surcharge du système de fichiers, des métadonnées et de l’exploitation.

:::note[Domaines de défaillance]

La parité décrit les shards indisponibles au sein d’un seul ensemble d’effacement. La tolérance aux pannes au niveau du nœud dépend de la façon dont les disques de l’ensemble sont répartis entre les nœuds. Ne supposez pas que `EC:4` tolère toujours quatre pannes complètes de nœuds ; un nœud peut héberger plusieurs disques du même ensemble.

:::

## Parité automatique

Nous recommandons de ne pas définir `RUSTFS_STORAGE_CLASS_STANDARD`, sauf si vous avez une exigence de durabilité ou de capacité précise et validée. RustFS déduit la parité STANDARD de chaque pool indépendamment, à partir de son nombre de disques par ensemble d’effacement :

| Disques par ensemble d’effacement (`N`) | Parité STANDARD automatique | Shards de données | Efficacité approximative |
| --- | --- | --- | --- |
| 1 | `EC:0` | 1 | 100% |
| 2–3 | `EC:1` | `N - 1` | 50%–67% |
| 4–5 | `EC:2` | `N - 2` | 50%–60% |
| 6–7 | `EC:3` | `N - 3` | 50%–57% |
| 8–16 | `EC:4` | `N - 4` | 50%–75% |

Les ensembles d’effacement à plusieurs disques contiennent entre 2 et 16 disques. Un déploiement à un seul disque est une disposition distincte, avec une parité nulle.

:::warning[Utilisez la largeur de l’ensemble, pas le total du cluster]

Validez la parité d’après le nombre de disques de chaque ensemble d’effacement, et non d’après le nombre total de disques du cluster. Un cluster peut contenir plusieurs ensembles ou plusieurs pools de largeurs différentes.

:::

## Estimer la capacité utile

Pour un pool dont tous les ensembles utilisent la même largeur et la même parité, estimez la capacité du codage d’effacement avec :

$$
\text{capacité utile} \approx \text{capacité brute} \times \frac{N-M}{N}
$$

Par exemple, 16 disques identiques de 10 TiB, disposés en un seul ensemble de 16 disques avec `EC:4`, fournissent environ :

$$
160\ \text{TiB} \times \frac{16-4}{16} = 120\ \text{TiB}
$$

Réservez une capacité supplémentaire pour XFS, les métadonnées d’objets, la gestion des versions, les chargements incomplets, la réparation des données et une marge d’exploitation normale. Considérez le résultat comme une estimation de planification, et non comme un espace disponible garanti.

## Configurer la parité

Définissez les variables de codage d’effacement dans le même fichier d’environnement que celui du service RustFS, par exemple `/etc/default/rustfs`.

Pour utiliser la parité STANDARD automatique recommandée, omettez `RUSTFS_STORAGE_CLASS_STANDARD` ou laissez-la vide :

```ini title="/etc/default/rustfs"
RUSTFS_STORAGE_CLASS_STANDARD=
```

Pour fixer la parité de façon explicite, utilisez le format `EC:<parity>` :

```ini title="/etc/default/rustfs"
RUSTFS_STORAGE_CLASS_STANDARD=EC:4
RUSTFS_STORAGE_CLASS_RRS=EC:1
```

`RUSTFS_STORAGE_CLASS_STANDARD` contrôle les écritures qui utilisent la classe de stockage `STANDARD`. `RUSTFS_STORAGE_CLASS_RRS` contrôle les écritures `REDUCED_REDUNDANCY` et vaut par défaut un shard de parité sur les ensembles à plusieurs disques. RustFS accepte ces deux classes de stockage pour les écritures locales.

Les réglages explicites doivent respecter toutes les règles suivantes :

- la parité ne doit pas dépasser la moitié des disques de chaque ensemble cible : `M <= N / 2`
- la parité STANDARD doit être supérieure ou égale à la parité REDUCED_REDUNDANCY lorsque les deux sont différentes de zéro
- la parité configurée doit être valide pour chaque pool, y compris le pool le plus étroit

Au démarrage, RustFS valide les classes de stockage explicites pour chaque pool. Une valeur non valide fait échouer le démarrage, au lieu de réduire la parité silencieusement. Retirez la valeur STANDARD explicite pour revenir à la parité automatique par pool, ou choisissez une valeur que chaque pool peut satisfaire.

## Contrôler la largeur des ensembles d’effacement

RustFS sélectionne normalement, de façon automatique, une largeur d’ensemble valide à partir de la topologie des volumes. Les largeurs des ensembles à plusieurs disques vont de 2 à 16.

`RUSTFS_ERASURE_SET_DRIVE_COUNT` peut fixer la largeur lorsque vous avez besoin d’une disposition symétrique précise :

```ini title="/etc/default/rustfs"
RUSTFS_ERASURE_SET_DRIVE_COUNT=16
```

La valeur doit diviser la topologie du pool de façon symétrique et rester valide pour chaque schéma d’extension des volumes. RustFS rejette une largeur qui ne peut pas partitionner uniformément les points de terminaison configurés. Laissez cette variable non définie, sauf si vous avez vérifié la disposition complète du pool.

## Valider la configuration

Avant de démarrer ou de redémarrer RustFS :

1. Déterminez le nombre de disques par ensemble d’effacement pour chaque pool.
2. Confirmez que la parité explicite ne dépasse pas la moitié de la largeur de l’ensemble le plus étroit.
3. Estimez la capacité utile et réservez une marge d’exploitation.
4. Conservez la même configuration d’environnement du service sur chaque nœud.

Après le démarrage, utilisez la page **Status** de la Console ou `rc admin info cluster` pour confirmer la disposition du backend, la parité du codage d’effacement, la disponibilité des disques et l’appartenance aux pools. Consultez [Vérification de l’état](/fr/operations/status-check) pour la procédure complète.

## Étapes suivantes

- [Préparer les disques de données](./disk-preparation.md)
- [Choisir une topologie de déploiement](/fr/installation#deployment-mode-comparison)
- [Consulter toutes les variables d’environnement de stockage](/fr/reference/environment-variables#storage--erasure)
