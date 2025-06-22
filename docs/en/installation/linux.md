---
title: "Installing RustFS on Linux"
description: "Quick guide for installing RustFS on Linux operating systems"
---

# Installing RustFS on Linux

## 1. Pre-Installation Reading

This page contains complete documentation and instructions for all three installation modes of RustFS. Among them, the multi-machine multi-disk mode includes enterprise-level performance, security, and scalability. It also provides architecture diagrams needed for production workloads.
Before installation, please read our startup modes and checklists:

1. Startup modes: Clarify your Linux startup mode beforehand;

2. Checklists: Check whether various indicators meet production guidance characteristics. If production standards are not required, you may skip this guidance;

## 2. Prerequisites

1. Operating system version;
2. Firewall;
3. Hostname;
4. Memory requirements;
5. Time synchronization;
6. Capacity planning;
7. Disk planning;
8. Data tiering planning.

### 2.1. Operating System Version

We recommend Linux kernel version 4.x and above, but versions 5.x and above can achieve better IO throughput and network performance.

You can use Ubuntu 20.04 and RHEL 8.x to install RustFS.

### 2.2 Firewall

Linux systems have firewalls enabled by default. You can check the firewall status using the following command:

```bash
systemctl status firewalld
```

If your firewall status is "active", you can disable the firewall using the following commands:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

Or allow RustFS port 9000:

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --reload
```

All RustFS servers in the deployment **must** use the same listening port. If you're using port 9000, all other servers must also use port 9000.

### 2.3 Hostname

Creating a RustFS cluster requires using **consistent, continuous** hostnames. There are two ways to achieve continuous hostnames:

1. DNS configuration;
2. HOSTS configuration.

```bash
vim /etc/hosts
127.0.0.1 localhost localhost.localdomain localhost4 localhost4.localdomain4
::1 localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.1.1 node1
192.168.1.2 node2
192.168.1.3 node3
192.168.1.4 node4
```

### 2.4 Memory Requirements

RustFS requires at least 2 GB of memory to run in test environments, with a minimum of 64 GB of memory required for production environments.

### 2.5 Time Synchronization

Multi-node consistency requires using time servers to maintain time consistency, otherwise service startup failures may occur. Related time servers include `ntp`, `timedatectl`, or `timesyncd`.

RustFS requires time synchronization. You can check time synchronization status using the following command:

```bash
timedatectl status
```

If the status is "synchronized", time synchronization is normal.

## 3. Configure Username

For RustFS startup, we recommend configuring a dedicated user without login privileges to start the RustFS service. In the rustfs.service startup control script, the default user and user group are `rustfs-user` and `rustfs-user`.

You can use the groupadd and useradd commands to create users and groups. The following example creates users, groups, and sets permissions to access RustFS-specified data directories.

## 4. Download Installation Package

Please first install wget or curl to download the rustfs installation package.

```bash
# Download address
wget https://dl.rustfs.com/rustfs/rustfs
chmod +x rustfs
mv rustfs /usr/local/bin/
```

## 5. Configure Environment Variables

1. Create configuration file

```bash
sudo tee /etc/default/rustfs <<EOF
RUSTFS_ROOT_USER=rustfsadmin
RUSTFS_ROOT_PASSWORD=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":7000"
#RUSTFS_SERVER_DOMAINS="play.rustfs.com:7000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_CONSOLE_ADDRESS=":7001"
RUSTFS_OBS_CONFIG="/etc/default/obs.toml"
RUSTFS_TLS_PATH="/opt/tls"
EOF
```

2. Create storage directories

```bash
sudo mkdir -p /data/rustfs{0..3} /var/logs/rustfs /opt/tls
sudo chmod -R 750 /data/rustfs* /var/logs/rustfs
```

## 6. Configure Observability System

1. Create observability configuration file

```bash
sudo tee /etc/default/obs.toml <<EOF
[observability]
endpoint = "http://localhost:4317"
use_stdout = false
sample_ratio = 2.0
meter_interval = 30
service_name = "rustfs"
service_version = "0.1.0"
environments = "production"
logger_level = "debug"
local_logging_enabled = true

[sinks]
[sinks.kafka]
enabled = false
bootstrap_servers = "localhost:9092"
topic = "logs"
batch_size = 100
batch_timeout_ms = 1000

[sinks.webhook]
enabled = false
endpoint = "http://localhost:8080/webhook"
auth_token = ""
batch_size = 100
batch_timeout_ms = 1000

[sinks.file]
enabled = true
path = "/var/logs/rustfs/app.log"
batch_size = 10
batch_timeout_ms = 1000

[logger]
queue_capacity = 10
EOF
```

2. Set up log rotation

```bash
sudo tee /etc/logrotate.d/rustfs <<EOF
/var/logs/rustfs/*.log {
  daily
  rotate 30
  compress
  delaycompress
  missingok
  notifempty
  create 644 rustfs-user rustfs-user
}
EOF
```

## 7. Start RustFS

```bash
# Start RustFS service
sudo systemctl start rustfs
sudo systemctl enable rustfs

# Check service status
sudo systemctl status rustfs
```

## 8. Verify Installation

Test the installation using the MinIO client:

```bash
# Install mc client
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/

# Configure alias
mc alias set rustfs http://localhost:7000 rustfsadmin rustfsadmin

# Test operations
mc mb rustfs/test-bucket
mc ls rustfs
```

If you can successfully create and list buckets, the installation is complete.
