---
title: "Network Checklist"
description: "Network checklist for enterprise deployments."
---

# Network Checklist

## 1. Network Architecture

### Planning

- **Topology**
 Verify the architecture (star/ring/mesh) meets high availability requirements.
- **Redundancy**
 Ensure at least two independent physical links between nodes.
- **Bandwidth**
 Calculate estimated traffic: object storage read/write bandwidth × node count × replica count + 20% redundancy.

### IP Allocation

- [ ] Separate management network from data network.
- [ ] Allocate continuous IP segments for storage nodes (recommend /24 subnet).
- [ ] Reserve at least 15% of IP addresses for expansion.

---

## 2. Hardware Requirements

### Switches

| Check Item | Requirements |
|--------|---------|
| Backplane Bandwidth | ≥ Full port line rate forwarding capability × 1.2 |
| Port Type | 10G/25G/100G SFP+/QSFP+ fiber ports |
| Flow Table Capacity | ≥ Node count × 5 |
| Spanning Tree | Enable RSTP/MSTP fast convergence |

### Cabling

- [ ] Fiber attenuation test (single mode ≤0.35dB/km).
- [ ] Port misalignment check (Node A eth0 ↔ Node B eth0).
- [ ] Cable labeling (including source/destination IP + port number).

---

## 3. OS Configuration

### Kernel Tuning

```bash
# Check the following parameter settings
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_slow_start_after_idle = 0
```

### NIC Configuration

- [ ] Enable jumbo frames (MTU=9000, requires full path support).
- [ ] Verify bonding mode (recommend LACP mode4).
- [ ] Disable IPv6 (if not needed).

---

## 4. Security

### Firewall

```bash
# Necessary open ports
- TCP 443 (HTTPS API)
- TCP 9000 (S3 compatible interface)
- TCP 7946 (Serf node communication)
- UDP 4789 (VxLAN tunnel)
```

### Access Control

- Switch port security MAC restrictions.
- IPSec tunnel encryption between storage nodes.
- Enable TLS 1.3 for management interfaces.

---

## 5. Performance Testing

### Benchmarks

1. Inter-node latency: `iperf3 -s 8972 <target IP>`
2. Cross-rack bandwidth: `iperf3 -c <target IP> -P 8 -t 30`
3. Failover: Randomly disconnect core links to observe recovery time.

### Criteria

| Metric | Requirements |
|------|------|
| Node Latency | ≤1ms (same room) / ≤5ms (cross AZ) |
| Bandwidth Utilization | Peak ≤70% of design capacity |
| Failover | < 500ms BPDU convergence |

---

## 6. Documentation Requirements

1. Network topology diagram (including physical connections and logical IPs)
2. Switch configuration backup files (with timestamps)
3. Baseline test reports (including raw data)
4. Change record table (including maintenance window information)

> **Tip**: Recommend conducting 72-hour stress testing before formal deployment, simulating 110% peak traffic load scenarios

This checklist covers key checkpoints for enterprise storage system network deployment, specifically optimized parameter requirements for distributed object storage characteristics. You can contact RustFS for official technical support.
