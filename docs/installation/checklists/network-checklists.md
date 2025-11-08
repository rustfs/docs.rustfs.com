---
title: "Network Checklist"
description: "RustFS enterprise deployment network checklist"
---

# Network Checklist

## 1. Network Architecture Design

### Basic Network Planning

- **Topology Structure Verification**
 Confirm whether the deployment architecture (star/ring/mesh) meets the high availability requirements of distributed storage
- **Redundant Path Check**
 Ensure at least two independent physical links exist between nodes
- **Bandwidth Planning**
 Calculate estimated traffic: object storage read/write bandwidth × node count × replica count + 20% redundancy

### IP Planning

- [ ] Separate management network from data network
- [ ] Allocate continuous IP segments for storage nodes (recommend /24 subnet)
- [ ] Reserve at least 15% of IP addresses for expansion

---

## 2. Hardware Device Requirements

### Switch Configuration

| Check Item | Standard Requirements |
|--------|---------|
| Backplane Bandwidth | ≥ Full port line rate forwarding capability × 1.2 |
| Port Type | 10G/25G/100G SFP+/QSFP+ fiber ports |
| Flow Table Capacity | ≥ Node count × 5 |
| Spanning Tree Protocol | Enable RSTP/MSTP fast convergence |

### Physical Connections

- [ ] Fiber attenuation test (single mode ≤0.35dB/km)
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
- [ ] Verify network card bonding mode (recommend LACP mode4)
- [ ] Disable IPv6 (if not needed)

---

## 4. Security Policies

### Firewall Rules

```bash
# Necessary open ports
- TCP 443 (HTTPS API)
- TCP 9000 (S3 compatible interface)
- TCP 7946 (Serf node communication)
- UDP 4789 (VxLAN tunnel)
```

### Access Control

- Switch port security MAC restrictions
- IPSec tunnel encryption between storage nodes
- Enable TLS 1.3 for management interfaces

---

## 5. Performance Verification Testing

### Benchmark Test Items

1. Inter-node latency test: `iperf3 -s 8972 <target IP>`
2. Cross-rack bandwidth test: `iperf3 -c <target IP> -P 8 -t 30`
3. Failover test: Randomly disconnect core links to observe recovery time

### Acceptance Criteria

| Metric | Requirements |
|------|------|
| Node Latency | ≤1ms (same room) / ≤5ms (cross AZ) |
| Bandwidth Utilization | Peak ≤70% of design capacity |
| Failover | Less than 500ms BPDU convergence |

---

## 6. Documentation Requirements

1. Network topology diagram (including physical connections and logical IPs)
2. Switch configuration backup files (with timestamps)
3. Baseline test reports (including raw data)
4. Change record table (including maintenance window information)

> **Tip**: Recommend conducting 72-hour stress testing before formal deployment, simulating 110% peak traffic load scenarios

This checklist covers key checkpoints for enterprise storage system network deployment, specifically optimized parameter requirements for distributed object storage characteristics. You can contact RustFS for official technical support.
