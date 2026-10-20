---
title: "Podman"
description: "Exécutez une instance RustFS à nœud unique avec Podman et un stockage de conteneur persistant."
---

Podman peut exécuter l’image OCI (Open Container Initiative) officielle de RustFS sans démon. Vous avez besoin d’une installation Podman opérationnelle et du droit de créer des conteneurs.

## 1. Récupérer l’image

```bash
podman pull docker.io/rustfs/rustfs:latest
```

## 2. Créer un stockage persistant

Créez un volume nommé pour que les données d’objets restent disponibles lorsque vous remplacez le conteneur :

```bash
podman volume create rustfs-data
```

:::note[Montage en bind mount d’un répertoire de l’hôte]

Le volume nommé ci-dessus ne demande aucune préparation supplémentaire. Si vous montez plutôt un répertoire de l’hôte en bind mount, gardez à l’esprit que le conteneur s’exécute sous l’utilisateur non root `rustfs`, d’identifiant `10001`. Le répertoire de l’hôte doit appartenir à `10001`, sinon vous rencontrerez des erreurs « permission denied » :

```bash
chown -R 10001:10001 /path/to/host_directory
```

:::

## 3. Démarrer RustFS

Remplacez les identifiants indicatifs avant d’exécuter le conteneur :

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
  docker.io/rustfs/rustfs:latest \
  /data
```

:::warning[Définir les identifiants à la création du conteneur]

Définissez des variables d’environnement `RUSTFS_ACCESS_KEY` et `RUSTFS_SECRET_KEY` uniques avant d’exposer RustFS sur un réseau. N’utilisez pas la valeur bien connue `rustfsadmin` pour l’un ou l’autre des identifiants. Si le conteneur a été démarré sans identifiants personnalisés, arrêtez-le et recréez-le avec les deux options `-e` indiquées ci-dessus. Le volume `rustfs-data` reste intact.

:::

## 4. Vérifier le déploiement

Vérifiez le conteneur et le point de terminaison de contrôle d’intégrité de l’API S3 :

```bash
podman ps --filter name=rustfs
curl --fail http://localhost:9000/health
```

L’API S3 est disponible à l’adresse `http://localhost:9000`, et la Console à l’adresse `http://localhost:9001`.

## Étapes suivantes

- [Console RustFS](/fr/administration/console)
- [Configurer un client S3](../../developer/examples/aws-cli.md)
- [Configuration TLS](../../integration/tls-configured.md)
