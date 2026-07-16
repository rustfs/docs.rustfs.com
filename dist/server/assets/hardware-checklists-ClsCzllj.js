import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/installation/checklists/hardware-checklists.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Production Environment Hardware Configuration Guide",
	"description": "RustFS is a high-performance distributed object storage system developed in Rust, suitable for massive unstructured data storage scenarios. This document provides comprehensive hardware selection and configuration guidance for production environment deployment."
};
var _markdown = "\n\n## Deployment Planning Factor Analysis [#deployment-planning-factor-analysis]\n\nBefore formally deploying RustFS, it's recommended to conduct 2-3 weeks of business research, focusing on evaluating the following dimensions:\n\n1. **Data Scale Analysis**\n\n* **Initial Data Volume**: Accurately calculate effective data volume at production startup (recommended in TiB units), considering hot/cold data ratios\n* **Growth Trend Prediction**: Estimate data increments for the next 24 months based on business development plans (recommended quarterly growth rate model)\n* **Object Scale**: Calculate total object count based on average object size (recommended 128 KB-1 MB range), note special optimization needed when exceeding 100 million objects\n\n2. **Business Characteristic Assessment**\n\n* **Access Patterns**: Distinguish read-intensive (such as content distribution) from write-intensive (such as log collection) scenarios\n* **Compliance Requirements**: Data retention cycles must comply with industry regulatory requirements (e.g., financial industry must retain for at least 5 years)\n* **Multi-site Deployment**: Cross-regional deployment requires network latency assessment (recommended controlled within 50ms) and bandwidth cost evaluation\n\n3. **Storage Architecture Design**\n\n* **Bucket Planning**: Divide storage buckets by business units, single cluster recommended not exceeding 500 active buckets\n* **Disaster Recovery Strategy**: Choose dual-active architecture (recommended) or asynchronous replication based on data importance\n\n## Hardware Configuration Matrix [#hardware-configuration-matrix]\n\nBaseline configuration solutions based on stress test results:\n\n| Component            | Basic Environment              | Production Standard Configuration | High-Performance Configuration         |\n| -------------------- | ------------------------------ | --------------------------------- | -------------------------------------- |\n| Node Count           | 4 nodes                        | 8 nodes                           | 16+ nodes                              |\n| Storage Media        | 4× NVMe SSD                    | 8×NVMe SSD                        | 12×NVMe SSD                            |\n| Network Architecture | Dual 25GbE (link aggregation)  | Dual 100GbE                       | 200GbE                                 |\n| CPU                  | 2×Intel Silver 4310 (16 cores) | 2×AMD EPYC 7313 (32 cores)        | 2×Intel Platinum 8461Y (48 cores)      |\n| Memory               | 64 GB DDR4-3200 ECC            | 256 GB DDR5-4800 ECC              | 512 GB DDR5-5600 ECC                   |\n| Storage Controller   | HBA 9500-8i                    | HBA 9600-16i                      | Dual controller redundant architecture |\n\n**Important Deployment Principles:**\n\n1. Adopt \"server farm\" mode, ensuring all nodes use identical hardware batches and firmware versions\n2. Network architecture must meet: leaf-spine topology + physically isolated storage network + dual uplink paths\n3. Recommend using 2U server models, single node recommended configuration of 12+ disk bays (based on actual hard disk count)\n\n## Performance Critical Path Optimization [#performance-critical-path-optimization]\n\n### Network Topology Optimization (Highest Priority) [#network-topology-optimization-highest-priority]\n\n* **Bandwidth Calculation**: Reserve 0.5 Gbps bandwidth per TB of effective data (e.g., 100 TB data needs 50 Gbps dedicated bandwidth)\n* **Latency Requirements**:\n* Inter-node P99 latency ≤ 2ms\n* Cross-rack latency ≤ 5ms\n\n### Storage Subsystem Tuning [#storage-subsystem-tuning]\n\n* **Controller Configuration**:\n* Enable read-ahead cache (recommended 256 MB+)\n* Disable all RAID functions, use pass-through mode\n* Regularly check BBU battery health status\n* **SSD Parameters**:\n* Reserve 20% OP space to improve durability\n* Enable atomic write features (requires hardware support)\n\n### Memory Management Strategy [#memory-management-strategy]\n\n* **Allocation Ratios**:\n* Metadata cache: 60% of total memory\n* Read/write buffers: 30%\n* System reserve: 10%\n\n## Network Design Reference Model [#network-design-reference-model]\n\n### Bandwidth and Disk Ratio Relationship [#bandwidth-and-disk-ratio-relationship]\n\n| Network Type | Theoretical Throughput | Suitable Disk Types | Maximum Disk Support          |\n| ------------ | ---------------------- | ------------------- | ----------------------------- |\n| 10GbE        | 1.25 GB/s              | 7.2K HDD (180 MB/s) | 8 disks                       |\n| 25GbE        | 3.125 GB/s             | SATA SSD (550 MB/s) | 6 disks                       |\n| 100GbE       | 12.5 GB/s              | NVMe Gen4 (7 GB/s)  | 2 disks full-speed read/write |\n\n**Best Practice Case**: A video platform uses 16-node cluster, each node configured with:\n\n* 8×7.68 TB NVMe SSD\n* Dual 100GbE CX5 network cards\n* Achieves aggregate throughput of 38 GB/s\n\n## Memory Configuration Calculator [#memory-configuration-calculator]\n\nDynamic algorithm based on disk capacity and business characteristics:\n\n```python\n# Memory calculation formula (unit: GB)\ndef calc_memory(data_tb, access_pattern):\n base = 32 # Base memory\n if access_pattern == \"read_heavy\":\n return base + data_tb * 0.8\n elif access_pattern == \"write_heavy\":\n return base + data_tb * 1.2\n else: # mixed\n return base + data_tb * 1.0\n```\n\n**Reference Configuration Table**:\n\n| Data Scale | Read-Intensive | Write-Intensive | Mixed  |\n| ---------- | -------------- | --------------- | ------ |\n| 10 TB      | 40 GB          | 44 GB           | 42 GB  |\n| 100 TB     | 112 GB         | 152 GB          | 132 GB |\n| 500 TB     | 432 GB         | 632 GB          | 532 GB |\n\n## Storage Deployment Standards [#storage-deployment-standards]\n\n### Media Selection Criteria [#media-selection-criteria]\n\n| Metric                  | HDD Suitable Scenarios | SSD Suitable Scenarios | NVMe Mandatory Scenarios |\n| ----------------------- | ---------------------- | ---------------------- | ------------------------ |\n| Latency Requirements    | >50ms                  | 1 to 10ms              | \\< 1ms                   |\n| Throughput Requirements | \\< 500 MB/s            | 500 MB-3 GB/s          | > 3 GB/s                 |\n| Typical Use Cases       | Archive storage        | Hot data cache         | Real-time analysis       |\n\n### File System Configuration [#file-system-configuration]\n\n```bash\n# XFS formatting example\nmkfs.xfs -f -L rustfs_disk1 -d su=256k,sw=10 /dev/sdb\n\n# Recommended mount parameters\nUUID=xxxx /mnt/disk1 xfs defaults,noatime,nodiratime,logbsize=256k 0 0\n```\n\n## High Availability Assurance Measures [#high-availability-assurance-measures]\n\n1. **Power Supply**:\n\n* Adopt dual power supply architecture\n* Each PDU connects to different substations\n* Equip UPS (at least 30 minutes runtime)\n\n2. **Cooling Requirements**:\n\n* Cabinet power density ≤ 15kW/cabinet\n* Inlet/outlet temperature difference controlled within 8℃\n\n3. **Firmware Management**:\n\n* Establish hardware compatibility matrix\n* Use unified firmware versions\n\n> **Implementation Recommendations**: Recommend conducting 72-hour stress testing before formal deployment, simulating the following scenarios:\n>\n> 1. Node failover testing\n> 2. Network partition drills\n> 3. Burst write pressure testing (recommended reaching 120% of theoretical value)\n\n***\n\nThis guide is based on the latest RustFS development version. For actual deployment, please combine with specific hardware vendor white papers for parameter fine-tuning. Or contact RustFS official recommendations for quarterly hardware health assessments to ensure continuous stable operation of storage clusters.\n";
var structuredData = {
	"contents": [
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "Before formally deploying RustFS, it's recommended to conduct 2-3 weeks of business research, focusing on evaluating the following dimensions:"
		},
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "**Data Scale Analysis**"
		},
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "**Initial Data Volume**: Accurately calculate effective data volume at production startup (recommended in TiB units), considering hot/cold data ratios"
		},
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "**Growth Trend Prediction**: Estimate data increments for the next 24 months based on business development plans (recommended quarterly growth rate model)"
		},
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "**Object Scale**: Calculate total object count based on average object size (recommended 128 KB-1 MB range), note special optimization needed when exceeding 100 million objects"
		},
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "**Business Characteristic Assessment**"
		},
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "**Access Patterns**: Distinguish read-intensive (such as content distribution) from write-intensive (such as log collection) scenarios"
		},
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "**Compliance Requirements**: Data retention cycles must comply with industry regulatory requirements (e.g., financial industry must retain for at least 5 years)"
		},
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "**Multi-site Deployment**: Cross-regional deployment requires network latency assessment (recommended controlled within 50ms) and bandwidth cost evaluation"
		},
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "**Storage Architecture Design**"
		},
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "**Bucket Planning**: Divide storage buckets by business units, single cluster recommended not exceeding 500 active buckets"
		},
		{
			"heading": "deployment-planning-factor-analysis",
			"content": "**Disaster Recovery Strategy**: Choose dual-active architecture (recommended) or asynchronous replication based on data importance"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Baseline configuration solutions based on stress test results:"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Component"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Basic Environment"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Production Standard Configuration"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "High-Performance Configuration"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Node Count"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "4 nodes"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "8 nodes"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "16+ nodes"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Storage Media"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "4× NVMe SSD"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "8×NVMe SSD"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "12×NVMe SSD"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Network Architecture"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Dual 25GbE (link aggregation)"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Dual 100GbE"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "200GbE"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "CPU"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "2×Intel Silver 4310 (16 cores)"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "2×AMD EPYC 7313 (32 cores)"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "2×Intel Platinum 8461Y (48 cores)"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Memory"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "64 GB DDR4-3200 ECC"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "256 GB DDR5-4800 ECC"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "512 GB DDR5-5600 ECC"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Storage Controller"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "HBA 9500-8i"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "HBA 9600-16i"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Dual controller redundant architecture"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "**Important Deployment Principles:**"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Adopt \"server farm\" mode, ensuring all nodes use identical hardware batches and firmware versions"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Network architecture must meet: leaf-spine topology + physically isolated storage network + dual uplink paths"
		},
		{
			"heading": "hardware-configuration-matrix",
			"content": "Recommend using 2U server models, single node recommended configuration of 12+ disk bays (based on actual hard disk count)"
		},
		{
			"heading": "network-topology-optimization-highest-priority",
			"content": "**Bandwidth Calculation**: Reserve 0.5 Gbps bandwidth per TB of effective data (e.g., 100 TB data needs 50 Gbps dedicated bandwidth)"
		},
		{
			"heading": "network-topology-optimization-highest-priority",
			"content": "**Latency Requirements**:"
		},
		{
			"heading": "network-topology-optimization-highest-priority",
			"content": "Inter-node P99 latency ≤ 2ms"
		},
		{
			"heading": "network-topology-optimization-highest-priority",
			"content": "Cross-rack latency ≤ 5ms"
		},
		{
			"heading": "storage-subsystem-tuning",
			"content": "**Controller Configuration**:"
		},
		{
			"heading": "storage-subsystem-tuning",
			"content": "Enable read-ahead cache (recommended 256 MB+)"
		},
		{
			"heading": "storage-subsystem-tuning",
			"content": "Disable all RAID functions, use pass-through mode"
		},
		{
			"heading": "storage-subsystem-tuning",
			"content": "Regularly check BBU battery health status"
		},
		{
			"heading": "storage-subsystem-tuning",
			"content": "**SSD Parameters**:"
		},
		{
			"heading": "storage-subsystem-tuning",
			"content": "Reserve 20% OP space to improve durability"
		},
		{
			"heading": "storage-subsystem-tuning",
			"content": "Enable atomic write features (requires hardware support)"
		},
		{
			"heading": "memory-management-strategy",
			"content": "**Allocation Ratios**:"
		},
		{
			"heading": "memory-management-strategy",
			"content": "Metadata cache: 60% of total memory"
		},
		{
			"heading": "memory-management-strategy",
			"content": "Read/write buffers: 30%"
		},
		{
			"heading": "memory-management-strategy",
			"content": "System reserve: 10%"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "Network Type"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "Theoretical Throughput"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "Suitable Disk Types"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "Maximum Disk Support"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "10GbE"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "1.25 GB/s"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "7.2K HDD (180 MB/s)"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "8 disks"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "25GbE"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "3.125 GB/s"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "SATA SSD (550 MB/s)"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "6 disks"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "100GbE"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "12.5 GB/s"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "NVMe Gen4 (7 GB/s)"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "2 disks full-speed read/write"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "**Best Practice Case**: A video platform uses 16-node cluster, each node configured with:"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "8×7.68 TB NVMe SSD"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "Dual 100GbE CX5 network cards"
		},
		{
			"heading": "bandwidth-and-disk-ratio-relationship",
			"content": "Achieves aggregate throughput of 38 GB/s"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "Dynamic algorithm based on disk capacity and business characteristics:"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "**Reference Configuration Table**:"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "Data Scale"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "Read-Intensive"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "Write-Intensive"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "Mixed"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "10 TB"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "40 GB"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "44 GB"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "42 GB"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "100 TB"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "112 GB"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "152 GB"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "132 GB"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "500 TB"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "432 GB"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "632 GB"
		},
		{
			"heading": "memory-configuration-calculator",
			"content": "532 GB"
		},
		{
			"heading": "media-selection-criteria",
			"content": "Metric"
		},
		{
			"heading": "media-selection-criteria",
			"content": "HDD Suitable Scenarios"
		},
		{
			"heading": "media-selection-criteria",
			"content": "SSD Suitable Scenarios"
		},
		{
			"heading": "media-selection-criteria",
			"content": "NVMe Mandatory Scenarios"
		},
		{
			"heading": "media-selection-criteria",
			"content": "Latency Requirements"
		},
		{
			"heading": "media-selection-criteria",
			"content": ">50ms"
		},
		{
			"heading": "media-selection-criteria",
			"content": "1 to 10ms"
		},
		{
			"heading": "media-selection-criteria",
			"content": "\\< 1ms"
		},
		{
			"heading": "media-selection-criteria",
			"content": "Throughput Requirements"
		},
		{
			"heading": "media-selection-criteria",
			"content": "\\< 500 MB/s"
		},
		{
			"heading": "media-selection-criteria",
			"content": "500 MB-3 GB/s"
		},
		{
			"heading": "media-selection-criteria",
			"content": "> 3 GB/s"
		},
		{
			"heading": "media-selection-criteria",
			"content": "Typical Use Cases"
		},
		{
			"heading": "media-selection-criteria",
			"content": "Archive storage"
		},
		{
			"heading": "media-selection-criteria",
			"content": "Hot data cache"
		},
		{
			"heading": "media-selection-criteria",
			"content": "Real-time analysis"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "**Power Supply**:"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "Adopt dual power supply architecture"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "Each PDU connects to different substations"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "Equip UPS (at least 30 minutes runtime)"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "**Cooling Requirements**:"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "Cabinet power density ≤ 15kW/cabinet"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "Inlet/outlet temperature difference controlled within 8℃"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "**Firmware Management**:"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "Establish hardware compatibility matrix"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "Use unified firmware versions"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "> **Implementation Recommendations**: Recommend conducting 72-hour stress testing before formal deployment, simulating the following scenarios:\n>\n> 1. Node failover testing\n> 2. Network partition drills\n> 3. Burst write pressure testing (recommended reaching 120% of theoretical value)"
		},
		{
			"heading": "high-availability-assurance-measures",
			"content": "This guide is based on the latest RustFS development version. For actual deployment, please combine with specific hardware vendor white papers for parameter fine-tuning. Or contact RustFS official recommendations for quarterly hardware health assessments to ensure continuous stable operation of storage clusters."
		}
	],
	"headings": [
		{
			"id": "deployment-planning-factor-analysis",
			"content": "Deployment Planning Factor Analysis"
		},
		{
			"id": "hardware-configuration-matrix",
			"content": "Hardware Configuration Matrix"
		},
		{
			"id": "performance-critical-path-optimization",
			"content": "Performance Critical Path Optimization"
		},
		{
			"id": "network-topology-optimization-highest-priority",
			"content": "Network Topology Optimization (Highest Priority)"
		},
		{
			"id": "storage-subsystem-tuning",
			"content": "Storage Subsystem Tuning"
		},
		{
			"id": "memory-management-strategy",
			"content": "Memory Management Strategy"
		},
		{
			"id": "network-design-reference-model",
			"content": "Network Design Reference Model"
		},
		{
			"id": "bandwidth-and-disk-ratio-relationship",
			"content": "Bandwidth and Disk Ratio Relationship"
		},
		{
			"id": "memory-configuration-calculator",
			"content": "Memory Configuration Calculator"
		},
		{
			"id": "storage-deployment-standards",
			"content": "Storage Deployment Standards"
		},
		{
			"id": "media-selection-criteria",
			"content": "Media Selection Criteria"
		},
		{
			"id": "file-system-configuration",
			"content": "File System Configuration"
		},
		{
			"id": "high-availability-assurance-measures",
			"content": "High Availability Assurance Measures"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#deployment-planning-factor-analysis",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Deployment Planning Factor Analysis" })
	},
	{
		depth: 2,
		url: "#hardware-configuration-matrix",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Hardware Configuration Matrix" })
	},
	{
		depth: 2,
		url: "#performance-critical-path-optimization",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Performance Critical Path Optimization" })
	},
	{
		depth: 3,
		url: "#network-topology-optimization-highest-priority",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Network Topology Optimization (Highest Priority)" })
	},
	{
		depth: 3,
		url: "#storage-subsystem-tuning",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Storage Subsystem Tuning" })
	},
	{
		depth: 3,
		url: "#memory-management-strategy",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Memory Management Strategy" })
	},
	{
		depth: 2,
		url: "#network-design-reference-model",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Network Design Reference Model" })
	},
	{
		depth: 3,
		url: "#bandwidth-and-disk-ratio-relationship",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Bandwidth and Disk Ratio Relationship" })
	},
	{
		depth: 2,
		url: "#memory-configuration-calculator",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Memory Configuration Calculator" })
	},
	{
		depth: 2,
		url: "#storage-deployment-standards",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Storage Deployment Standards" })
	},
	{
		depth: 3,
		url: "#media-selection-criteria",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Media Selection Criteria" })
	},
	{
		depth: 3,
		url: "#file-system-configuration",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "File System Configuration" })
	},
	{
		depth: 2,
		url: "#high-availability-assurance-measures",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "High Availability Assurance Measures" })
	}
];
function _createMdxContent(props) {
	const _components = {
		blockquote: "blockquote",
		code: "code",
		h2: "h2",
		h3: "h3",
		hr: "hr",
		li: "li",
		ol: "ol",
		p: "p",
		pre: "pre",
		span: "span",
		strong: "strong",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "deployment-planning-factor-analysis",
			children: "Deployment Planning Factor Analysis"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Before formally deploying RustFS, it's recommended to conduct 2-3 weeks of business research, focusing on evaluating the following dimensions:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Data Scale Analysis" }) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Initial Data Volume" }), ": Accurately calculate effective data volume at production startup (recommended in TiB units), considering hot/cold data ratios"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Growth Trend Prediction" }), ": Estimate data increments for the next 24 months based on business development plans (recommended quarterly growth rate model)"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Object Scale" }), ": Calculate total object count based on average object size (recommended 128 KB-1 MB range), note special optimization needed when exceeding 100 million objects"] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
			start: "2",
			children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Business Characteristic Assessment" }) }),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Access Patterns" }), ": Distinguish read-intensive (such as content distribution) from write-intensive (such as log collection) scenarios"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Compliance Requirements" }), ": Data retention cycles must comply with industry regulatory requirements (e.g., financial industry must retain for at least 5 years)"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Multi-site Deployment" }), ": Cross-regional deployment requires network latency assessment (recommended controlled within 50ms) and bandwidth cost evaluation"] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
			start: "3",
			children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Storage Architecture Design" }) }),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Bucket Planning" }), ": Divide storage buckets by business units, single cluster recommended not exceeding 500 active buckets"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Disaster Recovery Strategy" }), ": Choose dual-active architecture (recommended) or asynchronous replication based on data importance"] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "hardware-configuration-matrix",
			children: "Hardware Configuration Matrix"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Baseline configuration solutions based on stress test results:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Component" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Basic Environment" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Production Standard Configuration" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "High-Performance Configuration" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Node Count" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "4 nodes" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "8 nodes" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "16+ nodes" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage Media" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "4× NVMe SSD" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "8×NVMe SSD" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "12×NVMe SSD" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Network Architecture" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Dual 25GbE (link aggregation)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Dual 100GbE" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "200GbE" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "CPU" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "2×Intel Silver 4310 (16 cores)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "2×AMD EPYC 7313 (32 cores)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "2×Intel Platinum 8461Y (48 cores)" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Memory" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "64 GB DDR4-3200 ECC" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "256 GB DDR5-4800 ECC" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "512 GB DDR5-5600 ECC" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage Controller" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "HBA 9500-8i" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "HBA 9600-16i" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Dual controller redundant architecture" })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Important Deployment Principles:" }) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Adopt \"server farm\" mode, ensuring all nodes use identical hardware batches and firmware versions" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Network architecture must meet: leaf-spine topology + physically isolated storage network + dual uplink paths" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Recommend using 2U server models, single node recommended configuration of 12+ disk bays (based on actual hard disk count)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "performance-critical-path-optimization",
			children: "Performance Critical Path Optimization"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "network-topology-optimization-highest-priority",
			children: "Network Topology Optimization (Highest Priority)"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Bandwidth Calculation" }), ": Reserve 0.5 Gbps bandwidth per TB of effective data (e.g., 100 TB data needs 50 Gbps dedicated bandwidth)"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Latency Requirements" }), ":"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Inter-node P99 latency ≤ 2ms" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Cross-rack latency ≤ 5ms" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "storage-subsystem-tuning",
			children: "Storage Subsystem Tuning"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Controller Configuration" }), ":"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Enable read-ahead cache (recommended 256 MB+)" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Disable all RAID functions, use pass-through mode" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Regularly check BBU battery health status" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "SSD Parameters" }), ":"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Reserve 20% OP space to improve durability" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Enable atomic write features (requires hardware support)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "memory-management-strategy",
			children: "Memory Management Strategy"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Allocation Ratios" }), ":"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Metadata cache: 60% of total memory" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Read/write buffers: 30%" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "System reserve: 10%" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "network-design-reference-model",
			children: "Network Design Reference Model"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "bandwidth-and-disk-ratio-relationship",
			children: "Bandwidth and Disk Ratio Relationship"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Network Type" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Theoretical Throughput" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Suitable Disk Types" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Maximum Disk Support" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "10GbE" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "1.25 GB/s" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "7.2K HDD (180 MB/s)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "8 disks" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "25GbE" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "3.125 GB/s" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "SATA SSD (550 MB/s)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "6 disks" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "100GbE" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "12.5 GB/s" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "NVMe Gen4 (7 GB/s)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "2 disks full-speed read/write" })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Best Practice Case" }), ": A video platform uses 16-node cluster, each node configured with:"] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "8×7.68 TB NVMe SSD" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Dual 100GbE CX5 network cards" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Achieves aggregate throughput of 38 GB/s" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "memory-configuration-calculator",
			children: "Memory Configuration Calculator"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Dynamic algorithm based on disk capacity and business characteristics:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6A737D",
							"--shiki-dark": "#6A737D"
						},
						children: "# Memory calculation formula (unit: GB)"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "def"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " calc_memory"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "(data_tb, access_pattern):"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " base "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "="
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 32"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6A737D",
								"--shiki-dark": "#6A737D"
							},
							children: " # Base memory"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " if"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " access_pattern "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "=="
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"read_heavy\""
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ":"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " return"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " base "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "+"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " data_tb "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "*"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 0.8"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " elif"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " access_pattern "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "=="
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"write_heavy\""
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ":"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " return"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " base "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "+"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " data_tb "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "*"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 1.2"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " else"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ": "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6A737D",
								"--shiki-dark": "#6A737D"
							},
							children: "# mixed"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " return"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " base "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "+"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " data_tb "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "*"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 1.0"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Reference Configuration Table" }), ":"] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Data Scale" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Read-Intensive" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Write-Intensive" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Mixed" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "10 TB" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "40 GB" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "44 GB" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "42 GB" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "100 TB" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "112 GB" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "152 GB" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "132 GB" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "500 TB" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "432 GB" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "632 GB" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "532 GB" })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "storage-deployment-standards",
			children: "Storage Deployment Standards"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "media-selection-criteria",
			children: "Media Selection Criteria"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Metric" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "HDD Suitable Scenarios" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "SSD Suitable Scenarios" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "NVMe Mandatory Scenarios" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Latency Requirements" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: ">50ms" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "1 to 10ms" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "< 1ms" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Throughput Requirements" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "< 500 MB/s" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "500 MB-3 GB/s" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "> 3 GB/s" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Typical Use Cases" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Archive storage" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Hot data cache" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Real-time analysis" })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "file-system-configuration",
			children: "File System Configuration"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6A737D",
							"--shiki-dark": "#6A737D"
						},
						children: "# XFS formatting example"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "mkfs.xfs"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -f"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -L"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " rustfs_disk1"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -d"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " su=256k,sw="
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "10"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " /dev/sdb"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6A737D",
							"--shiki-dark": "#6A737D"
						},
						children: "# Recommended mount parameters"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "UUID"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "="
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "xxxx"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " /mnt/disk1"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " xfs"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " defaults,noatime,nodiratime,logbsize=256k"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 0"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 0"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "high-availability-assurance-measures",
			children: "High Availability Assurance Measures"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Power Supply" }), ":"] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Adopt dual power supply architecture" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Each PDU connects to different substations" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Equip UPS (at least 30 minutes runtime)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
			start: "2",
			children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Cooling Requirements" }), ":"] }),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Cabinet power density ≤ 15kW/cabinet" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Inlet/outlet temperature difference controlled within 8℃" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
			start: "3",
			children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Firmware Management" }), ":"] }),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Establish hardware compatibility matrix" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Use unified firmware versions" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Implementation Recommendations" }), ": Recommend conducting 72-hour stress testing before formal deployment, simulating the following scenarios:"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Node failover testing" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Network partition drills" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Burst write pressure testing (recommended reaching 120% of theoretical value)" }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "This guide is based on the latest RustFS development version. For actual deployment, please combine with specific hardware vendor white papers for parameter fine-tuning. Or contact RustFS official recommendations for quarterly hardware health assessments to ensure continuous stable operation of storage clusters." })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime_react_server.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime_react_server.jsx)(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
//#endregion
export { _markdown, MDXContent as default, frontmatter, structuredData, toc };
