---
title: "Docker Swarm"
description: "Exécutez un service RustFS sur un seul nœud Docker Swarm, avec des informations d’identification stockées dans des secrets Docker, à l’aide du chart rustfs de swarmcli."
---

Cette page déploie RustFS en tant que service Docker Swarm dont les informations d’identification racine sont des secrets Docker plutôt que des variables d’environnement : RustFS les lit depuis des fichiers via `RUSTFS_ACCESS_KEY_FILE` et `RUSTFS_SECRET_KEY_FILE`, si bien qu’aucune des deux valeurs n’apparaît dans la définition du service ni dans `docker inspect`. Le déploiement utilise le [chart `rustfs`](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) du dépôt communautaire swarmcli-charts, installé avec [swarmcli](https://github.com/Eldara-Tech/swarmcli). Tous deux sont maintenus par Eldara Tech, et non par le projet RustFS.

Le chart exécute un service RustFS avec un seul disque sur un seul nœud (nœud unique, disque unique, SNSD). Un disque unique n’offre aucune redondance par codage d’effacement : le chart convient donc aux caches de build, aux cibles de sauvegarde et au stockage de blobs d’applications sur un petit swarm. Il n’exécute pas de déploiement RustFS multinœud.

## 1. Prérequis

* Un Docker Swarm (`docker swarm init`) et un shell sur un nœud manager
* swarmcli 1.11.0 ou version ultérieure : consultez le [guide d’installation de swarmcli](https://github.com/Eldara-Tech/swarmcli/blob/main/docs/installation.md)
* Le port 9000 (API S3) libre sur les nœuds du swarm, car l’étape 5 le publie sur le maillage de routage du swarm

## 2. Créer les informations d’identification sous forme de secrets Docker

Remplacez les espaces réservés des informations d’identification, puis créez un secret pour chaque clé :

```bash
printf '%s' '<your-access-key>' | docker secret create rustfs-access-key -
printf '%s' '<your-secret-key>' | docker secret create rustfs-secret-key -
```

Chaque valeur doit tenir sur une seule ligne, sans espace. Pour générer une clé d’accès secrète robuste, utilisez par exemple `openssl rand -base64 30`.

:::warning[Le service refuse les informations d’identification faibles]

Le conteneur du chart s’arrête au démarrage si l’un des secrets est absent, vide, contient un espace ou a la valeur bien connue `rustfsadmin`. Les secrets Docker ne sont pas modifiables : pour renouveler les informations d’identification, créez des secrets sous de nouveaux noms, faites-y pointer les valeurs `s3.accessKeySecret` et `s3.secretKeySecret` du chart, puis mettez à niveau la release.

:::

## 3. Étiqueter le nœud de données

Un volume nommé n’existe que sur un seul nœud ; le service est donc épinglé au nœud portant l’étiquette `rustfs-data=true`. Étiquetez exactement un nœud :

```bash
docker node update --label-add rustfs-data=true <node-hostname>
```

Sur un swarm à nœud unique, vous pouvez omettre l’étiquette et ajouter plutôt `--set persistence.nodeLabel=""` à la commande d’installation de l’étape 5.

## 4. Ajouter le dépôt de charts

Ignorez cette étape si `swarmcli charts repo list` affiche déjà `swarmcli-charts` :

```bash
swarmcli charts repo add swarmcli-charts https://eldara-tech.github.io/swarmcli-charts
```

## 5. Installer RustFS

Installez le chart en tant que release nommée `rustfs`, publiez l’API S3 sur le port 9000 et créez un compartiment au démarrage :

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket}'
```

Le service stocke ses données sous `/data` sur le volume nommé `rustfs-data`, que Docker nomme `rustfs_rustfs-data` d’après la release. Chaque compartiment listé dans `buckets` est créé dès que le serveur répond ; un compartiment existant est laissé tel quel, de sorte que les redémarrages et les mises à niveau sont sans risque.

## 6. Vérifier le déploiement

Vérifiez la release, la tâche du service et le point de terminaison de contrôle d’intégrité de l’API S3 :

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs
curl --fail http://localhost:9000/health
```

L’API S3 est accessible à l’adresse `http://localhost:9000` sur chaque nœud du swarm. Les clients utilisent l’adressage de type chemin et la Région `us-east-1`.

## Modes d’exposition

Le chart expose l’API S3 et la Console indépendamment l’une de l’autre. La Console est désactivée par défaut ; activez-la avec `console.enabled=true`. Le mode de l’API S3 est défini par `exposure.mode`, celui de la Console par `console.exposure.mode` :

| Mode | Accessible depuis |
| - | - |
| `none` (par défaut) | Uniquement les services connectés au réseau overlay `rustfs-net`, à l’adresse `http://<release>_rustfs:9000` |
| `published` | Un port publié sur le maillage de routage du swarm : `publish.port` pour l’API S3, `console.publish.port` (9001) pour la Console |
| `traefik` | Un nom d’hôte routé par Traefik : `ingress.host` pour l’API S3, `console.ingress.host` pour la Console |

Par exemple, pour publier également la Console sur le port 9001 :

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set console.enabled=true \
  --set console.exposure.mode=published \
  --set 'buckets={my-bucket}'
```

:::note[Le port de la Console sert aussi l’API S3]

L’écouteur de la Console sert également l’API S3 signée complète et l’API d’administration : exposer uniquement la Console place donc tout de même cette API sur une adresse publique. Laissez la Console désactivée si vous ne l’utilisez pas.

:::

## Valeurs principales

| Valeur | Rôle | Valeur par défaut du chart |
| - | - | - |
| `image.tag` | Tag de l’image RustFS | `""` (la version de RustFS fixée par le chart) |
| `s3.accessKeySecret` / `s3.secretKeySecret` | Secrets Docker contenant les informations d’identification racine | `rustfs-access-key` / `rustfs-secret-key` |
| `buckets` | Compartiments créés au démarrage s’ils n’existent pas | `[]` |
| `exposure.mode` | Exposition de l’API S3 : `none`, `published` ou `traefik` | `none` |
| `publish.port` | Port publié de l’API S3 | `9000` |
| `console.enabled` | Exécuter l’écouteur de la Console | `false` |
| `console.exposure.mode` | Exposition de la Console : `none`, `published` ou `traefik` | `none` |
| `persistence.nodeLabel` | Étiquette du nœud auquel le service est épinglé ; `""` pour aucun épinglage | `rustfs-data` |
| `persistence.volumePath` | Répertoire de l’hôte monté sur `/data` à la place du volume nommé ; doit appartenir à `10001` | `""` |
| `extraEnv` | Variables d’environnement `RUSTFS_*` supplémentaires, comme `RUSTFS_SERVER_DOMAINS` | `{}` |

Le [README du chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) documente toutes les valeurs, notamment le routage par Traefik, l’authentification unique (SSO) pour la Console via OpenID Connect et le montage d’un répertoire de l’hôte.

## Désinstallation

```bash
swarmcli charts uninstall rustfs
```

La désinstallation supprime le service et l’historique de la release. Elle conserve le volume de données, les deux secrets Docker et le réseau `rustfs-net`, que swarmcli affiche avec la commande permettant de le supprimer.

:::note[Le volume de données survit à la désinstallation]

Une installation ultérieure avec le même nom de release réattache le volume et ses données. Pour supprimer les données, supprimez le volume sur le nœud étiqueté, ainsi que les secrets si vous n’en avez plus besoin :

```bash
docker volume rm rustfs_rustfs-data
docker secret rm rustfs-access-key rustfs-secret-key
```

:::

## Étapes suivantes

- [Console RustFS](/administration/console)
- [Configurer un client S3](../../developer/examples/aws-cli.md)
- [Listes de contrôle avant l’installation](../requirement/checklists/index.md)
