---
title: "Node Failures"
description: "Prepare a replacement node, update its configuration, restore cluster membership, and verify data healing."
---

A distributed RustFS cluster uses erasure coding to stay readable and writable when some nodes fail, and it heals data automatically when a node rejoins. This guide walks you through the following steps:

1. Start the replacement node and match its software environment to the cluster.
2. Update DNS or `/etc/hosts` so that the old hostname resolves to the new node.
3. Install the same RustFS version as the other nodes.
4. Start the replacement nodes so they rejoin the cluster and begin data healing.
5. Monitor healing progress, then run follow-up checks.

## 1. Prepare the replacement node

* **Hardware and System Preparation**
  Make sure that the replacement node's hardware (CPU, memory, network, and disk type) roughly matches the failed node. Using higher-spec hardware does not affect cluster performance.
  Use software versions that match the other nodes, including the operating system, kernel, and dependencies, to avoid problems caused by inconsistent environments.

* **Exclusive access to drives**
  As with physical drive operations, RustFS requires exclusive access to its storage volumes. Do not let other processes or scripts modify data on these volumes directly, as this can corrupt data or reduce redundancy.

## 2. Update hostname and network resolution

* **DNS/Hosts Configuration**
  If the replacement node's IP address differs from the failed node, point the old node's hostname (for example, `rustfs-node-2.example.net`) to the new node's IP address so that cluster nodes can still reach each other by the same name.

 ```bash
 # Example: Add or modify line in /etc/hosts
 192.168.1.12 rustfs-node-2.example.net
 ```

  Use `ping` or `nslookup` to verify that the hostname resolves to the new node.

## 3. Deploy and configure RustFS services

* **Download and Installation**
  Install the same RustFS version as the existing nodes, using the same installation method and directory. Make sure that startup scripts, environment variables, and configuration files (such as `/etc/default/rustfs`) are identical to those on the other nodes.

* **Configuration Verification**

 * Check that `RUSTFS_VOLUMES` in `/etc/default/rustfs` is byte-for-byte identical to the other nodes, and that it covers the replacement node's hostname and port.
 * Make sure that all nodes use the same access keys and permission settings; otherwise, the new node fails to authenticate and cannot join the cluster.

## 4. Rejoin the cluster and trigger data healing

* **Start Service**

 ```bash
 systemctl start rustfs
 ```

  Alternatively, start RustFS with your own startup script. Then run `journalctl -u rustfs -f` to confirm that the new node has detected the other nodes and started healing.

* **Monitor Healing Status**
  Healing runs in the background once the node rejoins; no manual command is required. Watch its progress through the service logs on the replacement node, and check node and disk status in the RustFS Console:

 ```bash
 journalctl -u rustfs -f
 ```

* **Community observations**
  In community testing, when a node goes offline and rejoins, RustFS heals only that node instead of rebalancing the entire cluster. This avoids unnecessary network and I/O spikes.

## 5. Follow-up checks and best practices

* **Monitoring and Alerts**

 * During healing, monitor disk and network load to make sure the cluster still meets its read, write, and bandwidth requirements.
 * Set up alerts to notify operations teams when node healing fails or progress stalls beyond thresholds.

* **Regular failure testing**
  Run regular node failure drills and practice the full recovery procedure so your team is familiar with the commands and incident response process.

* **Root Cause Analysis**
  Run detailed hardware diagnostics (for example, SMART data and BIOS logs) on nodes or disks that fail repeatedly, and put a preventive maintenance plan in place.

* **Professional Support**
  For help diagnosing the cause of a failure or recovering the cluster, contact the RustFS development team or community.

---

These steps replace a failed node and heal its data. Adapt the commands to your environment, and keep the configuration identical across nodes.
