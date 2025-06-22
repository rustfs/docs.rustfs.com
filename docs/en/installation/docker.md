---
title: "Installing RustFS with Docker"
description: "RustFS Docker deployment guide."
---

# Installing RustFS with Docker

RustFS is a high-performance, 100% S3-compatible open-source distributed object storage system. In Single Node Single Drive (SNSD) deployment mode, the backend uses zero erasure coding without additional data redundancy, suitable for local testing and small-scale scenarios.
This document is based on the official RustFS Linux binary package, creating a custom Dockerfile to package RustFS and its runtime environment into a container, configuring data volumes and environment variables for one-click service startup.

---

## 1. Prerequisites

1. **Host Requirements**

   * Docker installed (≥ 20.10) with ability to pull images and run containers
   * Local path `/mnt/rustfs/data` (or custom path) for mounting object data

2. **Network & Firewall**

   * Ensure host port 7000 is open to external access (or consistent with custom port)

3. **Configuration File Preparation**

   * Define listening port, admin account, data path, etc. in `/etc/rustfs/config.toml` on the host (see Section 4)

---

## 2. Quick Pull of Official RustFS Image

Using the official Ubuntu base image, quickly pull the official RustFS image:

```bash
podman pull quay.io/rustfs/rustfs
```

Or use docker to pull:

```bash
podman pull docker://rustfs/rustfs
```

---

## 3. Writing Environment Configuration

Create configuration file `/etc/rustfs/config.toml` on the host, example content:

```bash
RUSTFS_ROOT_USER=rustfsadmin
RUSTFS_ROOT_PASSWORD=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":7000"
#RUSTFS_SERVER_DOMAINS="play.rustfs.com:7000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_CONSOLE_ADDRESS=":7001"
RUSTFS_OBS_CONFIG="/etc/default/obs.toml"
RUSTFS_TLS_PATH="/opt/tls"
```

> **Note:** For configuration item formats and default values, please refer to the official Linux installation documentation.

---

## 4. Running RustFS Container

RustFS SNSD Docker runtime method, combining the above image and configuration, execute:

```bash
podman run -d \
  --name rustfs_local \
  -p 7000:7000 \
  -v /mnt/rustfs/data:/data \
  -v /etc/rustfs/rustfs:/config/rustfs:ro \
  rustfs/rustfs:latest
```

Parameter descriptions:

* `-p 7000:7000`: Map host port 7000 to container
* `-v /mnt/rustfs/data:/data`: Mount data volume
* `-v /etc/rustfs/rustfs:/config/rustfs:ro`: Mount configuration file
* `--name rustfs_local`: Custom container name
* `-d`: Run in background

---

## 5. Verification and Access

1. **Check container status and logs:**

   ```bash
   docker logs rustfs_local
   ```

   Logs should show successful service startup and listening on port 7000.

2. **Test S3 API:**

   Using `mc` or other S3 clients:

   ```bash
   mc alias set rustfs http://localhost:7000 rustfsadmin ChangeMe123!
   mc mb rustfs/mybucket
   mc ls rustfs
   ```

   If you can successfully create and list buckets, the deployment is effective.

## 6. Additional Recommendations

1. Production environment recommendations:

- Use multi-node deployment architecture
* Enable TLS encrypted communication
* Configure log rotation policies
* Set up regular backup strategies

2. Storage recommendations:

- Use local SSD/NVMe storage
* Avoid using network file systems (NFS)
* Ensure exclusive access to storage directories

---

## Summary

This document combines RustFS single-node single-drive containerization best practices, demonstrating in detail how to build RustFS images through Docker and deploy SNSD environments.
This solution is easy to start quickly and experiment with, and can later be extended to multi-node multi-drive production-grade clusters using the same approach on platforms like Kubernetes and Swarm.
