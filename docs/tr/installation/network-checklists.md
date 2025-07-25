---
title: "Network Checklist"
description: "RustFS Enterprise Deployment Network Checklist"
---

# Network Checklist

## 1. Network Architecture Design

### Basic Network Planning

- **Topology Structure Verification**
 Confirm whether the deployment architecture (star/ring/mesh) meets the high availability requirements of distributed storage
- **Redundant Path Check**
 Ensure at least two independent physical links exist between nodes
- **Bandwidth Planning**
 Calculate estimated traffic: Object storage read/write bandwidth × Number of nodes × Number of replicas + 20% redundancy

### IP Planning

- [ ] Separate management network from data network
- [ ] Assign consecutive IP segments for storage nodes (recommend /24 subnet)
- [ ] Reserve at least 15% of IP addresses for expansion

---

## 2. Hardware Equipment Requirements

### Switch Configuration

| Check Item | Standard Requirements |
|--------|---------|
| Backplane Bandwidth | ≥ Full port line-speed forwarding capacity × 1.2 |
| Port Type | 10G/25G/100G SFP+/QSFP+ fiber ports |
| Flow Table Capacity | ≥ Number of nodes × 5 |
| Spanning Tree Protocol | Enable RSTP/MSTP fast convergence |

### Physical Connections

- [ ] Fiber attenuation test (single-mode ≤0.35dB/km)
- [ ] Port misalignment connection check (Node A eth0 ↔ Node B eth0)
- [ ] Cable labeling system (including source/destination IP + port number)

---

## 3. Operating System Network Configuration

### Kernel Parameter Tuning

```bash
# Check the following parameter settings
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_slow_start_after_idle = 0
```

### Network Card Configuration

- [ ] Enable jumbo frames (MTU=9000, requires full path support)
- [ ] Verify network card bonding mode (LACP mode4 recommended)
- [ ] Disable IPv6 (if not needed)

---

## 4. Security Policies

### Firewall Rules

```bash
# Required open ports
- TCP 443 (HTTPS API)
- TCP 9000 (S3 compatible interface)
- TCP 7946 (Serf node communication)
- UDP 4789 (VxLAN tunnel)
```

### Access Control

- Switch port security MAC limitation
- IPSec tunnel encryption between storage nodes
- Enable TLS 1.3 for management interface

---

## 5. Performance Verification Testing

### Benchmark Test Items

1. Inter-node latency test: `iperf3 -s 8972 <target IP>`
2. Cross-rack bandwidth test: `iperf3 -c <target IP> -P 8 -t 30`
3. Failover test: Randomly disconnect core links and observe recovery time

### Acceptance Standards

| Metric | Requirements |
|------|------|
| Node Latency | ≤1ms (same data center)/≤5ms (cross AZ) |
| Bandwidth Utilization | Peak ≤70% design capacity |
| Failover | <500ms BPDU convergence |

---

## 6. Documentation Requirements

1. Network topology diagram (including physical connections and logical IPs)
2. Switch configuration backup files (with timestamps)
3. Baseline test reports (with raw data)
4. Change record table (with maintenance window information)

> **Tip**: It is recommended to conduct 72-hour stress testing before formal deployment, simulating 110% of peak traffic load scenarios

This checklist covers key checkpoints for enterprise-level storage system network deployment, specifically optimized for distributed object storage characteristics. You can contact RustFS for official technical support.
