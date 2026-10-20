---
title: "RustFS Single Node Multiple Disk Installation"
description: "Install RustFS on a single server and distribute data across multiple disks."
---

In Single Node Multiple Disk (SNMD) mode, one server shards data across multiple data disks. Each object is split into K data shards and M parity shards (erasure coding), so the loss of up to M disks does not cause data loss.

:::warning[Single server]

SNMD is suitable for mid-sized, non-critical workloads. The deployment can lose up to M drives without losing data. If the entire server fails, or more than M drives fail, data is lost. Keep backups of important data. For node-level fault tolerance, use [MNMD](./multiple-node-multiple-disk.md).

:::

## Topology and planning

```mermaid
flowchart TD
    S[Server Node] --> D1[(Disk1)] & D2[(Disk2)] & D3[(Disk3)] & D4[(Disk4)]

    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;
    classDef disk fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;
    class S server
    class D1,D2,D3,D4 disk
```

- 1 server with multiple data disks (this example uses 4 disks mounted at `/data/rustfs0` through `/data/rustfs3`).
- Erasure coding spreads data and parity shards across the disks; fault tolerance is limited to disk failures within the single node.
- Format each disk with XFS and mount it separately (e.g., labels `RUSTFS0` – `RUSTFS3`), as described in the prerequisites page.
- For production deployments, also review the [Pre-Installation Checklists](../requirement/checklists/index.md).

## Prerequisites and service setup

Complete the [common prerequisites and service setup](./prerequisites-and-service.md) — operating system, firewall, time synchronization, disk formatting, service user, binary download, and systemd unit — then continue below.

## Configure environment variables

1. Create the configuration file. `RUSTFS_VOLUMES` uses brace expansion to enumerate the four disk mount points:

```ini title="/etc/default/rustfs"
# Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_CONSOLE_ADDRESS=":9001"
RUSTFS_OBS_LOGGER_LEVEL=error
RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"
```

2. Create the storage and log directories:

```bash
sudo mkdir -p /data/rustfs{0..3} /var/log/rustfs /opt/tls
sudo chmod -R 750 /data/rustfs* /var/log/rustfs
```

## Start and verify the service

1. Start the service and enable it to start at boot:

```bash
sudo systemctl enable --now rustfs
```

2. Verify the service status:

```bash
systemctl status rustfs
```

3. Check the service port:

```bash
netstat -ntpl
```

4. View log files:

```bash
tail -f /var/log/rustfs/rustfs*.log
```

5. Open the Console: in a browser, go to `http://<server-ip>:9001`. You should see:

![Console](./images/console.jpg)

## Next steps

- Need node-level fault tolerance and horizontal scalability? See [Multiple Node Multiple Disk Mode (MNMD)](./multiple-node-multiple-disk.md).
- Just experimenting? [Single Node Single Disk Mode (SNSD)](./single-node-single-disk.md) is simpler to set up.
