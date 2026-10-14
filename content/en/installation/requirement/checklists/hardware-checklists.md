---
title: "Production Hardware Guide"
description: "This page provides hardware sizing and configuration guidance for production RustFS deployments."
---

## Planning considerations

Before deploying RustFS in production, assess your workload and capacity requirements over a two- to three-week period. Focus on the following factors:

1. **Data volume**

   - **Initial data volume**: Estimate the usable data volume at go-live (in TiB), including the ratio of hot to cold data.
   - **Growth forecast**: Estimate data growth for the next 24 months based on business plans. We recommend modeling growth quarterly.
   - **Object count**: Estimate the total number of objects from the average object size (ideally 128 KB to 1 MB). Deployments with more than 100 million objects need additional tuning.

2. **Workload characteristics**

   - **Access patterns**: Distinguish read-intensive workloads (such as content distribution) from write-intensive workloads (such as log collection).
   - **Compliance requirements**: Retention periods must meet industry regulations (for example, some financial regulations require at least five years of retention).
   - **Multi-site deployment**: For cross-region deployments, assess network latency (ideally under 50 ms) and bandwidth costs.

3. **Storage architecture**

   - **Bucket planning**: Organize buckets by business unit. We recommend no more than 500 active buckets per cluster.
   - **Disaster recovery**: Choose active-active replication (recommended) or asynchronous replication based on how critical the data is.

## Hardware Configuration Matrix

Baseline configurations based on load-test results:

| Component | Entry level | Standard production | High performance |
|--------------|---------------------------|--------------------------|--------------------------|
| Node Count | 4 nodes | 8 nodes | 16+ nodes |
| Storage Media | 4× NVMe SSD | 8×NVMe SSD | 12×NVMe SSD |
| Network Architecture | Dual 25GbE (link aggregation) | Dual 100GbE | 200GbE |
| CPU | 2×Intel Silver 4310 (16 cores) | 2×AMD EPYC 7313 (32 cores) | 2×Intel Platinum 8461Y (48 cores) |
| Memory | 64 GB DDR4-3200 ECC | 256 GB DDR5-4800 ECC | 512 GB DDR5-5600 ECC |
| Storage Controller | HBA 9500-8i | HBA 9600-16i | Dual controller redundant architecture |

**Deployment guidelines:**

1. Use homogeneous nodes: every node should have identical hardware from the same batch and the same firmware versions.
2. The network must use a leaf-spine topology, a physically isolated storage network, and dual uplinks.
3. We recommend 2U servers with at least 12 drive bays per node, depending on the number of drives required.

## Performance tuning

### Network Topology Optimization (Highest Priority)

- **Bandwidth sizing**: Provision 0.5 Gbps of bandwidth per TB of usable data (for example, 100 TB of data needs 50 Gbps of dedicated bandwidth).
- **Latency Requirements**:
  - Inter-node P99 latency ≤ 2ms
  - Cross-rack latency ≤ 5ms

### Storage Subsystem Tuning

- **Controller Configuration**:
  - Enable read-ahead cache (recommended 256 MB+)
  - Disable all RAID features and use pass-through (HBA/JBOD) mode.
  - Check BBU health regularly.
- **SSD Parameters**:
  - Reserve 20% over-provisioning (OP) space to improve endurance.
  - Enable atomic writes (requires hardware support).

### Memory allocation

- **Allocation Ratios**:
  - Metadata cache: 60% of total memory
  - Read/write buffers: 30%
  - System reserve: 10%

## Network Design Reference Model

### Network bandwidth vs. disk count

| Network | Theoretical throughput | Disk type | Max disks per node |
|------------|------------|---------------------|----------------|
| 10GbE | 1.25 GB/s | 7.2K HDD (180 MB/s) | 8 disks |
| 25GbE | 3.125 GB/s | SATA SSD (550 MB/s) | 6 disks |
| 100GbE | 12.5 GB/s | NVMe Gen4 (7 GB/s) | 2 (at full read/write speed) |

**Example**: A video platform runs a 16-node cluster. Each node has:

- 8×7.68 TB NVMe SSD
- Dual 100GbE NVIDIA ConnectX-5 NICs
- Achieves aggregate throughput of 38 GB/s

## Memory sizing

Use the following formula to size memory based on disk capacity and workload type:

```python
# Memory calculation formula (unit: GB)
def calc_memory(data_tb, access_pattern):
 base = 32 # Base memory
 if access_pattern == "read_heavy":
 return base + data_tb * 0.8
 elif access_pattern == "write_heavy":
 return base + data_tb * 1.2
 else: # mixed
 return base + data_tb * 1.0
```

**Reference sizes**:

| Data size | Read-heavy | Write-heavy | Mixed |
|-----------|----------|----------|---------|
| 10 TB | 40 GB | 44 GB | 42 GB |
| 100 TB | 112 GB | 152 GB | 132 GB |
| 500 TB | 432 GB | 632 GB | 532 GB |

## Storage guidelines

### Choosing storage media

| Metric | HDD | SATA SSD | NVMe (required) |
|-------------|------------------|---------------------|----------------------|
| Latency Requirements | >50ms | 1 to 10ms | < 1ms |
| Throughput Requirements | < 500 MB/s | 500 MB-3 GB/s | > 3 GB/s |
| Typical use cases | Archival storage | Hot-data cache | Real-time analytics |

### File System Configuration

```bash
# XFS formatting example
mkfs.xfs -f -L rustfs_disk1 -d su=256k,sw=10 /dev/sdb

# Recommended mount parameters
UUID=xxxx /mnt/disk1 xfs defaults,noatime,nodiratime,logbsize=256k 0 0
```

## High availability

1. **Power Supply**:

   - Use dual (redundant) power supplies.
   - Connect each PDU to a separate power feed.
   - Provide a UPS with at least 30 minutes of runtime.

2. **Cooling Requirements**:

   - Rack power density ≤ 15 kW per rack.
   - Keep the inlet-to-outlet temperature difference (ΔT) within 8 °C.

3. **Firmware Management**:

   - Maintain a hardware compatibility matrix.
   - Standardize on the same firmware versions across nodes.

:::tip[Before go-live]
We recommend running a 72-hour stress test before production go-live that covers the following scenarios:

1. Node failover testing
2. Network partition tests
3. Burst write load tests (we recommend testing at 120% of the theoretical maximum)
:::

---

This guide is based on the latest RustFS development version. For production deployments, fine-tune these settings using your hardware vendor's documentation. For quarterly hardware health assessments, contact RustFS.
