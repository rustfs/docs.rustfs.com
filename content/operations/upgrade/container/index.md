---
title: "Container Upgrade"
description: "Upgrade RustFS containers started with Docker, Podman, or Docker Compose while preserving persistent data."
---

Upgrade a container deployment by recreating the RustFS container from a newer image. Choose the workflow that matches the original installation method: a container started directly with Docker or Podman, or a service managed by Docker Compose.

## Before you upgrade

Read the target release notes and use an explicit image tag for the upgrade. Record the current image and retain the original `docker run`, `podman run`, or Compose configuration because recreating a container does not copy its runtime options automatically.

Confirm that RustFS is healthy before replacing it:

```bash
curl -fsS http://localhost:9000/health/ready
```

:::warning[Preserve persistent storage]

Do not remove the named volume or host directory mounted at `/data`. Commands such as `docker compose down -v`, `docker volume rm`, and `podman volume rm` delete persistent storage and are not part of an upgrade.

:::

## Upgrade a Docker container

The following workflow matches the container name and named volume used in the [Docker installation guide](/installation/container/docker). If your deployment uses different ports, environment variables, mounts, or startup arguments, keep those settings unchanged in the replacement command.

Record the current image, then pull the target version:

```bash
docker inspect --format '{{.Config.Image}}' rustfs
docker pull rustfs/rustfs:<target-version>
```

Stop and remove only the container. The `rustfs-data` volume remains intact:

```bash
docker stop rustfs
docker rm rustfs
```

Recreate the container with the original configuration and the target image:

```bash
docker run -d \
	--name rustfs \
	--restart unless-stopped \
	-p 9000:9000 \
	-p 9001:9001 \
	-v rustfs-data:/data \
	-e RUSTFS_ACCESS_KEY="<your-access-key>" \
	-e RUSTFS_SECRET_KEY="<your-secret-key>" \
	-e RUSTFS_CONSOLE_ENABLE=true \
	rustfs/rustfs:<target-version> \
	/data
```

Wait for the replacement container to become healthy:

```bash
docker ps --filter name=rustfs
docker logs rustfs
curl -fsS http://localhost:9000/health/ready
```

## Upgrade a Podman container

The Podman workflow is the same replacement operation, using the image name from the [Podman installation guide](/installation/container/podman).

```bash
podman inspect --format '{{.Config.Image}}' rustfs
podman pull docker.io/rustfs/rustfs:<target-version>
podman stop rustfs
podman rm rustfs
```

Recreate the container with the original configuration and persistent volume:

```bash
podman run -d \
	--name rustfs \
	-p 9000:9000 \
	-p 9001:9001 \
	-v rustfs-data:/data \
	-e RUSTFS_ACCESS_KEY="<your-access-key>" \
	-e RUSTFS_SECRET_KEY="<your-secret-key>" \
	-e RUSTFS_CONSOLE_ENABLE=true \
	docker.io/rustfs/rustfs:<target-version> \
	/data
```

Verify the replacement before continuing:

```bash
podman ps --filter name=rustfs
podman logs rustfs
curl -fsS http://localhost:9000/health/ready
```

## Upgrade with Docker Compose

Run Compose commands from the directory containing the deployment's `docker-compose.yml`. Before the upgrade, save the fully resolved configuration and confirm the current image:

```bash
docker compose config > docker-compose.resolved.yaml
docker compose images rustfs
```

Change the `rustfs` service to an explicit target image tag while leaving its volumes, environment, ports, and command unchanged:

```yaml title="docker-compose.yml"
services:
	rustfs:
		image: rustfs/rustfs:<target-version>
```

Validate the file, pull the target image, and recreate only the RustFS service. `--no-deps` leaves optional observability services running:

```bash
docker compose config --quiet
docker compose pull rustfs
docker compose up -d --no-deps rustfs
```

Check the service and the RustFS readiness endpoint:

```bash
docker compose ps rustfs
docker compose logs --tail=100 rustfs
curl -fsS http://localhost:9000/health/ready
```

If you started RustFS together with the `observability` profile, the RustFS service still upgrades with the same commands. Upgrade observability images separately according to each component's release notes.

## Upgrade a multi-node deployment

Replace one RustFS node at a time. Wait for the upgraded node's readiness endpoint to succeed and confirm cluster status before proceeding to the next node. Do not recreate all nodes simultaneously.

Use the same Docker, Podman, or Compose workflow on each node, preserving that node's existing mounts and configuration.

## Roll back

For Docker or Podman, stop and remove the failed replacement container, then repeat the corresponding `run` command with the previously recorded image tag. Keep the same persistent volume and runtime configuration.

For Docker Compose, restore the previous `image` value in `docker-compose.yml`, then recreate the RustFS service:

```bash
docker compose pull rustfs
docker compose up -d --no-deps rustfs
curl -fsS http://localhost:9000/health/ready
```

In a multi-node deployment, roll back one node at a time and wait for readiness before continuing.

## Next steps

Review [Status Check](/operations/status-check) for additional post-upgrade validation.