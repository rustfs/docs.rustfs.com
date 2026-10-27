---
title: "Installer et configurer RustFS avec Docker"
description: "Exécutez RustFS avec Docker : instance à nœud unique, droits des répertoires de l’hôte, Docker Compose, TLS et déploiement multi-nœuds."
---

Cette page décrit l’exécution de l’image officielle de RustFS avec Docker : une instance à nœud unique avec stockage persistant, les droits des répertoires de l’hôte pour l’utilisateur non root du conteneur, Docker Compose avec des services d’observabilité facultatifs, TLS et un déploiement multi-nœuds. Vous avez besoin d’un moteur Docker opérationnel et du droit d’exécuter des conteneurs.

## 1. Prérequis

* Moteur Docker (≥ 20.10) installé, avec la possibilité de tirer des images et d’exécuter des conteneurs
* Ports de l’hôte 9000 (API S3) et 9001 (Console) disponibles, ou les ports personnalisés que vous prévoyez d’utiliser
* Si vous montez un répertoire de l’hôte en bind mount, son propriétaire doit correspondre à l’utilisateur du conteneur — voir [Monter un répertoire de l’hôte](#bind-mount-a-host-directory)

## 2. Récupérer l’image

```bash
docker pull rustfs/rustfs:latest
```

## 3. Créer un stockage persistant

Créez un volume nommé pour que les données d’objets restent disponibles lorsque vous remplacez le conteneur :

```bash
docker volume create rustfs-data
```

## 4. Démarrer RustFS

Remplacez les identifiants indicatifs avant d’exécuter le conteneur :

```bash
docker run -d \
  --name rustfs \
  --restart unless-stopped \
  -p 9000:9000 \
  -p 9001:9001 \
  -v rustfs-data:/data \
  -e RUSTFS_ACCESS_KEY="<your-access-key>" \
  -e RUSTFS_SECRET_KEY="<your-secret-key>" \
  -e RUSTFS_ADDRESS=":9000" \
  -e RUSTFS_CONSOLE_ADDRESS=":9001" \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_OBS_LOGGER_LEVEL=error \
  -e RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/" \
  rustfs/rustfs:latest \
  /data
```

:::warning[Définir les identifiants à la création du conteneur]

Définissez des variables d’environnement `RUSTFS_ACCESS_KEY` et `RUSTFS_SECRET_KEY` uniques avant d’exposer RustFS sur un réseau. N’utilisez pas la valeur bien connue `rustfsadmin` pour l’un ou l’autre des identifiants. Si le conteneur a été démarré sans identifiants personnalisés, arrêtez-le et recréez-le avec les deux options `-e` indiquées ci-dessus. Le volume `rustfs-data` reste intact.

:::

### Variables d’environnement ou indicateurs de ligne de commande

L’exemple ci-dessus configure RustFS avec des variables d’environnement. Vous pouvez transmettre les mêmes réglages sous forme d’indicateurs de ligne de commande. Lorsque les deux sont présents, les indicateurs de ligne de commande l’emportent :

```bash
docker run -d \
  --name rustfs \
  -p 9000:9000 \
  -p 9001:9001 \
  -v rustfs-data:/data \
  rustfs/rustfs:latest \
  --access-key "<your-access-key>" \
  --secret-key "<your-secret-key>" \
  --address :9000 \
  --console-enable \
  /data
```

## 5. Monter un répertoire de l’hôte [#bind-mount-a-host-directory]

Le volume nommé ci-dessus ne demande aucune préparation supplémentaire. Si vous montez plutôt un répertoire de l’hôte (`-v /path/on/host:/data`), gardez à l’esprit que le conteneur s’exécute sous l’utilisateur non root `rustfs`, d’identifiant `10001`. Le répertoire de l’hôte doit appartenir à `10001`, sinon vous rencontrerez des erreurs « permission denied » :

```bash
chown -R 10001:10001 /path/to/host_directory
```

## 6. Vérifier le déploiement

Vérifiez le conteneur et le point de terminaison de contrôle d’intégrité de l’API S3 :

```bash
docker ps --filter name=rustfs
curl --fail http://localhost:9000/health
```

L’API S3 est disponible à l’adresse `http://localhost:9000`, et la Console à l’adresse `http://localhost:9001`.

## Docker Compose

Le dépôt RustFS fournit un fichier [`docker-compose.yml`](https://github.com/rustfs/rustfs/blob/main/docker-compose.yml) qui inclut les services `grafana`, `prometheus`, `otel-collector` et `jaeger`, principalement pour l’observabilité. Pour déployer RustFS avec ces services, clonez le [dépôt de code RustFS](https://github.com/rustfs/rustfs) en local :

```bash
git clone https://github.com/rustfs/rustfs.git
```

Exécutez la commande depuis la racine du dépôt :

```bash
docker compose --profile observability up -d
```

Le fichier Compose utilise un conteneur d’initialisation pour accorder les droits d’accès corrects à `rustfs` : le service `rustfs_perms` ci-dessous attribue la propriété des volumes montés à `10001` avant le démarrage de `rustfs`, et `depends_on` attend la fin de cette opération. Pour conserver des journaux persistants et accessibles, le répertoire de journaux de l’hôte est mappé sur le chemin `/var/log/rustfs/` du conteneur :

```yaml title="docker-compose.yml"
  services:
    # grant the necessary permissions to RUSTFS volumes path
    rustfs_perms:
      image: alpine
      user: root
      volumes:
        - /path/to/host_directory/volumes:/fix_path
      command: chown -R 10001:10001 /fix_path

    rustfs:
      image: rustfs/rustfs:latest
      depends_on:
        rustfs_perms:
          condition: service_completed_successfully
      volumes:
        - /path/to_host_directory/volumes/data:/data
        - /path/to_host_directory/volumes/logs:/var/log/rustfs/
      environment:
        - RUSTFS_ADDRESS=":9000"
        - RUSTFS_CONSOLE_ADDRESS=":9001"
        - RUSTFS_CONSOLE_ENABLE=true
        - RUSTFS_OBS_LOGGER_LEVEL=error
        - RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"

      # ... other configurations
```

Si vous ne voulez que RustFS, sans Grafana, Prometheus ni les autres services d’observabilité, démarrez uniquement le service `rustfs` (le fichier Compose marque la dépendance au collecteur comme facultative) :

```bash
docker compose -f docker-compose.yml up -d rustfs
```

Cela ne démarre que le conteneur `rustfs-server`. Que vous démarriez uniquement `rustfs-server` ou la pile complète, l’API S3 est servie à l’adresse `http://localhost:9000` et la Console RustFS à l’adresse `http://localhost:9001`. Ouvrez la Console dans un navigateur et connectez-vous avec la clé d’accès et la clé secrète configurées ci-dessus. Générez une clé secrète robuste, par exemple avec `openssl rand -base64 24`, et n’utilisez jamais les valeurs indicatives en production.

Pour Docker Compose, définissez des valeurs uniques de `RUSTFS_ACCESS_KEY` et `RUSTFS_SECRET_KEY` dans l’environnement du service `rustfs`, ou dans le fichier d’environnement utilisé pour la substitution de variables, puis recréez le service avec `docker compose up -d rustfs`.

## Déploiement multi-nœuds

Le réseau bridge par défaut de Docker ne prend pas en charge les déploiements multi-nœuds. Utilisez `--network host` pour que chaque conteneur puisse communiquer directement avec les autres nœuds.

Exécutez ce qui suit sur **chaque nœud** :

```bash
docker run -d \
  --name rustfs \
  --network host \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY="<your-access-key>" \
  -e RUSTFS_SECRET_KEY="<your-secret-key>" \
  -e RUSTFS_ADDRESS=":9000" \
  -e RUSTFS_CONSOLE_ADDRESS=":9001" \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_OBS_LOGGER_LEVEL=error \
  -e RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/" \
  -e RUSTFS_VOLUMES="http://node{1...4}:9000/data/rustfs{0...3}" \
  rustfs/rustfs:latest
```

Ajoutez les entrées à `/etc/hosts` sur **chaque** nœud :

```ini title="/etc/hosts"
192.168.1.1 node1
192.168.1.2 node2
192.168.1.3 node3
192.168.1.4 node4
```

## Configuration TLS

Si vous [utilisez TLS](../../integration/tls-configured.md), montez le répertoire des certificats et indiquez-le à RustFS :

```bash
-v /path/to/certs:/certs \
-e RUSTFS_TLS_PATH=/certs \
```

## Avant la production

Parcourez les [listes de contrôle préalables à l’installation](../requirement/checklists/index.md) — matériel, réseau, logiciels et sécurité — avant de déployer en production. Utilisez un déploiement multi-nœuds, [activez TLS](../../integration/tls-configured.md), configurez la rotation des journaux et planifiez des sauvegardes régulières.

## Étapes suivantes

- [Console RustFS](/fr/administration/console)
- [Configurer un client S3](../../developer/examples/aws-cli.md)
- [Configuration TLS](../../integration/tls-configured.md)
