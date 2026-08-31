---
title: "Docker"
description: "Run RustFS with Docker: single-node setup, host-directory permissions, Docker Compose, TLS, and multi-node deployment."
---

This page covers running the official RustFS image with Docker: a single-node instance with persistent storage, host-directory permissions for the non-root container user, Docker Compose with optional observability services, TLS, and a multi-node deployment. You need a working Docker Engine and permission to run containers.

## 1. Prerequisites

* Docker Engine (≥ 20.10) installed and able to pull images and run containers normally
* Host ports 9000 (S3 API) and 9001 (Console) available, or consistent with your custom ports
* If you bind-mount a host directory, the directory owner must match the container user — see [Bind-mount a host directory](#bind-mount-a-host-directory)

## 2. Pull the image

```bash
docker pull rustfs/rustfs:latest
```

## 3. Create persistent storage

Create a named volume so object data remains available when you replace the container:

```bash
docker volume create rustfs-data
```

## 4. Start RustFS

Replace the credential placeholders before running the container:

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

:::warning[Set credentials when creating the container]

Set unique `RUSTFS_ACCESS_KEY` and `RUSTFS_SECRET_KEY` environment variables before exposing RustFS to a network. Do not use the well-known `rustfsadmin` value for either credential. If the container was started without custom credentials, stop and recreate it with both `-e` options shown above; the `rustfs-data` volume remains intact.

:::

### Environment variables or command-line flags

The example above configures RustFS with environment variables. You can pass the same settings as command-line flags instead; when both are present, command-line flags win:

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

## 5. Bind-mount a host directory

The named volume above needs no extra setup. If you mount a host directory instead (`-v /path/on/host:/data`), keep in mind that the container runs as non-root user `rustfs` with id `10001`. Make the host directory owned by `10001`, otherwise you will encounter permission denied errors:

```bash
chown -R 10001:10001 /path/to/host_directory
```

## 6. Verify the deployment

Check the container and the S3 API health endpoint:

```bash
docker ps --filter name=rustfs
curl --fail http://localhost:9000/health
```

The S3 API is available at `http://localhost:9000`, and the Console is available at `http://localhost:9001`.

## Docker Compose

The RustFS repository ships a [`docker-compose.yml`](https://github.com/rustfs/rustfs/blob/main/docker-compose.yml) that includes `grafana`, `prometheus`, `otel-collector`, and `jaeger` services, mainly for observability. To deploy RustFS together with these services, clone the [RustFS code repository](https://github.com/rustfs/rustfs) locally:

```bash
git clone https://github.com/rustfs/rustfs.git
```

Run the command from the repository root:

```bash
docker compose --profile observability up -d
```

The compose file uses an initialization container to grant the correct access rights to `rustfs`: the `rustfs_perms` service below changes the ownership of the mounted volumes to `10001` before `rustfs` starts, using `depends_on` to wait for it to complete. To keep logs persistent and accessible, the host log directory is mapped to the container's `/var/log/rustfs/` path:

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

If you only want RustFS without Grafana, Prometheus, and the other observability services, start just the `rustfs` service (the compose file marks the collector dependency as optional):

```bash
docker compose -f docker-compose.yml up -d rustfs
```

This starts only the `rustfs-server` container. Whether you start only `rustfs-server` or the full stack, the S3 API is served at `http://localhost:9000`, and the RustFS Console is at `http://localhost:9001`. Open the Console in a browser and log in with the access key and secret key you configured above. Generate a strong secret with, for example, `openssl rand -base64 24`, and never ship the placeholder values to production.

For Docker Compose, define unique `RUSTFS_ACCESS_KEY` and `RUSTFS_SECRET_KEY` values in the `rustfs` service environment or in the environment file used for variable substitution, then recreate the service with `docker compose up -d rustfs`.

## Multi-node deployment

Docker's default bridge networking does not support multi-node deployments. Use `--network host` so each container can communicate directly with other nodes.

Run the following on **each node**:

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

Add the entries to `/etc/hosts` on **every** node:

```ini title="/etc/hosts"
192.168.1.1 node1
192.168.1.2 node2
192.168.1.3 node3
192.168.1.4 node4
```

## TLS configuration

If [using TLS](../../integration/tls-configured.md), mount the certificate directory and point RustFS at it:

```bash
-v /path/to/certs:/certs \
-e RUSTFS_TLS_PATH=/certs \
```

## Before production

Work through the [Pre-Installation Checklists](../requirement/checklists/index.md) — hardware, network, software, and security — before deploying to production. Use a multi-node deployment architecture, [enable TLS encrypted communication](../../integration/tls-configured.md), configure a log rotation strategy, and set up a regular backup strategy.

## Next steps

- [RustFS Console](/administration/console)
- [Configure an S3 client](../../developer/examples/aws-cli.md)
- [TLS configuration](../../integration/tls-configured.md)
