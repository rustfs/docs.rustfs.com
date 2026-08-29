---
title: "Podman"
description: "Run a single-node RustFS instance with Podman and persistent container storage."
---

Podman can run the official RustFS Open Container Initiative (OCI) image without a daemon. You need a working Podman installation and permission to create containers.

The image runs as the non-root user `rustfs` (`10001:10001`) and writes logs to `/logs` by default. Do not set `RUSTFS_OBS_LOG_DIRECTORY` to `/var/log/rustfs/`: that path is for Linux package installs, and the container user cannot create it.

## 1. Pull the image

```bash
podman pull docker.io/rustfs/rustfs:latest
```

## 2. Create persistent storage

Create named volumes so object data and logs remain available when you replace the container:

```bash
podman volume create rustfs-data
podman volume create rustfs-logs
```

Named volumes mounted at `/data` and `/logs` inherit the image's `10001:10001` ownership.

:::warning[Bind mounts need UID 10001]

If you bind-mount host directories instead of named volumes, create them first. Podman can adjust ownership with the `:U` mount option; `:Z` is required on SELinux hosts:

```bash
mkdir -p data logs
podman run -d \
  --name rustfs \
  -p 9000:9000 \
  -p 9001:9001 \
  -v "$(pwd)/data":/data:Z,U \
  -v "$(pwd)/logs":/logs:Z,U \
  -e RUSTFS_ACCESS_KEY="<your-access-key>" \
  -e RUSTFS_SECRET_KEY="<your-secret-key>" \
  docker.io/rustfs/rustfs:latest \
  /data
```

If you do not use `:U`, run `sudo chown -R 10001:10001 data logs` before starting the container. Every bind-mounted path (data, logs, and TLS certificates when `RUSTFS_TLS_PATH` is set) must be writable by `10001:10001`.

:::

## 3. Start RustFS

Replace the credential placeholders before running the container:

```bash
podman run -d \
  --name rustfs \
  -p 9000:9000 \
  -p 9001:9001 \
  -v rustfs-data:/data \
  -v rustfs-logs:/logs \
  -e RUSTFS_ACCESS_KEY="<your-access-key>" \
  -e RUSTFS_SECRET_KEY="<your-secret-key>" \
  -e RUSTFS_ADDRESS=":9000" \
  -e RUSTFS_CONSOLE_ADDRESS=":9001" \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_OBS_LOGGER_LEVEL=error \
  -e RUSTFS_OBS_LOG_DIRECTORY="/logs" \
  docker.io/rustfs/rustfs:latest \
  /data
```

:::warning[Set credentials when creating the container]

Set unique `RUSTFS_ACCESS_KEY` and `RUSTFS_SECRET_KEY` environment variables before exposing RustFS to a network. Do not use the well-known `rustfsadmin` value for either credential. If the container was started without custom credentials, stop and recreate it with both `-e` options shown above; the `rustfs-data` and `rustfs-logs` volumes remain intact.

:::

## 4. Verify the deployment

Check the container and the S3 API health endpoint:

```bash
podman ps --filter name=rustfs
curl --fail http://localhost:9000/health
```

The S3 API is available at `http://localhost:9000`, and the Console is available at `http://localhost:9001`.

## Next steps

- [RustFS Console](/administration/console)
- [Configure an S3 client](../../developer/examples/aws-cli.md)
- [TLS configuration](../../integration/tls-configured.md)
