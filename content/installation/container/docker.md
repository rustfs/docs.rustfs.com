---
title: "Docker"
description: "Run a single-node RustFS instance with Docker and persistent container storage."
---

Use the official RustFS image to start a single-node instance with persistent storage. You need a working Docker Engine and permission to run containers.

## 1. Pull the image

```bash
docker pull rustfs/rustfs:latest
```

## 2. Create persistent storage

Create a named volume so object data remains available when you replace the container:

```bash
docker volume create rustfs-data
```

## 3. Start RustFS

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
  -e RUSTFS_CONSOLE_ENABLE=true \
  rustfs/rustfs:latest \
  /data
```

:::warning[Set credentials when creating the container]

Set unique `RUSTFS_ACCESS_KEY` and `RUSTFS_SECRET_KEY` environment variables before exposing RustFS to a network. Do not use the well-known `rustfsadmin` value for either credential. If the container was started without custom credentials, stop and recreate it with both `-e` options shown above; the `rustfs-data` volume remains intact.

:::

## 4. Verify the deployment

Check the container and the S3 API health endpoint:

```bash
docker ps --filter name=rustfs
curl --fail http://localhost:9000/health
```

The S3 API is available at `http://localhost:9000`, and the Console is available at `http://localhost:9001`.

## Next steps

- [RustFS Console](/administration/console)
- [Configure an S3 client](../../developer/examples/aws-cli.md)
- [TLS configuration](../../integration/tls-configured.md)