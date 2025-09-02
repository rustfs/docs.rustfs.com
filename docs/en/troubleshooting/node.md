---
title: "Node Failures"
description: "Complete steps for handling node failures in RustFS clusters. Mainly includes: replacement node hardware preparation, configuration updates, service deployment, rejoining the cluster, data healing, and subsequent checks and best practices."
---

# RustFS Node Failure Troubleshooting Guide

In distributed RustFS clusters, erasure coding mechanisms are adopted to ensure read/write access can still be provided when some nodes fail, and automatic data healing occurs after nodes rejoin. This document will guide you through the following process:

1. Start replacement node and synchronize environment
2. Update DNS/hostname to point old node identifiers to new nodes
3. Download and deploy RustFS services consistent with the cluster
4. Rejoin new nodes to the cluster and trigger data healing
5. Monitor healing progress and perform subsequent checks and optimization

## 1) Start Replacement Node

* **Hardware and System Preparation**
  Ensure the replacement node server hardware is roughly consistent with the failed node, including CPU, memory, network configuration, and disk type; even using higher configurations won't affect cluster performance.
  Software environment needs to maintain version consistency with other nodes (operating system, kernel, dependency libraries, etc.) to avoid cluster abnormal behavior caused by environment differences.

* **Drive Exclusive Access**
  As with physical drive operations, RustFS requires exclusive access to storage volumes, prohibiting any other processes or scripts from directly modifying data within storage volumes, otherwise data corruption or redundancy loss can easily occur.

## 2) Update Hostname and Network Resolution

* **DNS/Hosts Configuration**
  If the replacement node's IP address differs from the failed node, you need to re-resolve the old node's hostname (such as `rustfs-node-2.example.net`) to the new node to ensure nodes within the cluster discover each other through the same address.

 ```bash
 # Example: Add or modify line in /etc/hosts
 192.168.1.12 rustfs-node-2.example.net
 ```

  After correct resolution, you can verify the hostname points to the new node through `ping` or `nslookup`.

## 3) Deploy and Configure RustFS Services

* **Download and Installation**
  Follow the same version deployment process as RustFS official, download binaries or installation packages consistent with existing nodes, and extract to a unified directory. Ensure startup scripts, environment variables, and configuration files (such as `/etc/default/rustfs`) are completely consistent with other nodes in the cluster.

* **Configuration Verification**

 * Check whether the cluster node list (endpoints) in `config.yaml` includes the new node's hostname and port.
 * Ensure all nodes have the same access keys and permission configurations to avoid new nodes being unable to join due to authentication failures.

## 4) Rejoin Cluster and Trigger Data Healing

* **Start Service**

 ```bash
 systemctl start rustfs-server
 ```

  Or use your custom startup script to start RustFS services, and view startup logs through `journalctl -u rustfs-server -f` to confirm the new node has detected other online nodes and started the data healing process.

* **Manually Monitor Healing Status**
  Use RustFS management tools (assuming the command is `rustfs-admin`) to view cluster health and healing progress:

 ```bash
 # View cluster node status
 rc cluster status

 # Trigger data healing for new node
 rc heal --node rustfs-node-2.example.net

 # Real-time tracking of healing progress
 rc heal status --follow
 ```

  Among them, the `heal` command is similar to RustFS's `rc admin heal`, ensuring all lost or inconsistent data shards are restored in the background.

* **Community Experience Reference**
  Community testing shows that when nodes go offline and rejoin, RustFS will only perform healing operations on new nodes, not fully rebalance the cluster, thus avoiding unnecessary network and I/O peaks.

## 5) Subsequent Checks and Best Practices

* **Monitoring and Alerts**

 * During healing, monitor disk and network load to ensure the cluster meets read/write and network bandwidth requirements.
 * Set up alerts to notify operations teams when node healing fails or progress stalls beyond thresholds.

* **Repeated Failure Drills**
  Regularly simulate node failures and drill the entire recovery process to ensure team familiarity with operation commands and emergency procedures.

* **Root Cause Analysis**
  Conduct in-depth hardware health diagnostics (SMART, BIOS logs, etc.) on frequently failing nodes or disks, and implement preventive maintenance plans.

* **Professional Support**
  If deeper-level fault location and recovery guidance is needed, contact the RustFS development team or community for help.

---

**Summary**: Through the above process, RustFS can quickly and safely replace nodes and complete data healing after node hardware completely fails, minimizing cluster availability interruptions. Be sure to cross-reference with your own environment and specific command-line tools to ensure configuration consistency and correct operation sequence.
