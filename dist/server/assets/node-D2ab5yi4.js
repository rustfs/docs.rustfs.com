import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/troubleshooting/node.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Node Failures",
	"description": "Complete steps for handling node failures in RustFS clusters. Mainly includes: replacement node hardware preparation, configuration updates, service deployment, rejoining the cluster, data healing, and subsequent checks and best practices."
};
var _markdown = "\n\nIn distributed RustFS clusters, erasure coding mechanisms are adopted to ensure read/write access can still be provided when some nodes fail, and automatic data healing occurs after nodes rejoin. This document will guide you through the following process:\n\n1. Start replacement node and synchronize environment\n2. Update DNS/hostname to point old node identifiers to new nodes\n3. Download and deploy RustFS services consistent with the cluster\n4. Rejoin new nodes to the cluster and trigger data healing\n5. Monitor healing progress and perform subsequent checks and optimization\n\n## 1) Start Replacement Node [#1-start-replacement-node]\n\n* **Hardware and System Preparation**\n  Ensure the replacement node server hardware is roughly consistent with the failed node, including CPU, memory, network configuration, and disk type; even using higher configurations won't affect cluster performance.\n  Software environment needs to maintain version consistency with other nodes (operating system, kernel, dependency libraries, etc.) to avoid cluster abnormal behavior caused by environment differences.\n\n* **Drive Exclusive Access**\n  As with physical drive operations, RustFS requires exclusive access to storage volumes, prohibiting any other processes or scripts from directly modifying data within storage volumes, otherwise data corruption or redundancy loss can easily occur.\n\n## 2) Update Hostname and Network Resolution [#2-update-hostname-and-network-resolution]\n\n* **DNS/Hosts Configuration**\n  If the replacement node's IP address differs from the failed node, you need to re-resolve the old node's hostname (such as `rustfs-node-2.example.net`) to the new node to ensure nodes within the cluster discover each other through the same address.\n\n```bash\n# Example: Add or modify line in /etc/hosts\n192.168.1.12 rustfs-node-2.example.net\n```\n\nAfter correct resolution, you can verify the hostname points to the new node through `ping` or `nslookup`.\n\n## 3) Deploy and Configure RustFS Services [#3-deploy-and-configure-rustfs-services]\n\n* **Download and Installation**\n  Follow the same version deployment process as RustFS official, download binaries or installation packages consistent with existing nodes, and extract to a unified directory. Ensure startup scripts, environment variables, and configuration files (such as `/etc/default/rustfs`) are completely consistent with other nodes in the cluster.\n\n* **Configuration Verification**\n\n* Check that `RUSTFS_VOLUMES` in `/etc/default/rustfs` is byte-for-byte identical to the other nodes, and that it covers the replacement node's hostname and port.\n\n* Ensure all nodes have the same access keys and permission configurations to avoid new nodes being unable to join due to authentication failures.\n\n## 4) Rejoin Cluster and Trigger Data Healing [#4-rejoin-cluster-and-trigger-data-healing]\n\n* **Start Service**\n\n```bash\nsystemctl start rustfs\n```\n\nOr use your custom startup script to start RustFS services, and view startup logs through `journalctl -u rustfs -f` to confirm the new node has detected other online nodes and started the data healing process.\n\n* **Monitor Healing Status**\n  Healing runs in the background once the node rejoins; no manual command is required. Watch its progress through the service logs on the replacement node, and check node and disk status in the RustFS Console:\n\n```bash\njournalctl -u rustfs -f\n```\n\n* **Community Experience Reference**\n  Community testing shows that when nodes go offline and rejoin, RustFS will only perform healing operations on new nodes, not fully rebalance the cluster, thus avoiding unnecessary network and I/O peaks.\n\n## 5) Subsequent Checks and Best Practices [#5-subsequent-checks-and-best-practices]\n\n* **Monitoring and Alerts**\n\n* During healing, monitor disk and network load to ensure the cluster meets read/write and network bandwidth requirements.\n\n* Set up alerts to notify operations teams when node healing fails or progress stalls beyond thresholds.\n\n* **Repeated Failure Drills**\n  Regularly simulate node failures and drill the entire recovery process to ensure team familiarity with operation commands and emergency procedures.\n\n* **Root Cause Analysis**\n  Conduct in-depth hardware health diagnostics (SMART, BIOS logs, etc.) on frequently failing nodes or disks, and implement preventive maintenance plans.\n\n* **Professional Support**\n  If deeper-level fault location and recovery guidance is needed, contact the RustFS development team or community for help.\n\n***\n\n**Summary**: Through the above process, RustFS can quickly and safely replace nodes and complete data healing after node hardware completely fails, minimizing cluster availability interruptions. Be sure to cross-reference with your own environment and specific command-line tools to ensure configuration consistency and correct operation sequence.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "In distributed RustFS clusters, erasure coding mechanisms are adopted to ensure read/write access can still be provided when some nodes fail, and automatic data healing occurs after nodes rejoin. This document will guide you through the following process:"
		},
		{
			"heading": void 0,
			"content": "Start replacement node and synchronize environment"
		},
		{
			"heading": void 0,
			"content": "Update DNS/hostname to point old node identifiers to new nodes"
		},
		{
			"heading": void 0,
			"content": "Download and deploy RustFS services consistent with the cluster"
		},
		{
			"heading": void 0,
			"content": "Rejoin new nodes to the cluster and trigger data healing"
		},
		{
			"heading": void 0,
			"content": "Monitor healing progress and perform subsequent checks and optimization"
		},
		{
			"heading": "1-start-replacement-node",
			"content": "**Hardware and System Preparation**\nEnsure the replacement node server hardware is roughly consistent with the failed node, including CPU, memory, network configuration, and disk type; even using higher configurations won't affect cluster performance.\nSoftware environment needs to maintain version consistency with other nodes (operating system, kernel, dependency libraries, etc.) to avoid cluster abnormal behavior caused by environment differences."
		},
		{
			"heading": "1-start-replacement-node",
			"content": "**Drive Exclusive Access**\nAs with physical drive operations, RustFS requires exclusive access to storage volumes, prohibiting any other processes or scripts from directly modifying data within storage volumes, otherwise data corruption or redundancy loss can easily occur."
		},
		{
			"heading": "2-update-hostname-and-network-resolution",
			"content": "**DNS/Hosts Configuration**\nIf the replacement node's IP address differs from the failed node, you need to re-resolve the old node's hostname (such as `rustfs-node-2.example.net`) to the new node to ensure nodes within the cluster discover each other through the same address."
		},
		{
			"heading": "2-update-hostname-and-network-resolution",
			"content": "After correct resolution, you can verify the hostname points to the new node through `ping` or `nslookup`."
		},
		{
			"heading": "3-deploy-and-configure-rustfs-services",
			"content": "**Download and Installation**\nFollow the same version deployment process as RustFS official, download binaries or installation packages consistent with existing nodes, and extract to a unified directory. Ensure startup scripts, environment variables, and configuration files (such as `/etc/default/rustfs`) are completely consistent with other nodes in the cluster."
		},
		{
			"heading": "3-deploy-and-configure-rustfs-services",
			"content": "**Configuration Verification**"
		},
		{
			"heading": "3-deploy-and-configure-rustfs-services",
			"content": "Check that `RUSTFS_VOLUMES` in `/etc/default/rustfs` is byte-for-byte identical to the other nodes, and that it covers the replacement node's hostname and port."
		},
		{
			"heading": "3-deploy-and-configure-rustfs-services",
			"content": "Ensure all nodes have the same access keys and permission configurations to avoid new nodes being unable to join due to authentication failures."
		},
		{
			"heading": "4-rejoin-cluster-and-trigger-data-healing",
			"content": "**Start Service**"
		},
		{
			"heading": "4-rejoin-cluster-and-trigger-data-healing",
			"content": "Or use your custom startup script to start RustFS services, and view startup logs through `journalctl -u rustfs -f` to confirm the new node has detected other online nodes and started the data healing process."
		},
		{
			"heading": "4-rejoin-cluster-and-trigger-data-healing",
			"content": "**Monitor Healing Status**\nHealing runs in the background once the node rejoins; no manual command is required. Watch its progress through the service logs on the replacement node, and check node and disk status in the RustFS Console:"
		},
		{
			"heading": "4-rejoin-cluster-and-trigger-data-healing",
			"content": "**Community Experience Reference**\nCommunity testing shows that when nodes go offline and rejoin, RustFS will only perform healing operations on new nodes, not fully rebalance the cluster, thus avoiding unnecessary network and I/O peaks."
		},
		{
			"heading": "5-subsequent-checks-and-best-practices",
			"content": "**Monitoring and Alerts**"
		},
		{
			"heading": "5-subsequent-checks-and-best-practices",
			"content": "During healing, monitor disk and network load to ensure the cluster meets read/write and network bandwidth requirements."
		},
		{
			"heading": "5-subsequent-checks-and-best-practices",
			"content": "Set up alerts to notify operations teams when node healing fails or progress stalls beyond thresholds."
		},
		{
			"heading": "5-subsequent-checks-and-best-practices",
			"content": "**Repeated Failure Drills**\nRegularly simulate node failures and drill the entire recovery process to ensure team familiarity with operation commands and emergency procedures."
		},
		{
			"heading": "5-subsequent-checks-and-best-practices",
			"content": "**Root Cause Analysis**\nConduct in-depth hardware health diagnostics (SMART, BIOS logs, etc.) on frequently failing nodes or disks, and implement preventive maintenance plans."
		},
		{
			"heading": "5-subsequent-checks-and-best-practices",
			"content": "**Professional Support**\nIf deeper-level fault location and recovery guidance is needed, contact the RustFS development team or community for help."
		},
		{
			"heading": "5-subsequent-checks-and-best-practices",
			"content": "**Summary**: Through the above process, RustFS can quickly and safely replace nodes and complete data healing after node hardware completely fails, minimizing cluster availability interruptions. Be sure to cross-reference with your own environment and specific command-line tools to ensure configuration consistency and correct operation sequence."
		}
	],
	"headings": [
		{
			"id": "1-start-replacement-node",
			"content": "1\\) Start Replacement Node"
		},
		{
			"id": "2-update-hostname-and-network-resolution",
			"content": "2\\) Update Hostname and Network Resolution"
		},
		{
			"id": "3-deploy-and-configure-rustfs-services",
			"content": "3\\) Deploy and Configure RustFS Services"
		},
		{
			"id": "4-rejoin-cluster-and-trigger-data-healing",
			"content": "4\\) Rejoin Cluster and Trigger Data Healing"
		},
		{
			"id": "5-subsequent-checks-and-best-practices",
			"content": "5\\) Subsequent Checks and Best Practices"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#1-start-replacement-node",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "1) Start Replacement Node" })
	},
	{
		depth: 2,
		url: "#2-update-hostname-and-network-resolution",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2) Update Hostname and Network Resolution" })
	},
	{
		depth: 2,
		url: "#3-deploy-and-configure-rustfs-services",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "3) Deploy and Configure RustFS Services" })
	},
	{
		depth: 2,
		url: "#4-rejoin-cluster-and-trigger-data-healing",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "4) Rejoin Cluster and Trigger Data Healing" })
	},
	{
		depth: 2,
		url: "#5-subsequent-checks-and-best-practices",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5) Subsequent Checks and Best Practices" })
	}
];
function _createMdxContent(props) {
	const _components = {
		code: "code",
		h2: "h2",
		hr: "hr",
		li: "li",
		ol: "ol",
		p: "p",
		pre: "pre",
		span: "span",
		strong: "strong",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "In distributed RustFS clusters, erasure coding mechanisms are adopted to ensure read/write access can still be provided when some nodes fail, and automatic data healing occurs after nodes rejoin. This document will guide you through the following process:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Start replacement node and synchronize environment" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Update DNS/hostname to point old node identifiers to new nodes" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Download and deploy RustFS services consistent with the cluster" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Rejoin new nodes to the cluster and trigger data healing" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Monitor healing progress and perform subsequent checks and optimization" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "1-start-replacement-node",
			children: "1) Start Replacement Node"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Hardware and System Preparation" }), "\nEnsure the replacement node server hardware is roughly consistent with the failed node, including CPU, memory, network configuration, and disk type; even using higher configurations won't affect cluster performance.\nSoftware environment needs to maintain version consistency with other nodes (operating system, kernel, dependency libraries, etc.) to avoid cluster abnormal behavior caused by environment differences."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Drive Exclusive Access" }), "\nAs with physical drive operations, RustFS requires exclusive access to storage volumes, prohibiting any other processes or scripts from directly modifying data within storage volumes, otherwise data corruption or redundancy loss can easily occur."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "2-update-hostname-and-network-resolution",
			children: "2) Update Hostname and Network Resolution"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "DNS/Hosts Configuration" }),
				"\nIf the replacement node's IP address differs from the failed node, you need to re-resolve the old node's hostname (such as ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs-node-2.example.net" }),
				") to the new node to ensure nodes within the cluster discover each other through the same address."
			] }),
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
						children: "# Example: Add or modify line in /etc/hosts"
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
						children: "192.168.1.12"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " rustfs-node-2.example.net"
					})]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"After correct resolution, you can verify the hostname points to the new node through ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "ping" }),
			" or ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "nslookup" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "3-deploy-and-configure-rustfs-services",
			children: "3) Deploy and Configure RustFS Services"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
					(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Download and Installation" }),
					"\nFollow the same version deployment process as RustFS official, download binaries or installation packages consistent with existing nodes, and extract to a unified directory. Ensure startup scripts, environment variables, and configuration files (such as ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/etc/default/rustfs" }),
					") are completely consistent with other nodes in the cluster."
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Configuration Verification" }) }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
					"Check that ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_VOLUMES" }),
					" in ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/etc/default/rustfs" }),
					" is byte-for-byte identical to the other nodes, and that it covers the replacement node's hostname and port."
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Ensure all nodes have the same access keys and permission configurations to avoid new nodes being unable to join due to authentication failures." }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "4-rejoin-cluster-and-trigger-data-healing",
			children: "4) Rejoin Cluster and Trigger Data Healing"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Start Service" }) }),
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
			children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
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
						children: " start"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " rustfs"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Or use your custom startup script to start RustFS services, and view startup logs through ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "journalctl -u rustfs -f" }),
			" to confirm the new node has detected other online nodes and started the data healing process."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Monitor Healing Status" }), "\nHealing runs in the background once the node rejoins; no manual command is required. Watch its progress through the service logs on the replacement node, and check node and disk status in the RustFS Console:"] }),
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
			children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
				className: "line",
				children: [
					(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "journalctl"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: " -u"
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
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: " -f"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Community Experience Reference" }), "\nCommunity testing shows that when nodes go offline and rejoin, RustFS will only perform healing operations on new nodes, not fully rebalance the cluster, thus avoiding unnecessary network and I/O peaks."] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "5-subsequent-checks-and-best-practices",
			children: "5) Subsequent Checks and Best Practices"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Monitoring and Alerts" }) }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "During healing, monitor disk and network load to ensure the cluster meets read/write and network bandwidth requirements." }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Set up alerts to notify operations teams when node healing fails or progress stalls beyond thresholds." }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Repeated Failure Drills" }), "\nRegularly simulate node failures and drill the entire recovery process to ensure team familiarity with operation commands and emergency procedures."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Root Cause Analysis" }), "\nConduct in-depth hardware health diagnostics (SMART, BIOS logs, etc.) on frequently failing nodes or disks, and implement preventive maintenance plans."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Professional Support" }), "\nIf deeper-level fault location and recovery guidance is needed, contact the RustFS development team or community for help."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Summary" }), ": Through the above process, RustFS can quickly and safely replace nodes and complete data healing after node hardware completely fails, minimizing cluster availability interruptions. Be sure to cross-reference with your own environment and specific command-line tools to ensure configuration consistency and correct operation sequence."] })
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
