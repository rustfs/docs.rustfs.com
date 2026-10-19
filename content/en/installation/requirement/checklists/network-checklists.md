---
title: "Network Checklist"
description: "Check network layout, ports, and failover before a production RustFS deployment."
---

## Network architecture

### Planning

- **Topology**
 Verify the architecture (star/ring/mesh) meets high availability requirements.
- **Redundancy**
 Ensure at least two independent physical links between nodes.
- **Bandwidth**
 Estimate traffic as: read/write bandwidth × node count × replica count, plus 20% headroom.

### IP allocation

- [ ] Separate management network from data network.
- [ ] Allocate a contiguous IP address range for storage nodes. We recommend a /24 subnet.
- [ ] Reserve at least 15% of IP addresses for expansion.

---

## Switch and cabling requirements

### Switches

| Item | Requirement |
|--------|---------|
| Backplane bandwidth | ≥ 1.2 × aggregate line rate of all ports |
| Port Type | 10G/25G/100G SFP+/QSFP+ fiber ports |
| Flow Table Capacity | ≥ Node count × 5 |
| Spanning Tree | Enable RSTP or MSTP for fast convergence |

### Cabling

- [ ] Fiber attenuation test (single mode ≤0.35dB/km).
- [ ] Verify port mapping (Node A eth0 ↔ Node B eth0).
- [ ] Cable labeling (including source/destination IP + port number).

---

## Operating system configuration

### Kernel tuning

```bash
# Check the following parameter settings
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_slow_start_after_idle = 0
```

### NIC configuration

- [ ] Enable jumbo frames (MTU=9000, requires full path support).
- [ ] Verify the bond mode. We recommend LACP (mode 4).
- [ ] Disable IPv6 (if not needed).

---

## Security

### Firewall

```text
# Necessary open ports
- TCP 9000 (S3 API; also used for internal node-to-node communication)
- TCP 9001 (RustFS Console)
- TCP 443 (only if you terminate HTTPS on a reverse proxy / load balancer)
```

### Access control

- Enable port security (MAC address limits) on switches.
- Encrypt traffic between storage nodes with IPsec.
- Enable TLS 1.3 for management interfaces.

---

## Performance testing

### Benchmarks

1. Inter-node latency: `ping -c 20 <target IP>` (run `iperf3 -s` on the target first for throughput tests)
2. Cross-rack bandwidth: `iperf3 -c <target IP> -P 8 -t 30`
3. Failover: Randomly disconnect core links to observe recovery time.

### Criteria

| Metric | Requirements |
|------|------|
| Node latency | ≤ 1 ms (same data center) / ≤ 5 ms (cross-AZ) |
| Bandwidth utilization | Peak ≤ 70% of design capacity |
| Failover | < 500ms BPDU convergence |

---

## Records to keep

1. Network topology diagram (including physical connections and logical IPs)
2. Switch configuration backup files (with timestamps)
3. Baseline test reports (including raw data)
4. Change log (including maintenance windows)

:::tip[Before production]

We recommend running a 72-hour stress test at 110% of the expected peak traffic before deploying to production.

:::

This checklist covers the key network requirements for deploying distributed object storage in an enterprise environment. For technical support, contact RustFS.
