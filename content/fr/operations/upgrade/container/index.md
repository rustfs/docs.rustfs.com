---
title: "Mise à niveau de conteneur"
description: "Mettez à niveau les conteneurs RustFS démarrés avec Docker, Podman ou Docker Compose tout en préservant les données persistantes."
---

Mettez à niveau un déploiement en conteneur en recréant le conteneur RustFS à partir d’une image plus récente. Choisissez le flux qui correspond à la méthode d’installation d’origine : un conteneur démarré directement avec Docker ou Podman, ou un service géré par Docker Compose.

## Avant la mise à niveau

Lisez les notes de la version cible et utilisez une étiquette d’image explicite pour la mise à niveau. Notez l’image actuelle et conservez la commande `docker run`, `podman run` ou la configuration Compose d’origine, car la recréation d’un conteneur ne copie pas automatiquement ses options d’exécution.

Confirmez que RustFS est sain avant de le remplacer :

```bash
curl -fsS http://localhost:9000/health/ready
```

:::warning[Préservez le stockage persistant]

Ne supprimez pas le volume nommé ni le répertoire de l’hôte monté sur `/data`. Des commandes telles que `docker compose down -v`, `docker volume rm` et `podman volume rm` suppriment le stockage persistant et ne font pas partie d’une mise à niveau.

:::

## Mettre à niveau un conteneur Docker

Le flux suivant correspond au nom de conteneur et au volume nommé utilisés dans le [guide d’installation Docker](/fr/installation/container/docker). Si votre déploiement utilise d’autres ports, variables d’environnement, montages ou arguments de démarrage, conservez ces réglages inchangés dans la commande de remplacement.

Notez l’image actuelle, puis récupérez la version cible :

```bash
docker inspect --format '{{.Config.Image}}' rustfs
docker pull rustfs/rustfs:<target-version>
```

Arrêtez et supprimez uniquement le conteneur. Le volume `rustfs-data` reste intact :

```bash
docker stop rustfs
docker rm rustfs
```

Recréez le conteneur avec la configuration d’origine et l’image cible :

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
	rustfs/rustfs:<target-version> \
	/data
```

Attendez que le conteneur de remplacement soit sain :

```bash
docker ps --filter name=rustfs
docker logs rustfs
curl -fsS http://localhost:9000/health/ready
```

## Mettre à niveau un conteneur Podman

Le flux Podman est la même opération de remplacement, avec le nom d’image du [guide d’installation Podman](/fr/installation/container/podman).

```bash
podman inspect --format '{{.Config.Image}}' rustfs
podman pull docker.io/rustfs/rustfs:<target-version>
podman stop rustfs
podman rm rustfs
```

Recréez le conteneur avec la configuration d’origine et le volume persistant :

```bash
podman run -d \
	--name rustfs \
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
	docker.io/rustfs/rustfs:<target-version> \
	/data
```

Vérifiez le remplacement avant de continuer :

```bash
podman ps --filter name=rustfs
podman logs rustfs
curl -fsS http://localhost:9000/health/ready
```

## Mettre à niveau avec Docker Compose

Exécutez les commandes Compose depuis le répertoire qui contient le fichier `docker-compose.yml` du déploiement. Avant la mise à niveau, enregistrez la configuration entièrement résolue et confirmez l’image actuelle :

```bash
docker compose config > docker-compose.resolved.yaml
docker compose images rustfs
```

Passez le service `rustfs` à une étiquette d’image cible explicite, en laissant inchangés ses volumes, son environnement, ses ports et sa commande :

```yaml title="docker-compose.yml"
services:
	rustfs:
		image: rustfs/rustfs:<target-version>
```

Validez le fichier, récupérez l’image cible et recréez uniquement le service RustFS. `--no-deps` laisse les services d’observabilité facultatifs en cours d’exécution :

```bash
docker compose config --quiet
docker compose pull rustfs
docker compose up -d --no-deps rustfs
```

Contrôlez le service et le point de terminaison d’état de préparation de RustFS :

```bash
docker compose ps rustfs
docker compose logs --tail=100 rustfs
curl -fsS http://localhost:9000/health/ready
```

Si vous avez démarré RustFS avec le profil `observability`, le service RustFS se met tout de même à niveau avec les mêmes commandes. Mettez à niveau les images d’observabilité séparément, selon les notes de version de chaque composant.

## Mettre à niveau un déploiement à plusieurs nœuds

Remplacez un nœud RustFS à la fois. Attendez que le point de terminaison d’état de préparation du nœud mis à niveau réussisse, et confirmez l’état du cluster avant de passer au nœud suivant. Ne recréez pas tous les nœuds en même temps.

Utilisez le même flux Docker, Podman ou Compose sur chaque nœud, en préservant les montages et la configuration déjà en place sur ce nœud.

## Revenir en arrière

Pour Docker ou Podman, arrêtez et supprimez le conteneur de remplacement en échec, puis répétez la commande `run` correspondante avec l’étiquette d’image précédemment notée. Conservez le même volume persistant et la même configuration d’exécution.

Pour Docker Compose, restaurez la valeur `image` précédente dans `docker-compose.yml`, puis recréez le service RustFS :

```bash
docker compose pull rustfs
docker compose up -d --no-deps rustfs
curl -fsS http://localhost:9000/health/ready
```

Dans un déploiement à plusieurs nœuds, revenez en arrière un nœud à la fois et attendez l’état de préparation avant de continuer.

## Étapes suivantes

Consultez [Contrôle de l’état](/fr/operations/status-check) pour une validation supplémentaire après la mise à niveau.
