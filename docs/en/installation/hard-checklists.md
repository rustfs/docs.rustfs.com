---
title: "Production Environment Hardware Configuration Guide"
description: "RustFS is a high-performance distributed object storage system developed in Rust, suitable for massive unstructured data storage scenarios. This document provides comprehensive hardware selection and configuration guidance for production environment deployment."
---

# Production Environment Hardware Configuration Guide

## 1. Deployment Planning Factor Analysis

Before formally deploying RustFS, it's recommended to conduct 2-3 weeks of business research, focusing on evaluating the following dimensions:

1. **Data Scale Analysis**

- **Initial Data Volume**: Accurately measure effective data volume at initial production (recommended in TiB units), considering hot and cold data ratios
- **Growth Trend Prediction**: Based on business development plans, estimate data growth for the next 24 months (recommended using quarterly growth rate model)
- **Object Scale**: Calculate total object count based on average object size (recommended 128 KB-1 MB range), noting special optimization needed for over 100 million objects

2. **Business Characteristics Assessment**

- **Access Patterns**: Distinguish between read-intensive (e.g., content distribution) and write-intensive (e.g., log collection) scenarios
- **Compliance Requirements**: Data retention periods must comply with industry regulatory requirements (e.g., financial industry minimum 5 years)
- **Multi-Site Deployment**: For cross-regional deployment, evaluate network latency (recommended under 50ms) and bandwidth costs

3. **Storage Architecture Design**

- **Bucket Planning**: Divide buckets by business units, recommend no more than 500 active buckets per cluster
- **Disaster Recovery Strategy**: Choose active-active architecture (recommended) or asynchronous replication based on data importance

## 2. Hardware Configuration Matrix

Baseline configuration solutions based on stress test results:

| Component | Basic Environment | Production Standard Configuration | High-Performance Configuration |
|--------------|---------------------------|--------------------------|--------------------------|
| Node Count | 4 nodes | 8 nodes | 16+ nodes |
| Storage Media | 4× NVMe SSD | 8×NVMe SSD | 12×NVMe SSD |
| Network Architecture | Dual 25GbE (link aggregation) | Dual 100GbE | 200GbE |
| CPU | 2×Intel Silver 4310 (16 cores) | 2×AMD EPYC 7313 (32 cores) | 2×Intel Platinum 8461Y (48 cores) |
| Memory | 64 GB DDR4-3200 ECC | 256 GB DDR5-4800 ECC | 512 GB DDR5-5600 ECC |
| Storage Controller | HBA 9500-8i | HBA 9600-16i | Dual controller redundant architecture |

**Important Deployment Principles:**

1. Use "server farm" mode, ensuring all nodes use identical hardware batches and firmware versions
2. Network architecture must meet: leaf-spine topology + physically isolated storage network + dual uplink connections
3. Recommend using 2U server models, single node should have 12+ drive bays (based on actual hard drive count)

## 3. Performance Critical Path Optimization

### 1. Network Topology Optimization (Highest Priority)

- **Bandwidth Calculation**: Each TB of effective data requires 0.5 Gbps bandwidth reservation (e.g., 100 TB data needs 50 Gbps dedicated bandwidth)
- **Latency Requirements**:
- Inter-node P99 latency ≤ 2ms
- Cross-rack latency ≤ 5ms

### 2. Storage Subsystem Tuning

- **Controller Configuration**:
- Enable read-ahead cache (recommended 256 MB+)
- Disable all RAID functions, use passthrough mode
- Regularly check BBU battery health status
- **SSD Parameters**:
- Reserve 20% OP space to improve durability
- Enable atomic write features (requires hardware support)

### 3. Memory Management Strategy

- **Allocation Ratio**:
- Metadata cache: 60% of total memory
- Read/write buffers: 30%
- System reserved: 10%

## 4. Network Design Reference Model

### Bandwidth to Disk Ratio Relationship

| Network Type | Theoretical Throughput | Applicable Disk Type | Maximum Disk Support Count |
|------------|------------|---------------------|----------------|
| 10GbE | 1.25 GB/s | 7.2K HDD (180 MB/s) | 8 drives |
| 25GbE | 3.125 GB/s | SATA SSD (550 MB/s) | 6 drives |
| 100GbE | 12.5 GB/s | NVMe Gen4 (7 GB/s) | 2 drives full-speed read/write |

**Best Practice Case**: A video platform uses 16-node cluster, each node configured with:

- 8×7.68 TB NVMe SSD
- Dual 100GbE CX5 network cards
- Achieving aggregate throughput of 38 GB/s

## 5. Memory Configuration Calculator

Dynamic algorithm based on disk capacity and business characteristics:

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

**Reference Configuration Table**:

| Data Scale | Read-Intensive | Write-Intensive | Mixed |
|-----------|----------|----------|---------|
| 10 TB | 40 GB | 44 GB | 42 GB |
| 100 TB | 112 GB | 152 GB | 132 GB |
| 500 TB | 432 GB | 632 GB | 532 GB |

## 6. Storage Deployment Specifications

### 1. Media Selection Standards

| Metric | HDD Applicable Scenarios | SSD Applicable Scenarios | NVMe Mandatory Scenarios |
|-------------|------------------|---------------------|----------------------|
| Latency Requirements | >50ms | 1 to 10ms | <1ms |
| Throughput Requirements | <500 MB/s | 500 MB-3 GB/s | >3 GB/s |
| Typical Use Cases | Archive storage | Hot data cache | Real-time analytics |

### 2. File System Configuration

```bash
# XFS formatting example
mkfs.xfs -f -L rustfs_disk1 -d su=256k,sw=10 /dev/sdb

# Recommended mount parameters
UUID=xxxx /mnt/disk1 xfs defaults,noatime,nodiratime,logbsize=256k 0 0
```

## 7. High Availability Assurance Measures

1. **Power Supply**:

- Use dual power supply architecture
- Each PDU connects to different substations
- Equipped with UPS (minimum 30 minutes backup)

2. **Cooling Requirements**:

- Cabinet power density ≤ 15kW/cabinet
- Control inlet/outlet temperature difference within 8℃

3. **Firmware Management**:

- Establish hardware compatibility matrix
- Use unified firmware versions

> **Implementation Recommendation**: Recommend 72-hour stress testing before formal deployment, simulating the following scenarios:
>
> 1. Node failover testing
> 2. Network partition drills
> 3. Burst write pressure testing (recommended to reach 120% of theoretical value)

---

This guide is written based on the latest development version of RustFS. For actual deployment, please fine-tune parameters in conjunction with specific hardware vendor whitepapers. Or contact RustFS official for quarterly hardware health assessments to ensure continuous stable operation of storage clusters.
