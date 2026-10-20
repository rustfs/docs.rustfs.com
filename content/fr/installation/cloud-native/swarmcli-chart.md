---
title: "Chart SwarmCLI"
description: "Déployez RustFS sur Docker Swarm avec le chart rustfs de SwarmCLI, sous forme de service à nœud unique ou de cluster distribué avec codage d’effacement : informations d’identification dans des secrets Docker, mises à niveau et retours arrière versionnés, et HTTPS facultatif via Traefik."
---

[SwarmCLI](https://github.com/Eldara-Tech/swarmcli) est un gestionnaire de paquets inspiré de Helm et une interface en mode terminal pour Docker Swarm. Son [chart `rustfs`](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) open source déploie RustFS sur Docker Swarm. Tous deux sont maintenus par Eldara Tech, et non par le projet RustFS.

Par rapport à un fichier de stack écrit à la main, le chart apporte :

- **Informations d’identification dans des secrets Docker.** RustFS lit ses clés racine depuis des fichiers via `RUSTFS_ACCESS_KEY_FILE` et `RUSTFS_SECRET_KEY_FILE`, si bien qu’aucune des deux valeurs n’apparaît dans la définition du service ni dans `docker inspect`. La clé par défaut `rustfsadmin` est refusée.
- **Releases versionnées.** Prévisualisez une mise à niveau, appliquez-la et revenez à une révision antérieure. SwarmCLI stocke l’historique des révisions dans le swarm lui-même : aucune base de données supplémentaire n’est nécessaire.
- **HTTPS via Traefik.** Avec le [chart `traefik`](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik) associé, l’API S3 et la Console obtiennent leurs propres noms d’hôte et certificats Let's Encrypt, et la Console peut utiliser l’authentification unique (SSO) via OpenID Connect.
- **Déploiements avec contrôle d’intégrité.** Les compartiments listés dans les valeurs sont créés au démarrage, et chaque déploiement d’une release autonome est surveillé via le point de terminaison `/health/ready` de RustFS : `--wait` signale ainsi une mise à niveau défaillante au lieu d’un succès.
- **Mises à niveau progressives du cluster.** En mode distribué, une mise à niveau met à jour un pair à la fois ; si les quatre pairs par défaut sont tous en cours d’exécution, le cluster continue de servir les lectures et les écritures pendant toute l’opération, avec un pair en moins.

Le chart fonctionne selon l’un des deux modes suivants, choisi à l’installation. Le mode autonome, utilisé par défaut, exécute un service RustFS avec un seul disque sur un seul nœud (nœud unique, disque unique, SNSD). Un disque unique n’offre aucune redondance par codage d’effacement : ce mode convient donc aux caches de build, aux cibles de sauvegarde et au stockage de blobs d’applications sur un petit swarm. Le mode distribué répartit les objets par codage d’effacement sur quatre pairs ou plus, un par nœud, pour les données qui doivent survivre à la perte d’un nœud. L’étape 4 installe le mode autonome et l’étape 5 le mode distribué ; les autres étapes s’appliquent aux deux.

## 1. Prérequis

* Un Docker Swarm (`docker swarm init`) et un shell sur un nœud manager
* SwarmCLI 2.2.0 ou version ultérieure : consultez le [guide d’installation de SwarmCLI](https://github.com/Eldara-Tech/swarmcli/blob/main/docs/installation.md)
* Pour le mode autonome, le port 9000 (API S3) libre sur les nœuds du swarm, car l’étape 4 le publie sur le maillage de routage du swarm
* Pour le mode distribué, un nœud pour chaque pair, au moins quatre (un seul nœud suffit pour le développement ; voir l’étape 5)

## 2. Créer les informations d’identification sous forme de secrets Docker

Remplacez les espaces réservés des informations d’identification, puis créez un secret pour chaque clé :

```bash
printf '%s' '<your-access-key>' | docker secret create rustfs-access-key -
printf '%s' '<your-secret-key>' | docker secret create rustfs-secret-key -
```

Chaque valeur doit tenir sur une seule ligne, sans espace. Pour générer une clé d’accès secrète robuste, utilisez par exemple `openssl rand -base64 30`. En mode distribué, chaque pair lit les deux mêmes secrets.

:::warning[Le service refuse les informations d’identification faibles]

SwarmCLI refuse d’installer le chart tant que l’un des secrets est absent, et le conteneur s’arrête au démarrage si une clé est vide, contient un espace ou a la valeur bien connue `rustfsadmin`. Les secrets Docker ne sont pas modifiables : pour renouveler les informations d’identification, créez des secrets sous de nouveaux noms, puis mettez à niveau la release en faisant pointer `s3.accessKeySecret` et `s3.secretKeySecret` vers ces secrets. En mode distribué, le renouvellement exige un arrêt complet, comme décrit dans la section Mise à niveau et retour arrière.

:::

## 3. Ajouter le dépôt de charts

Ignorez cette étape si `swarmcli charts repo list` affiche déjà `swarmcli-charts` :

```bash
swarmcli charts repo add swarmcli-charts https://eldara-tech.github.io/swarmcli-charts
```

## 4. Installer le mode autonome

Suivez cette étape ou l’étape 5, mais pas les deux. Un volume nommé n’existe que sur un seul nœud ; le service est donc épinglé au nœud portant l’étiquette `rustfs-data=true`. Étiquetez exactement un nœud :

```bash
docker node update --label-add rustfs-data=true <node-hostname>
```

Sur un swarm à nœud unique, vous pouvez omettre l’étiquette et ajouter plutôt `--set persistence.nodeLabel=""` à la commande d’installation ci-dessous.

Installez le chart en tant que release nommée `rustfs`, publiez l’API S3 sur le port 9000 et créez un compartiment au démarrage :

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket}'
```

Le service stocke ses données sous `/data` sur le volume nommé `rustfs-data`, que Docker nomme `rustfs_rustfs-data` d’après la release. Chaque compartiment listé dans `buckets` est créé dès que le serveur répond ; un compartiment existant est laissé tel quel, de sorte que les redémarrages et les mises à niveau sont sans risque.

## 5. Installer le mode distribué

Suivez cette étape à la place de l’étape 4. En mode distribué, chaque pair est un service Swarm distinct (de `rustfs_rustfs-1` à `rustfs_rustfs-4` pour une release nommée `rustfs`), avec un seul réplica, son propre volume et sa propre étiquette de nœud. Étiquetez un nœud pour chaque pair :

```bash
docker node update --label-add rustfs-1=true <node-a>
docker node update --label-add rustfs-2=true <node-b>
docker node update --label-add rustfs-3=true <node-c>
docker node update --label-add rustfs-4=true <node-d>
```

Placez chaque pair sur un nœud différent : des pairs qui partagent un nœud partagent aussi son sort, et avec les quatre pairs par défaut, la perte d’un seul nœud qui héberge deux pairs interrompt les écritures. Sur un swarm à nœud unique, attribuez les quatre étiquettes à cet unique nœud ; cette configuration ne convient qu’au développement, car elle n’offre aucune disponibilité.

Définissez explicitement le mode et la structure du cluster. Le nombre total de disques est égal à `cluster.peers * cluster.drivesPerPeer`.

:::warning[Choisir la topologie avant l’installation]

`cluster.peers` et `cluster.drivesPerPeer` sont fixés à l’installation : RustFS enregistre le nombre de disques et la largeur de l’ensemble d’effacement (erasure set) sur chaque disque, et refuse de démarrer avec d’autres valeurs. La valeur `mode` est elle aussi choisie à l’installation. La modifier sur une release existante ne convertit pas les données : les services du nouveau mode démarrent sur des disques vides, ceux de l’ancien mode continuent de s’exécuter à côté d’eux, et les clients atteignent les deux. Pour migrer un stockage autonome vers un cluster, installez le cluster en tant que seconde release et copiez-y les compartiments via S3.

:::

```yaml title="distributed-values.yaml"
mode: distributed

cluster:
  peers: 4
  drivesPerPeer: 1

buckets:
  - my-bucket
```

L’exemple crée quatre pairs dotés chacun d’un disque. Chaque objet est découpé en deux fragments de données et deux fragments de parité : les lectures résistent donc à l’indisponibilité de deux pairs et les écritures à celle d’un pair, et la capacité utile représente la moitié de la capacité totale des disques. Plus d’un disque par pair nécessite `persistence.volumePaths`, avec un répertoire de l’hôte par disque, chacun sur son propre disque physique ; le README du chart décrit ce paramètre. Installez le chart avec le fichier de valeurs :

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

Tous les pairs démarrent ensemble. `--wait` rend la main dès que la tâche de chaque pair s’exécute et est restée active au-delà de sa fenêtre de surveillance de deux minutes. Le pair 1 crée les compartiments dès que le cluster accepte les écritures ; s’il n’y parvient pas dans les cinq minutes qui suivent son démarrage, il consigne dans son journal, visible avec `docker service logs rustfs_rustfs-1`, le compartiment qu’il n’a pas pu créer, et continue de servir les requêtes. Le contrôle d’intégrité d’un pair indique seulement que ce pair est en vie : `--wait` n’indique donc pas si le cluster sert les requêtes ; l’étape 6 le vérifie.

## 6. Vérifier le déploiement

En mode autonome, vérifiez la release, la tâche du service et le point de terminaison d’état de préparation de l’API S3 :

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs
curl --fail http://localhost:9000/health/ready
```

L’API S3 est accessible à l’adresse `http://localhost:9000` sur chaque nœud du swarm. Les clients utilisent l’adressage de type chemin et la Région `us-east-1`. Si la tâche reste en attente avec `no suitable node`, c’est qu’aucun nœud ne porte l’étiquette `rustfs-data=true` de l’étape 4.

En mode distribué, vérifiez la release et les tâches des pairs, puis demandez au cluster s’il sert les requêtes, depuis un conteneur connecté au réseau overlay `rustfs-net` :

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs-1 rustfs_rustfs-2 rustfs_rustfs-3 rustfs_rustfs-4
docker run --rm --network rustfs-net curlimages/curl -s -o /dev/null -w '%{http_code}\n' \
  http://rustfs-rustfs:9000/minio/health/cluster
```

`200` signifie que chaque ensemble d’effacement dispose du quorum d’écriture. Si la tâche d’un pair reste en attente avec `no suitable node`, c’est qu’aucun nœud ne porte l’étiquette `rustfs-<n>=true` de ce pair, posée à l’étape 5. Une fois l’étiquette en place, le pair démarre ; si le journal du pair 1 signale ensuite un compartiment que le pair n’a pas pu créer, redémarrez le pair 1 pour créer de nouveau les compartiments : `docker service update --force rustfs_rustfs-1`.

Les services qui rejoignent `rustfs-net` atteignent le cluster à l’adresse `http://rustfs-rustfs:9000`, avec l’adressage de type chemin et la Région `us-east-1`. Tout pair sert l’ensemble des objets, et le nom se résout en l’adresse de chaque pair dont le contrôle d’intégrité réussit. Ce contrôle indique seulement qu’un pair est en vie : lors d’une première installation, ou après l’arrêt de tous les pairs, un pair peut donc répondre 503 tant que le cluster ne sert pas les requêtes. Une requête en cours vers un pair qui s’arrête échoue également. Les clients doivent réessayer, comme le font les clients S3 par défaut. Pour atteindre le cluster depuis l’extérieur du swarm, exposez-le comme décrit dans la section Modes d’exposition.

## Mise à niveau et retour arrière

Chaque installation, mise à niveau ou retour arrière crée une révision numérotée de la release. Une mise à niveau repart des valeurs par défaut du chart : transmettez donc de nouveau chaque valeur, y compris `--set persistence.nodeLabel=""` si vous l’avez utilisé à l’étape 4, ou conservez les valeurs dans un fichier et transmettez-le avec `-f`. Pour la release autonome de l’étape 4, prévisualisez une modification, appliquez-la, puis listez les révisions :

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts upgrade rustfs swarmcli-charts/rustfs --wait \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts history rustfs
```

Pour revenir à une révision antérieure :

```bash
swarmcli charts rollback rustfs 1
```

Un retour arrière redéploie la définition du service de cette révision ; il ne restaure pas les données.

En mode distribué, transmettez à chaque mise à niveau le fichier de valeurs utilisé lors de l’installation, plutôt que `--reuse-values`, et reportez dans ce fichier les modifications ultérieures, comme les paramètres d’exposition. Une mise à niveau dont les valeurs ne contiennent pas `mode: distributed` laisse les pairs en l’état et démarre un service autonome à côté d’eux.

SwarmCLI met à jour les pairs un à la fois : il arrête un pair, démarre sa nouvelle tâche et ne passe au pair suivant qu’une fois que cette tâche s’exécute et est restée active au-delà de sa fenêtre de surveillance. Si les quatre pairs par défaut sont tous en cours d’exécution, le cluster continue de servir les lectures et les écritures pendant toute l’opération, avec un pair en moins ; si un pair est déjà indisponible, le cluster cesse d’accepter les écritures chaque fois que la mise à niveau en arrête un autre. Vérifiez donc d’abord, avec les commandes de l’étape 6, que la tâche de chaque pair s’exécute et que le cluster répond `200` ; un `200` à lui seul n’indique pas que tous les pairs s’exécutent. Prévisualisez et appliquez ensuite la mise à niveau, puis vérifiez de nouveau le cluster :

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml
swarmcli charts upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

Un retour arrière met à jour les pairs de la même manière. Une mise à niveau dont un pair ne parvient pas à démarrer s’arrête là, sans toucher aux pairs restants.

:::warning[Le renouvellement des informations d’identification d’un cluster exige un arrêt complet]

Chaque pair dérive son secret inter-nœuds de la paire de clés : les pairs qui utilisent l’ancienne paire et ceux qui utilisent la nouvelle ne peuvent donc pas communiquer entre eux, et une mise à niveau qui met à jour un pair à la fois scinderait le cluster. Créez les nouveaux secrets :

```bash
printf '%s' '<your-new-access-key>' | docker secret create rustfs-access-key-2 -
printf '%s' '<your-new-secret-key>' | docker secret create rustfs-secret-key-2 -
```

Ajoutez les noms des deux secrets à `distributed-values.yaml`, afin que les mises à niveau ultérieures les conservent. Avec les valeurs de l’étape 5, le fichier devient :

```yaml title="distributed-values.yaml"
mode: distributed

cluster:
  peers: 4
  drivesPerPeer: 1

s3:
  accessKeySecret: rustfs-access-key-2
  secretKeySecret: rustfs-secret-key-2

buckets:
  - my-bucket
```

Arrêtez ensuite tous les pairs et effectuez la mise à niveau, afin que tous les pairs démarrent ensemble avec la nouvelle paire :

```bash
for n in 1 2 3 4; do docker service scale "rustfs_rustfs-$n=0"; done
swarmcli charts upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

Les données et les compartiments sont conservés ; les clients ont besoin de la nouvelle paire. Ne revenez pas à une révision antérieure au renouvellement : le retour arrière ramènerait les pairs vers l’ancienne paire un à la fois et scinderait le cluster de la même manière.

:::

## Modes d’exposition

Le chart expose l’API S3 et la Console indépendamment l’une de l’autre. La Console est désactivée par défaut ; activez-la avec `console.enabled=true`. Le mode de l’API S3 est défini par `exposure.mode`, celui de la Console par `console.exposure.mode` :

| Mode | Accessible depuis |
| - | - |
| `none` (par défaut) | Les services connectés au réseau overlay `rustfs-net`, à l’adresse `http://<release>-rustfs:9000` (la Console, si elle est activée, sur le port 9001) ; tant que l’autre écouteur utilise `traefik`, également les services du réseau `traefik-public` |
| `published` | Un port publié : `publish.port` pour l’API S3, `console.publish.port` (9001) pour la Console, sur le maillage de routage du swarm (en mode distribué, sur le nœud propre à chaque pair) |
| `traefik` | Un nom d’hôte routé par Traefik en HTTPS : `ingress.host` pour l’API S3, `console.ingress.host` pour la Console |

Le mode `traefik` nécessite d’installer d’abord le [chart `traefik`](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik) : ce chart crée le réseau `traefik-public` rejoint par RustFS et obtient les certificats Let's Encrypt. Exposez ensuite l’API S3 d’une release autonome sous son nom d’hôte :

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=traefik \
  --set ingress.host=s3.example.com \
  --set 'buckets={my-bucket}'
```

Sans Traefik, publiez la Console d’une release autonome sur le port 9001, à côté de l’API S3 :

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

En mode distribué, tous les pairs reçoivent les mêmes paramètres d’exposition ; définissez-les dans `distributed-values.yaml`, puis effectuez la mise à niveau comme décrit dans la section Mise à niveau et retour arrière. Avec `traefik`, Traefik répartit les requêtes entre tous les pairs sains. Le mode `published` nécessite `publish.mode=host` (et `console.publish.mode=host` pour la Console), qui publie le port sur le nœud propre à chaque pair plutôt que sur le maillage de routage : le port d’un nœud n’atteint donc que le pair situé sur ce nœud. Placez un équilibreur de charge devant les nœuds, ou utilisez Traefik. La publication en mode hôte nécessite que chaque pair dispose de son propre nœud : un swarm à nœud unique ne peut donc pas l’utiliser.

## Valeurs principales

| Valeur | Rôle | Valeur par défaut du chart |
| - | - | - |
| `image.tag` | Tag de l’image RustFS | `""` (la version de RustFS fixée par le chart) |
| `mode` | `standalone` ou `distributed`, choisi à l’installation | `standalone` |
| `cluster.peers` | Pairs distribués, chacun avec un service et une étiquette de nœud ; au moins 4 | `4` |
| `cluster.drivesPerPeer` | Disques par pair distribué ; plus d’un disque nécessite `persistence.volumePaths` | `1` |
| `s3.accessKeySecret` / `s3.secretKeySecret` | Secrets Docker contenant les informations d’identification racine | `rustfs-access-key` / `rustfs-secret-key` |
| `buckets` | Compartiments créés au démarrage s’ils n’existent pas | `[]` |
| `exposure.mode` | Exposition de l’API S3 : `none`, `published` ou `traefik` | `none` |
| `publish.port` | Port publié de l’API S3 | `9000` |
| `ingress.host` | Nom d’hôte que Traefik route vers l’API S3 | `s3.example.com` |
| `console.enabled` | Exécuter l’écouteur de la Console | `false` |
| `console.exposure.mode` | Exposition de la Console : `none`, `published` ou `traefik` | `none` |
| `persistence.nodeLabel` | Étiquette du nœud auquel le service autonome est épinglé ; `""` pour aucun épinglage | `rustfs-data` |
| `persistence.nodeLabelPrefix` | Préfixe d’étiquette de nœud qui épingle le pair distribué `<n>` au nœud étiqueté `<prefix>-<n>` ; `""` pour aucun épinglage, uniquement sur un swarm à nœud unique | `rustfs` |
| `persistence.volumePath` | Répertoire de l’hôte monté sur `/data` à la place du volume nommé, en mode autonome ; doit appartenir à `10001` | `""` |
| `extraEnv` | Variables d’environnement `RUSTFS_*` supplémentaires, comme `RUSTFS_SERVER_DOMAINS` | `{}` |

Le [README du chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) documente toutes les valeurs, notamment le routage par Traefik, l’authentification unique (SSO) pour la Console via OpenID Connect et les montages de répertoires de l’hôte des deux modes.

## Désinstallation

```bash
swarmcli charts uninstall rustfs
```

La désinstallation supprime le service, ou le service de chaque pair en mode distribué, ainsi que l’historique de la release. Elle conserve le volume de données (un par pair en mode distribué), les deux secrets Docker et le réseau `rustfs-net`, que SwarmCLI affiche avec la commande permettant de le supprimer.

:::note[Les volumes de données survivent à la désinstallation]

En mode autonome, une installation ultérieure avec le même nom de release réattache le volume et ses données. Pour supprimer les données, supprimez le volume sur le nœud étiqueté une fois la tâche arrêtée (ce qui peut prendre jusqu’à 30 secondes) :

```bash
docker volume rm rustfs_rustfs-data
```

En mode distribué, chaque pair conserve son propre volume, `rustfs_rustfs-data-<n>`, sur le nœud portant l’étiquette `rustfs-<n>=true` ; supprimez-le sur ce nœud une fois la tâche de ce pair arrêtée. Une installation ultérieure avec le même nom de release réutilise ces volumes : elle doit donc conserver les mêmes valeurs de `cluster.peers` et `cluster.drivesPerPeer`.

Dans les deux modes, supprimez les secrets si vous n’en avez plus besoin : la paire utilisée par la release, ainsi que toute paire remplacée lors d’un renouvellement. Avec les noms de l’étape 2 :

```bash
docker secret rm rustfs-access-key rustfs-secret-key
```

:::

## Étapes suivantes

- [Console RustFS](/administration/console)
- [Configurer un client S3](../../developer/examples/aws-cli.md)
- [Listes de contrôle avant l’installation](../requirement/checklists/index.md)
