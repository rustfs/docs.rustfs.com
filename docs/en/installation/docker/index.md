---
title: "Installing RustFS with Docker"
description: "RustFS Docker deployment."
---

# Installing RustFS with Docker

RustFS is a high-performance, 100% S3-compatible open-source distributed object storage system. In single-node single-disk (SNSD) deployment mode, the backend uses zero erasure coding without additional data redundancy, suitable for local testing and small-scale scenarios.
This article is based on RustFS official Linux binary packages, packaging RustFS and its runtime environment into containers through custom Dockerfile, and configuring data volumes and environment variables for one-click service startup.

---

## 1. Prerequisites

1. **Host Requirements**

 * Docker installed (≥ 20.10) and able to pull images and run containers normally
 * Local path `/mnt/rustfs/data` (or custom path) for mounting object data
2. **Network and Firewall**

 * Ensure host port 9000 is open to external access (or consistent with custom port)
3. **Configuration File Preparation**

 * Define listening port, admin account, data path, etc. in host `/etc/rustfs/config.toml` (see Section 4 for details)

---

## 2. Quick Pull of RustFS Official Image

Use official Ubuntu base image to quickly pull RustFS official image:

```bash
docker pull rustfs/rustfs
```

---



## 3. Run RustFS Container

RustFS SNSD Docker running method, combining the above image and configuration, execute:

```bash
 docker run -d \
  --name rustfs_local \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  rustfs/rustfs:latest \
  /data
```

Parameter descriptions:

* `-p 9000:9000`: Map host port 9000 to container
* `-v /mnt/rustfs/data:/data`: Mount data volume
* `--name rustfs_local`: Custom container name
* `-d`: Run in background

---

### Complete Parameter Configuration Example

```bash
docker run -d \
  --name rustfs_container \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY=rustfsadmin \
  -e RUSTFS_SECRET_KEY=rustfsadmin \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_SERVER_DOMAINS=example.com \
  rustfs/rustfs:latest \
  --address :9000 \
  --console-enable \
  --server-domains example.com \
  --access-key rustfsadmin \
  --secret-key rustfsadmin \
  /data
```

### Parameter Description and Corresponding Methods

1. **Environment Variable Method** (Recommended):
   ```bash
   -e RUSTFS_ADDRESS=:9000 \
   -e RUSTFS_SERVER_DOMAINS=example.com \
   -e RUSTFS_ACCESS_KEY=rustfsadmin \
   -e RUSTFS_SECRET_KEY=rustfsadmin \
   -e RUSTFS_CONSOLE_ENABLE=true \
   ```

2. **Command Line Parameter Method**:
   ```
   --address :9000 \
   --server-domains example.com \
   --access-key rustfsadmin \
   --secret-key rustfsadmin \
   --console-enable \
   ```

3. **Required Parameters**:
    - `<VOLUMES>`: Specify at the end of command, such as `/data`

### Common Configuration Combinations

1. **Basic Configuration**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     rustfs/rustfs:latest \
     /data
   ```

2. **Enable Console**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_CONSOLE_ENABLE=true \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --console-enable \
     /data
   ```

3. **Custom Authentication Keys**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_ACCESS_KEY=rustfsadmin \
     -e RUSTFS_SECRET_KEY=rustfsadmin \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --access-key rustfsadmin \
     --secret-key rustfsadmin \
     /data
   ```

### Important Notes

1. Port mapping must correspond:
    - Service port defaults to 9000 (`-p 9000:9000`)

2. Data volumes must be persistent:
    - `-v /host/path:/container/path`

3. Environment variables and command line parameters can be mixed, but command line parameters have higher priority

4. If [using TLS](../../integration/tls-configured.md), additional certificate path mounting is needed:

   ```bash
   -v /path/to/certs:/certs \
   -e RUSTFS_TLS_PATH=/certs \
   ```

### Docker Compose Installation

RustFS officially provides a Docker Compose installation method. The [`docker-compose.yml`](https://github.com/rustfs/rustfs/blob/main/docker-compose.yml) file includes multiple services, such as `grafana`, `prometheus`, `otel-collector`, and `jaeger`, mainly for observability. If you want to deploy these services together, clone the [RustFS code repository](https://github.com/rustfs/rustfs) locally,

```
git clone git@github.com:rustfs/rustfs.git
```

Running the command under root directory,

```
docker compose --profile observability up -d
```

Started containers is as below,

```
CONTAINER ID   IMAGE                                             COMMAND                  CREATED         STATUS                            PORTS                                                                                                                                     NAMES
c13c23fe3d9d   rustfs/rustfs:latest                              "/entrypoint.sh rust…"   6 seconds ago   Up 5 seconds (health: starting)   0.0.0.0:9000-9001->9000-9001/tcp, :::9000-9001->9000-9001/tcp                                                                             rustfs-server
e3f4fc4a83a2   grafana/grafana:latest                            "/run.sh"                7 seconds ago   Up 5 seconds                      0.0.0.0:3000->3000/tcp, :::3000->3000/tcp                                                                                                 grafana
71ef1b8212cf   prom/prometheus:latest                            "/bin/prometheus --c…"   7 seconds ago   Up 5 seconds                      0.0.0.0:9090->9090/tcp, :::9090->9090/tcp                                                                                                 prometheus
e7db806b2d6f   jaegertracing/all-in-one:latest                   "/go/bin/all-in-one-…"   7 seconds ago   Up 5 seconds                      4317-4318/tcp, 9411/tcp, 0.0.0.0:14250->14250/tcp, :::14250->14250/tcp, 14268/tcp, 0.0.0.0:16686->16686/tcp, :::16686->16686/tcp          jaeger
1897830a2f1e   otel/opentelemetry-collector-contrib:latest       "/otelcol-contrib --…"   7 seconds ago   Up 5 seconds                      0.0.0.0:4317-4318->4317-4318/tcp, :::4317-4318->4317-4318/tcp, 0.0.0.0:8888-8889->8888-8889/tcp, :::8888-8889->8888-8889/tcp, 55679/tcp   otel-collector
```

If you only want to install rustfs, do not want to deploy grafana,prometheus,etc, please comment below lines in `docker-compose.yml` file,

```
#depends_on:
#  - otel-collector
```

Then, run the command,

```
docker compose -f docker-compose.yml up -d rustfs
```

This way will only install and start `rustfs-server` service, namely rustfs container,

```
docker ps
CONTAINER ID   IMAGE                                             COMMAND                  CREATED         STATUS                           PORTS                                                           NAMES
e07121ecdd39   rustfs/rustfs:latest                              "/entrypoint.sh rust…"   2 seconds ago   Up 1 second (health: starting)   0.0.0.0:9000-9001->9000-9001/tcp, :::9000-9001->9000-9001/tcp   rustfs-server
```

Whether you start only the `rustfs-server` or together with observability services, you can access the RustFS instance via `http://localhost:9000` using the default username and password (`rustfsadmin` for both).

## 4. Verification and Access

1. **View Container Status and Logs:**

 ```bash
 docker logs rustfs_local
 ```

 Logs should show successful service startup and listening on port 9000.

2. **Test S3 API:**

 Use `mc` or other S3 clients:

 ```bash
 mc alias set rustfs http://localhost:9000 rustfsadmin ChangeMe123!
 mc mb rustfs/mybucket
 mc ls rustfs
 ```

 If buckets can be successfully created and listed, deployment is effective.

## 5. Other Recommendations

1. Production Environment Recommendations:
- Use multi-node deployment architecture
- [Enable TLS encrypted communication](../../integration/tls-configured.md)
- Configure log rotation strategy
- Set up regular backup strategy

2. Storage Recommendations:
- Use local SSD/NVMe storage
- Avoid using network file systems (NFS)
- Ensure storage directory exclusive access

---

## Summary

This article combines RustFS single-node single-disk containerization best practices, demonstrating in detail how to build RustFS images through Docker and deploy SNSD environments.
This solution is easy to quickly start and experiment with, and can later be extended to multi-node multi-disk production-level clusters on platforms like Kubernetes, Swarm, etc. using the same approach.
