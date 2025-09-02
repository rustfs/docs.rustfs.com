---
title: "Availability and Scalability Description"
description: "This article will detail the technology and description related to RustFS scaling."
---

# Availability and Scalability Description

## Scaling Solution Overview

RustFS supports horizontal scaling by adding new storage pools (Server Pool). Each new storage pool must meet:

1. Nodes within the storage pool must use **consecutive hostnames** (e.g., node5-node8)
2. Single storage pool must use **same specifications** of disks (type/capacity/quantity)
3. New storage pools must maintain **time synchronization** and **network connectivity** with existing clusters

![RustFS Architecture Diagram](./images/s2-1.png)

---

## 1. Pre-Scaling Preparation

### 1.1 Hardware Planning Requirements

| Item | Minimum Requirements | Recommended Production Configuration |
|---------------|---------------------------|---------------------------|
| Node Count | 4 nodes/storage pool | 4 - 8 nodes/storage pool |
| Single Node Memory | 128 GB | 128 GB |
| Disk Type | SSD | NVMe SSD |
| Single Disk Capacity | ≥1 TB | ≥4 TB |
| Network Bandwidth | 10 Gbps | 25 Gbps |

### 1.2 System Environment Check

```bash
# Check hostname continuity (new node example)
cat /etc/hosts
192.168.10.5 node5
192.168.10.6 node6
192.168.10.7 node7
192.168.10.8 node8

# Verify time synchronization status
timedatectl status | grep synchronized

# Check firewall rules (all nodes need to open ports 7000/7001)
firewall-cmd --list-ports | grep 7000
```

---

## 2. Scaling Implementation Steps

### 2.1 New Node Basic Configuration

```bash
# Create dedicated user (execute on all new nodes)
groupadd rustfs-user
useradd -M -r -g rustfs-user rustfs-user

# Create storage directories (example with 8 disks)
mkdir -p /data/rustfs{0..7}
chown -R rustfs-user:rustfs-user /data/rustfs*
```

### 2.2 Install RustFS Service

```bash
# Download latest binary package (version must match existing cluster)
wget https://dl.rustfs.com/rustfs/v2.3.0/rustfs -O /usr/local/bin/rustfs
chmod +x /usr/local/bin/rustfs

# Create configuration file (/etc/default/rustfs)
cat <<EOF > /etc/default/rustfs
RUSTFS_ROOT_USER=admin
RUSTFS_ROOT_PASSWORD=YourSecurePassword
RUSTFS_VOLUMES="/data/rustfs{0...7}"
RUSTFS_ADDRESS=":7000"
RUSTFS_CONSOLE_ADDRESS=":7001"
EOF
```

### 2.3 Cluster Scaling Operation

```bash
# Update configuration on all existing nodes (add new storage pool)
sed -i '/RUSTFS_VOLUMES/s|"$| http://node{5...8}:7000/data/rustfs{0...7}"|' /etc/default/rustfs

# Global service restart (execute simultaneously on all nodes)
systemctl restart rustfs.service
```

---

## 3. Post-Scaling Verification

### 3.1 Cluster Status Check

```bash
# Check node join status
curl -s http://node1:7001/cluster/nodes | jq .poolMembers

# Verify storage pool distribution
rc admin info cluster
```

### 3.2 Data Balance Verification

```bash
# View data distribution ratio (should be close to each storage pool capacity ratio)
watch -n 5 "rustfs-admin metrics | grep 'PoolUsagePercent'"
```

---

## 4. Important Notes

1. **Rolling Restart Prohibited**: Must restart all nodes simultaneously to avoid data inconsistency
2. **Capacity Planning Recommendation**: Should plan next scaling when storage usage reaches 70%
3. **Performance Tuning Recommendations**:

 ```bash
 # Adjust kernel parameters (all nodes)
 echo "vm.swappiness=10" >> /etc/sysctl.conf
 echo "net.core.somaxconn=32768" >> /etc/sysctl.conf
 sysctl -p
 ```

---

## 5. Troubleshooting Guide

| Symptom | Check Point | Fix Command |
|---------------------------|---------------------------------|-------------------------------|
| New nodes cannot join cluster | Check port 7000 connectivity | `telnet node5 7000` |
| Uneven data distribution | Check storage pool capacity configuration | `rustfs-admin rebalance start`|
| Console shows abnormal node status | Verify time synchronization status | `chronyc sources` |

> Note: This document is based on the latest RustFS version. Please perform full data backup before scaling operations. For production environments, it's recommended to contact RustFS technical support engineers for solution review.
