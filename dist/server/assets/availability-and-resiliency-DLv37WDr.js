import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/upgrade-scale/availability-and-resiliency.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Availability and Scalability Description",
	"description": "This article will detail the technology and description related to RustFS scaling."
};
var _markdown = "\n\n> Note: This document is based on the latest RustFS version. Please perform full data backup before scaling operations. For production environments, it's recommended to contact RustFS technical support engineers for solution review.\n\n## Scaling Solution Overview [#scaling-solution-overview]\n\nRustFS supports horizontal scaling by adding new storage pools (Server Pool). Each new storage pool must meet:\n\n1. Nodes within the storage pool must use **consecutive hostnames** (e.g., node5-node8)\n2. Single storage pool must use **same specifications** of disks (type/capacity/quantity)\n3. New storage pools must maintain **time synchronization** and **network connectivity** with existing clusters\n\n<Mermaid\n  chart=\"flowchart LR\n    APP[Applications] --> S3API([&#x22;S3 API&#x22;])\n\n    subgraph DIST[&#x22;Distributed RustFS&#x22;]\n        direction TB\n        subgraph N1[&#x22;Node 1&#x22;]\n            direction LR\n            S3a[S3]\n            subgraph OL1[&#x22;Object Layer&#x22;]\n                direction TB\n                C1[Cache]\n                K1[Compression]\n                E1[Encryption]\n                B1[&#x22;Erasure Code · Bitrot&#x22;]\n            end\n            SL1[&#x22;Storage Layer&#x22;]\n            J1[(&#x22;JBOD / FS disks&#x22;)]\n            S3a -->|Object API| OL1\n            OL1 -->|Storage API| SL1\n            SL1 <--> J1\n        end\n        subgraph N2[&#x22;Node 2&#x22;]\n            direction LR\n            S3b[S3]\n            subgraph OL2[&#x22;Object Layer&#x22;]\n                direction TB\n                C2[Cache]\n                K2[Compression]\n                E2[Encryption]\n                B2[&#x22;Erasure Code · Bitrot&#x22;]\n            end\n            SL2[&#x22;Storage Layer&#x22;]\n            J2[(&#x22;JBOD / FS disks&#x22;)]\n            S3b -->|Object API| OL2\n            OL2 -->|Storage API| SL2\n            SL2 <--> J2\n        end\n        NN[&#x22;Node n ...&#x22;]\n        N1 <-->|Internal RESTful API| N2\n        N2 <-->|Internal RESTful API| NN\n    end\n\n    S3API --> N1\n    S3API --> N2\n    S3API --> NN\n\n    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n    class APP,NN muted\n    class S3API accent\n    class S3a,S3b,SL1,SL2 server\n    class C1,K1,E1,B1,C2,K2,E2,B2 svc\n    class J1,J2 store\"\n/>\n\n***\n\n## Pre-Scaling Preparation [#pre-scaling-preparation]\n\n### 1.1 Hardware Planning Requirements [#11-hardware-planning-requirements]\n\n| Item                 | Minimum Requirements | Recommended Production Configuration |\n| -------------------- | -------------------- | ------------------------------------ |\n| Node Count           | 4 nodes/storage pool | 4 - 8 nodes/storage pool             |\n| Single Node Memory   | 128 GB               | 128 GB                               |\n| Disk Type            | SSD                  | NVMe SSD                             |\n| Single Disk Capacity | ≥1 TB                | ≥4 TB                                |\n| Network Bandwidth    | 10 Gbps              | 25 Gbps                              |\n\n### 1.2 System Environment Check [#12-system-environment-check]\n\n```bash\n# Check hostname continuity (new node example)\ncat /etc/hosts\n192.168.10.5 node5\n192.168.10.6 node6\n192.168.10.7 node7\n192.168.10.8 node8\n\n# Verify time synchronization status\ntimedatectl status | grep synchronized\n\n# Check firewall rules (all nodes need to open ports 9000/9001)\nfirewall-cmd --list-ports | grep 9000\nfirewall-cmd --list-ports | grep 9001\n```\n\n***\n\n## Scaling Implementation Steps [#scaling-implementation-steps]\n\n### 2.1 New Node Basic Configuration [#21-new-node-basic-configuration]\n\n```bash\n# Create dedicated user (execute on all new nodes)\ngroupadd rustfs-user\nuseradd -M -r -g rustfs-user rustfs-user\n\n# Create storage directories (example with 8 disks)\nmkdir -p /data/rustfs{0..7}\nchown -R rustfs-user:rustfs-user /data/rustfs*\n```\n\n### 2.2 Install RustFS Binary on all new nodes [#22-install-rustfs-binary-on-all-new-nodes]\n\n```bash\n# Check rustfs version on existing node\n/usr/local/bin/rustfs --version\n\n# Download the binary that matches the existing cluster version from\n# https://github.com/rustfs/rustfs/releases (asset name: rustfs-linux-x86_64-musl-v<version>.zip)\nwget https://github.com/rustfs/rustfs/releases/download/<version>/rustfs-linux-x86_64-musl-v<version>.zip\nunzip rustfs-linux-x86_64-musl-v<version>.zip\nchmod +x rustfs\nmv rustfs /usr/local/bin/\n```\n\n### 2.3 Create RustFS configuration file on all new nodes (/etc/default/rustfs) [#23-create-rustfs-configuration-file-on-all-new-nodes-etcdefaultrustfs]\n\n```bash\n# Create configuration file (/etc/default/rustfs)\n# Please replace <Your RustFS admin username> and <Secure password of your RustFS admin> with yours values!\ncat <<EOF > /etc/default/rustfs\nRUSTFS_ACCESS_KEY=<Your RustFS admin username> # e.g. admin\nRUSTFS_SECRET_KEY=<Secure password of your RustFS admin> # e.g. output of: openssl rand -base64 24\nRUSTFS_VOLUMES=\"http://node{1...4}:9000/data/rustfs{0...3} http://node{5...8}:9000/data/rustfs{0...7}\" # add new storage pool to the existing; must match the hostname pattern used by the existing nodes byte for byte\nRUSTFS_ADDRESS=\":9000\"\nRUSTFS_CONSOLE_ADDRESS=\":9001\"\nEOF\n```\n\n### 2.4 Configure System Service on all new nodes [#24-configure-system-service-on-all-new-nodes]\n\n```bash\n# Create systemd service file\n\nsudo tee /etc/systemd/system/rustfs.service <<EOF\n[Unit]\nDescription=RustFS Object Storage Server\nDocumentation=https://rustfs.com/docs/\nAfter=network-online.target\nWants=network-online.target\n\n[Service]\nType=notify\nNotifyAccess=main\nUser=root\nGroup=root\n\nWorkingDirectory=/usr/local\nEnvironmentFile=-/etc/default/rustfs\nExecStart=/usr/local/bin/rustfs \\$RUSTFS_VOLUMES\n\nLimitNOFILE=1048576\nLimitNPROC=32768\nTasksMax=infinity\n\nRestart=always\nRestartSec=10s\n\nOOMScoreAdjust=-1000\nSendSIGKILL=no\n\n# RustFS reports READY only after storage, IAM, and peer checks pass; on a\n# full-cluster restart every node waits for its peers, so allow up to 120s.\nTimeoutStartSec=120s\nTimeoutStopSec=30s\n\nNoNewPrivileges=true\nProtectHome=true\nPrivateTmp=true\nPrivateDevices=true\nProtectClock=true\nProtectKernelTunables=true\nProtectKernelModules=true\nProtectControlGroups=true\nRestrictSUIDSGID=true\nRestrictRealtime=true\n\n# service log configuration\nStandardOutput=append:/var/logs/rustfs/rustfs.log\nStandardError=append:/var/logs/rustfs/rustfs-err.log\n\n[Install]\nWantedBy=multi-user.target\nEOF\n```\n\n### 2.5 Reload service configuration on all new nodes [#25-reload-service-configuration-on-all-new-nodes]\n\n```bash\n#Reload service configuration\nsudo systemctl daemon-reload\n\n#Start service and set auto-start\nsudo systemctl enable --now rustfs\n```\n\n### 2.6 Cluster Scaling Operation on all existing nodes [#26-cluster-scaling-operation-on-all-existing-nodes]\n\n```bash\n# Update configuration on all existing nodes (following command will add new storage pool to the existing $RUSTFS_VOLUMES list)\nsed -i '/RUSTFS_VOLUMES/s|\"$| http://node{5...8}:9000/data/rustfs{0...7}\"|' /etc/default/rustfs\n```\n\n### 2.7 Cluster Scaling Operation on all nodes (existing and added) [#27-cluster-scaling-operation-on-all-nodes-existing-and-added]\n\n```bash\n# Global service restart (execute simultaneously on all nodes)\nsystemctl restart rustfs.service\n```\n\n***\n\n## Post-Scaling Verification [#post-scaling-verification]\n\n### 3.1 Check Server List in RustFS Console [#31-check-server-list-in-rustfs-console]\n\nOpen in the RustFS Console Performance menu, e.g. [http://node1:9001/rustfs/console/performance](http://node1:9001/rustfs/console/performance) and check node join status in the Server List\n\n### 3.2 Data Balance Verification [#32-data-balance-verification]\n\nNew objects are placed across pools according to available capacity. Check per-pool usage in the RustFS Console; it should trend toward each storage pool's capacity ratio. Existing data is not moved automatically — to spread it across the new pool, start a rebalance from the Console and expect it to run in the background for a while.\n\n***\n\n## Important Notes [#important-notes]\n\n1. **Restart Scope**: Changing `RUSTFS_VOLUMES` (adding a storage pool) requires restarting all nodes so they agree on the new topology — restart them together during this operation. For routine binary upgrades or parameter changes, use a rolling restart (one node at a time) to avoid downtime.\n2. **Capacity Planning Recommendation**: Should plan next scaling when storage usage reaches 70%\n3. **Performance Tuning Recommendations**:\n\n```bash\n# Adjust kernel parameters (all nodes)\necho \"vm.swappiness=10\" >> /etc/sysctl.conf\necho \"net.core.somaxconn=32768\" >> /etc/sysctl.conf\nsysctl -p\n```\n\n***\n\n## Troubleshooting Guide [#troubleshooting-guide]\n\n| Symptom                            | Check Point                               | Fix Command                               |\n| ---------------------------------- | ----------------------------------------- | ----------------------------------------- |\n| New nodes cannot join cluster      | Check port 9000 connectivity              | `telnet node5 9000`                       |\n| Uneven data distribution           | Check storage pool capacity configuration | Start a rebalance from the RustFS Console |\n| Console shows abnormal node status | Verify time synchronization status        | `chronyc sources`                         |\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "> Note: This document is based on the latest RustFS version. Please perform full data backup before scaling operations. For production environments, it's recommended to contact RustFS technical support engineers for solution review."
		},
		{
			"heading": "scaling-solution-overview",
			"content": "RustFS supports horizontal scaling by adding new storage pools (Server Pool). Each new storage pool must meet:"
		},
		{
			"heading": "scaling-solution-overview",
			"content": "Nodes within the storage pool must use **consecutive hostnames** (e.g., node5-node8)"
		},
		{
			"heading": "scaling-solution-overview",
			"content": "Single storage pool must use **same specifications** of disks (type/capacity/quantity)"
		},
		{
			"heading": "scaling-solution-overview",
			"content": "New storage pools must maintain **time synchronization** and **network connectivity** with existing clusters"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "Item"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "Minimum Requirements"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "Recommended Production Configuration"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "Node Count"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "4 nodes/storage pool"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "4 - 8 nodes/storage pool"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "Single Node Memory"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "128 GB"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "128 GB"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "Disk Type"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "SSD"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "NVMe SSD"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "Single Disk Capacity"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "≥1 TB"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "≥4 TB"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "Network Bandwidth"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "10 Gbps"
		},
		{
			"heading": "11-hardware-planning-requirements",
			"content": "25 Gbps"
		},
		{
			"heading": "31-check-server-list-in-rustfs-console",
			"content": "Open in the RustFS Console Performance menu, e.g. http\\://node1:9001/rustfs/console/performance and check node join status in the Server List"
		},
		{
			"heading": "32-data-balance-verification",
			"content": "New objects are placed across pools according to available capacity. Check per-pool usage in the RustFS Console; it should trend toward each storage pool's capacity ratio. Existing data is not moved automatically — to spread it across the new pool, start a rebalance from the Console and expect it to run in the background for a while."
		},
		{
			"heading": "important-notes",
			"content": "**Restart Scope**: Changing `RUSTFS_VOLUMES` (adding a storage pool) requires restarting all nodes so they agree on the new topology — restart them together during this operation. For routine binary upgrades or parameter changes, use a rolling restart (one node at a time) to avoid downtime."
		},
		{
			"heading": "important-notes",
			"content": "**Capacity Planning Recommendation**: Should plan next scaling when storage usage reaches 70%"
		},
		{
			"heading": "important-notes",
			"content": "**Performance Tuning Recommendations**:"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "Symptom"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "Check Point"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "Fix Command"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "New nodes cannot join cluster"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "Check port 9000 connectivity"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "`telnet node5 9000`"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "Uneven data distribution"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "Check storage pool capacity configuration"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "Start a rebalance from the RustFS Console"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "Console shows abnormal node status"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "Verify time synchronization status"
		},
		{
			"heading": "troubleshooting-guide",
			"content": "`chronyc sources`"
		}
	],
	"headings": [
		{
			"id": "scaling-solution-overview",
			"content": "Scaling Solution Overview"
		},
		{
			"id": "pre-scaling-preparation",
			"content": "Pre-Scaling Preparation"
		},
		{
			"id": "11-hardware-planning-requirements",
			"content": "1.1 Hardware Planning Requirements"
		},
		{
			"id": "12-system-environment-check",
			"content": "1.2 System Environment Check"
		},
		{
			"id": "scaling-implementation-steps",
			"content": "Scaling Implementation Steps"
		},
		{
			"id": "21-new-node-basic-configuration",
			"content": "2.1 New Node Basic Configuration"
		},
		{
			"id": "22-install-rustfs-binary-on-all-new-nodes",
			"content": "2.2 Install RustFS Binary on all new nodes"
		},
		{
			"id": "23-create-rustfs-configuration-file-on-all-new-nodes-etcdefaultrustfs",
			"content": "2.3 Create RustFS configuration file on all new nodes (/etc/default/rustfs)"
		},
		{
			"id": "24-configure-system-service-on-all-new-nodes",
			"content": "2.4 Configure System Service on all new nodes"
		},
		{
			"id": "25-reload-service-configuration-on-all-new-nodes",
			"content": "2.5 Reload service configuration on all new nodes"
		},
		{
			"id": "26-cluster-scaling-operation-on-all-existing-nodes",
			"content": "2.6 Cluster Scaling Operation on all existing nodes"
		},
		{
			"id": "27-cluster-scaling-operation-on-all-nodes-existing-and-added",
			"content": "2.7 Cluster Scaling Operation on all nodes (existing and added)"
		},
		{
			"id": "post-scaling-verification",
			"content": "Post-Scaling Verification"
		},
		{
			"id": "31-check-server-list-in-rustfs-console",
			"content": "3.1 Check Server List in RustFS Console"
		},
		{
			"id": "32-data-balance-verification",
			"content": "3.2 Data Balance Verification"
		},
		{
			"id": "important-notes",
			"content": "Important Notes"
		},
		{
			"id": "troubleshooting-guide",
			"content": "Troubleshooting Guide"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#scaling-solution-overview",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Scaling Solution Overview" })
	},
	{
		depth: 2,
		url: "#pre-scaling-preparation",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Pre-Scaling Preparation" })
	},
	{
		depth: 3,
		url: "#11-hardware-planning-requirements",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "1.1 Hardware Planning Requirements" })
	},
	{
		depth: 3,
		url: "#12-system-environment-check",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "1.2 System Environment Check" })
	},
	{
		depth: 2,
		url: "#scaling-implementation-steps",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Scaling Implementation Steps" })
	},
	{
		depth: 3,
		url: "#21-new-node-basic-configuration",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.1 New Node Basic Configuration" })
	},
	{
		depth: 3,
		url: "#22-install-rustfs-binary-on-all-new-nodes",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.2 Install RustFS Binary on all new nodes" })
	},
	{
		depth: 3,
		url: "#23-create-rustfs-configuration-file-on-all-new-nodes-etcdefaultrustfs",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.3 Create RustFS configuration file on all new nodes (/etc/default/rustfs)" })
	},
	{
		depth: 3,
		url: "#24-configure-system-service-on-all-new-nodes",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.4 Configure System Service on all new nodes" })
	},
	{
		depth: 3,
		url: "#25-reload-service-configuration-on-all-new-nodes",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.5 Reload service configuration on all new nodes" })
	},
	{
		depth: 3,
		url: "#26-cluster-scaling-operation-on-all-existing-nodes",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.6 Cluster Scaling Operation on all existing nodes" })
	},
	{
		depth: 3,
		url: "#27-cluster-scaling-operation-on-all-nodes-existing-and-added",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.7 Cluster Scaling Operation on all nodes (existing and added)" })
	},
	{
		depth: 2,
		url: "#post-scaling-verification",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Post-Scaling Verification" })
	},
	{
		depth: 3,
		url: "#31-check-server-list-in-rustfs-console",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "3.1 Check Server List in RustFS Console" })
	},
	{
		depth: 3,
		url: "#32-data-balance-verification",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "3.2 Data Balance Verification" })
	},
	{
		depth: 2,
		url: "#important-notes",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Important Notes" })
	},
	{
		depth: 2,
		url: "#troubleshooting-guide",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Troubleshooting Guide" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
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
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Note: This document is based on the latest RustFS version. Please perform full data backup before scaling operations. For production environments, it's recommended to contact RustFS technical support engineers for solution review." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "scaling-solution-overview",
			children: "Scaling Solution Overview"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports horizontal scaling by adding new storage pools (Server Pool). Each new storage pool must meet:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"Nodes within the storage pool must use ",
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "consecutive hostnames" }),
				" (e.g., node5-node8)"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"Single storage pool must use ",
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "same specifications" }),
				" of disks (type/capacity/quantity)"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"New storage pools must maintain ",
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "time synchronization" }),
				" and ",
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "network connectivity" }),
				" with existing clusters"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n    APP[Applications] --> S3API([\"S3 API\"])\n\n    subgraph DIST[\"Distributed RustFS\"]\n        direction TB\n        subgraph N1[\"Node 1\"]\n            direction LR\n            S3a[S3]\n            subgraph OL1[\"Object Layer\"]\n                direction TB\n                C1[Cache]\n                K1[Compression]\n                E1[Encryption]\n                B1[\"Erasure Code · Bitrot\"]\n            end\n            SL1[\"Storage Layer\"]\n            J1[(\"JBOD / FS disks\")]\n            S3a -->|Object API| OL1\n            OL1 -->|Storage API| SL1\n            SL1 <--> J1\n        end\n        subgraph N2[\"Node 2\"]\n            direction LR\n            S3b[S3]\n            subgraph OL2[\"Object Layer\"]\n                direction TB\n                C2[Cache]\n                K2[Compression]\n                E2[Encryption]\n                B2[\"Erasure Code · Bitrot\"]\n            end\n            SL2[\"Storage Layer\"]\n            J2[(\"JBOD / FS disks\")]\n            S3b -->|Object API| OL2\n            OL2 -->|Storage API| SL2\n            SL2 <--> J2\n        end\n        NN[\"Node n ...\"]\n        N1 <-->|Internal RESTful API| N2\n        N2 <-->|Internal RESTful API| NN\n    end\n\n    S3API --> N1\n    S3API --> N2\n    S3API --> NN\n\n    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n    class APP,NN muted\n    class S3API accent\n    class S3a,S3b,SL1,SL2 server\n    class C1,K1,E1,B1,C2,K2,E2,B2 svc\n    class J1,J2 store" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "pre-scaling-preparation",
			children: "Pre-Scaling Preparation"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "11-hardware-planning-requirements",
			children: "1.1 Hardware Planning Requirements"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Item" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Minimum Requirements" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Recommended Production Configuration" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Node Count" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "4 nodes/storage pool" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "4 - 8 nodes/storage pool" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Single Node Memory" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "128 GB" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "128 GB" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Disk Type" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "SSD" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "NVMe SSD" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Single Disk Capacity" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "≥1 TB" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "≥4 TB" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Network Bandwidth" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "10 Gbps" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "25 Gbps" })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "12-system-environment-check",
			children: "1.2 System Environment Check"
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
						children: "# Check hostname continuity (new node example)"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "cat"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " /etc/hosts"
					})]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "192.168.10.5"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " node5"
					})]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "192.168.10.6"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " node6"
					})]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "192.168.10.7"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " node7"
					})]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "192.168.10.8"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " node8"
					})]
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
						children: "# Verify time synchronization status"
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
							children: "timedatectl"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " status"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " |"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " grep"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " synchronized"
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
						children: "# Check firewall rules (all nodes need to open ports 9000/9001)"
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
							children: "firewall-cmd"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " --list-ports"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " |"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " grep"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 9000"
						})
					]
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
							children: "firewall-cmd"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " --list-ports"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " |"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " grep"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 9001"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "scaling-implementation-steps",
			children: "Scaling Implementation Steps"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "21-new-node-basic-configuration",
			children: "2.1 New Node Basic Configuration"
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
						children: "# Create dedicated user (execute on all new nodes)"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "groupadd"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " rustfs-user"
					})]
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
							children: "useradd"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -M"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -r"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -g"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " rustfs-user"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " rustfs-user"
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
						children: "# Create storage directories (example with 8 disks)"
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
							children: "mkdir"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -p"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " /data/rustfs{0..7}"
						})
					]
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
							children: "chown"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -R"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " rustfs-user:rustfs-user"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " /data/rustfs"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "*"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "22-install-rustfs-binary-on-all-new-nodes",
			children: "2.2 Install RustFS Binary on all new nodes"
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
						children: "# Check rustfs version on existing node"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "/usr/local/bin/rustfs"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: " --version"
					})]
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
						children: "# Download the binary that matches the existing cluster version from"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6A737D",
							"--shiki-dark": "#6A737D"
						},
						children: "# https://github.com/rustfs/rustfs/releases (asset name: rustfs-linux-x86_64-musl-v<version>.zip)"
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
							children: "wget"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " https://github.com/rustfs/rustfs/releases/download/"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "<"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "versio"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "n"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: ">"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "/rustfs-linux-x86_64-musl-v"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "<"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "versio"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "n"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: ">"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: ".zip"
						})
					]
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
							children: "unzip"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " rustfs-linux-x86_64-musl-v"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "<"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "versio"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "n"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: ">"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: ".zip"
						})
					]
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
							children: "chmod"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " +x"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " rustfs"
						})
					]
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
							children: "mv"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " rustfs"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " /usr/local/bin/"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "23-create-rustfs-configuration-file-on-all-new-nodes-etcdefaultrustfs",
			children: "2.3 Create RustFS configuration file on all new nodes (/etc/default/rustfs)"
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
						children: "# Create configuration file (/etc/default/rustfs)"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6A737D",
							"--shiki-dark": "#6A737D"
						},
						children: "# Please replace <Your RustFS admin username> and <Secure password of your RustFS admin> with yours values!"
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
							children: "cat"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " <<"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "EOF"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " >"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " /etc/default/rustfs"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "RUSTFS_ACCESS_KEY=<Your RustFS admin username> # e.g. admin"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "RUSTFS_SECRET_KEY=<Secure password of your RustFS admin> # e.g. output of: openssl rand -base64 24"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "RUSTFS_VOLUMES=\"http://node{1...4}:9000/data/rustfs{0...3} http://node{5...8}:9000/data/rustfs{0...7}\" # add new storage pool to the existing; must match the hostname pattern used by the existing nodes byte for byte"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "RUSTFS_ADDRESS=\":9000\""
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "RUSTFS_CONSOLE_ADDRESS=\":9001\""
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "EOF"
					})
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "24-configure-system-service-on-all-new-nodes",
			children: "2.4 Configure System Service on all new nodes"
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
						children: "# Create systemd service file"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "sudo"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " tee"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " /etc/systemd/system/rustfs.service"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " <<"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "EOF"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "[Unit]"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "Description=RustFS Object Storage Server"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "Documentation=https://rustfs.com/docs/"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "After=network-online.target"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "Wants=network-online.target"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "[Service]"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "Type=notify"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "NotifyAccess=main"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "User=root"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "Group=root"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "WorkingDirectory=/usr/local"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "EnvironmentFile=-/etc/default/rustfs"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "ExecStart=/usr/local/bin/rustfs "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "\\$"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "RUSTFS_VOLUMES"
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
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "LimitNOFILE=1048576"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "LimitNPROC=32768"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "TasksMax=infinity"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "Restart=always"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "RestartSec=10s"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "OOMScoreAdjust=-1000"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "SendSIGKILL=no"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "# RustFS reports READY only after storage, IAM, and peer checks pass; on a"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "# full-cluster restart every node waits for its peers, so allow up to 120s."
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "TimeoutStartSec=120s"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "TimeoutStopSec=30s"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "NoNewPrivileges=true"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "ProtectHome=true"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "PrivateTmp=true"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "PrivateDevices=true"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "ProtectClock=true"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "ProtectKernelTunables=true"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "ProtectKernelModules=true"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "ProtectControlGroups=true"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "RestrictSUIDSGID=true"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "RestrictRealtime=true"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "# service log configuration"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "StandardOutput=append:/var/logs/rustfs/rustfs.log"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "StandardError=append:/var/logs/rustfs/rustfs-err.log"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "[Install]"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "WantedBy=multi-user.target"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "EOF"
					})
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "25-reload-service-configuration-on-all-new-nodes",
			children: "2.5 Reload service configuration on all new nodes"
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
						children: "#Reload service configuration"
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
							children: "sudo"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " systemctl"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " daemon-reload"
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
						children: "#Start service and set auto-start"
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
							children: "sudo"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " systemctl"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " enable"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " --now"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " rustfs"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "26-cluster-scaling-operation-on-all-existing-nodes",
			children: "2.6 Cluster Scaling Operation on all existing nodes"
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
						children: "# Update configuration on all existing nodes (following command will add new storage pool to the existing $RUSTFS_VOLUMES list)"
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
							children: "sed"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -i"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " '/RUSTFS_VOLUMES/s|\"$| http://node{5...8}:9000/data/rustfs{0...7}\"|'"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " /etc/default/rustfs"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "27-cluster-scaling-operation-on-all-nodes-existing-and-added",
			children: "2.7 Cluster Scaling Operation on all nodes (existing and added)"
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
						children: "# Global service restart (execute simultaneously on all nodes)"
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
							children: "systemctl"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " restart"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " rustfs.service"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "post-scaling-verification",
			children: "Post-Scaling Verification"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "31-check-server-list-in-rustfs-console",
			children: "3.1 Check Server List in RustFS Console"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Open in the RustFS Console Performance menu, e.g. ",
			(0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "http://node1:9001/rustfs/console/performance",
				children: "http://node1:9001/rustfs/console/performance"
			}),
			" and check node join status in the Server List"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "32-data-balance-verification",
			children: "3.2 Data Balance Verification"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "New objects are placed across pools according to available capacity. Check per-pool usage in the RustFS Console; it should trend toward each storage pool's capacity ratio. Existing data is not moved automatically — to spread it across the new pool, start a rebalance from the Console and expect it to run in the background for a while." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "important-notes",
			children: "Important Notes"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Restart Scope" }),
				": Changing ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_VOLUMES" }),
				" (adding a storage pool) requires restarting all nodes so they agree on the new topology — restart them together during this operation. For routine binary upgrades or parameter changes, use a rolling restart (one node at a time) to avoid downtime."
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Capacity Planning Recommendation" }), ": Should plan next scaling when storage usage reaches 70%"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Performance Tuning Recommendations" }), ":"] }),
			"\n"
		] }),
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
						children: "# Adjust kernel parameters (all nodes)"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "echo"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"vm.swappiness=10\""
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " >>"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " /etc/sysctl.conf"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "echo"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"net.core.somaxconn=32768\""
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " >>"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " /etc/sysctl.conf"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "sysctl"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: " -p"
					})]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "troubleshooting-guide",
			children: "Troubleshooting Guide"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Symptom" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Check Point" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Fix Command" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "New nodes cannot join cluster" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Check port 9000 connectivity" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "telnet node5 9000" }) })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Uneven data distribution" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Check storage pool capacity configuration" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Start a rebalance from the RustFS Console" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Console shows abnormal node status" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Verify time synchronization status" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "chronyc sources" }) })
			] })
		] })] })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime_react_server.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime_react_server.jsx)(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
export { _markdown, MDXContent as default, frontmatter, structuredData, toc };
