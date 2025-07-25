---
title: "Node Failure"
description: "Complete steps for handling node failures in RustFS clusters. Includes: replacement node hardware preparation, configuration updates, service deployment, rejoining the cluster, data healing, and subsequent checks and best practices."
---

# Node Failure

In distributed RustFS clusters, erasure coding mechanisms are employed to ensure read/write access during partial node failures and automatic data healing when nodes rejoin. This document will guide you through the following process:

1. Start replacement node and synchronize environment
2. Update DNS/hostname to point old node identity to new node
3. Download and deploy RustFS service consistent with cluster
4. Rejoin new node to cluster and trigger data healing
5. Monitor healing progress and perform subsequent checks and optimization

## 1) Start Replacement Node

* **Hardware and System Preparation**
 Ensure the replacement node's server hardware is roughly consistent with the failed node, including CPU, memory, network configuration, and disk types; even using higher specifications won't affect cluster performance.
 Software environment needs to maintain version consistency with other nodes (operating system, kernel, dependency libraries, etc.) to avoid cluster abnormal behavior due to environment differences.

* **Exclusive Drive Access**
 Like operations on physical drives, RustFS requires exclusive access to storage volumes, prohibiting any other processes or scripts from directly modifying data within storage volumes, otherwise it can easily cause data corruption or redundancy loss.

## 2) Update Hostname and Network Resolution

* **DNS/Hosts Configuration**
 If the replacement node's IP address differs from the failed node, you need to re-resolve the old node's hostname (e.g., `rustfs-node-2.example.net`) to the new node to ensure nodes within the cluster discover each other through the same address.

 ```bash
 # Example: Add or modify line in /etc/hosts
 192.168.1.12 rustfs-node-2.example.net
 ```

 After correct resolution, verify the hostname points to the new node via `ping` or `nslookup`.

## 3) Deploy and Configure RustFS Service

* **Download and Installation**
 Following the official RustFS deployment process for the same version, download binaries or installation packages consistent with existing nodes and extract to unified directory. Ensure startup scripts, environment variables, and configuration files (such as `/etc/default/rustfs`) are completely consistent with other nodes in the cluster.

* **Configuration Verification**

* Check if the cluster node list (endpoints) in `config.yaml` includes the new node's hostname and port.
* Ensure all nodes have the same access keys and permission configurations to avoid new node unable to join due to authentication failures.

## 4) Rejoin Cluster and Trigger Data Healing

* **Start Service**

 ```bash
 systemctl start rustfs-server
 ```

 Or use your custom startup script to start the RustFS service, and view startup logs via `journalctl -u rustfs-server -f` to confirm the new node has detected other online nodes and begun the data healing process.

* **Manual Monitoring of Healing Status**
 Use RustFS management tools (assuming command is `rustfs-admin`) to view cluster health and healing progress:

 ```bash
 # View cluster node status
 rc cluster status

 # Trigger data healing for new node
 rc heal --node rustfs-node-2.example.net

 # Real-time tracking of healing progress
 rc heal status --follow
 ```

 Here, the `heal` command is similar to RustFS's `rc admin heal`, ensuring all missing or inconsistent data shards are restored in the background.

* **Community Experience Reference**
 Community testing shows that when nodes go offline and then rejoin, RustFS will only perform healing operations on the new node without full cluster rebalancing, thus avoiding unnecessary network and I/O peaks.

## 5) Subsequent Checks and Best Practices

* **Monitoring and Alerting**

* During healing, monitor disk and network load to ensure the cluster meets read/write and network bandwidth requirements.
* Set up alerts to notify operations teams promptly when node healing fails or progress stalls beyond thresholds.

* **Repeated Failure Drills**
 Regularly simulate node failures and practice the entire recovery process to ensure team familiarity with operation commands and emergency procedures.

* **Root Cause Analysis**
 Conduct in-depth hardware health diagnostics (SMART, BIOS logs, etc.) for frequently failing nodes or disks and implement preventive maintenance plans.

* **Professional Support**
 For deeper failure localization and recovery guidance, contact the RustFS development team or community for assistance.

---

**Summary**: Through the above process, RustFS can quickly and safely replace nodes and complete data healing after complete node hardware failure, minimizing cluster availability interruption. Be sure to verify against your own environment and specific command-line tools to ensure configuration consistency and correct operation sequence.
