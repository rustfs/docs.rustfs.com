import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/installation/checklists/network-checklists.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Network Checklist",
	"description": "Network checklist for enterprise deployments."
};
var _markdown = "\n\n## Network Architecture [#network-architecture]\n\n### Planning [#planning]\n\n* **Topology**\n  Verify the architecture (star/ring/mesh) meets high availability requirements.\n* **Redundancy**\n  Ensure at least two independent physical links between nodes.\n* **Bandwidth**\n  Calculate estimated traffic: object storage read/write bandwidth × node count × replica count + 20% redundancy.\n\n### IP Allocation [#ip-allocation]\n\n* [ ] Separate management network from data network.\n* [ ] Allocate continuous IP segments for storage nodes (recommend /24 subnet).\n* [ ] Reserve at least 15% of IP addresses for expansion.\n\n***\n\n## Hardware Requirements [#hardware-requirements]\n\n### Switches [#switches]\n\n| Check Item          | Requirements                                      |\n| ------------------- | ------------------------------------------------- |\n| Backplane Bandwidth | ≥ Full port line rate forwarding capability × 1.2 |\n| Port Type           | 10G/25G/100G SFP+/QSFP+ fiber ports               |\n| Flow Table Capacity | ≥ Node count × 5                                  |\n| Spanning Tree       | Enable RSTP/MSTP fast convergence                 |\n\n### Cabling [#cabling]\n\n* [ ] Fiber attenuation test (single mode ≤0.35dB/km).\n* [ ] Port misalignment check (Node A eth0 ↔ Node B eth0).\n* [ ] Cable labeling (including source/destination IP + port number).\n\n***\n\n## OS Configuration [#os-configuration]\n\n### Kernel Tuning [#kernel-tuning]\n\n```bash\n# Check the following parameter settings\nnet.core.rmem_max = 16777216\nnet.core.wmem_max = 16777216\nnet.ipv4.tcp_keepalive_time = 600\nnet.ipv4.tcp_slow_start_after_idle = 0\n```\n\n### NIC Configuration [#nic-configuration]\n\n* [ ] Enable jumbo frames (MTU=9000, requires full path support).\n* [ ] Verify bonding mode (recommend LACP mode4).\n* [ ] Disable IPv6 (if not needed).\n\n***\n\n## Security [#security]\n\n### Firewall [#firewall]\n\n```text\n# Necessary open ports\n- TCP 9000 (S3 API; also used for internal node-to-node communication)\n- TCP 9001 (RustFS Console)\n- TCP 443 (only if you terminate HTTPS on a reverse proxy / load balancer)\n```\n\n### Access Control [#access-control]\n\n* Switch port security MAC restrictions.\n* IPSec tunnel encryption between storage nodes.\n* Enable TLS 1.3 for management interfaces.\n\n***\n\n## Performance Testing [#performance-testing]\n\n### Benchmarks [#benchmarks]\n\n1. Inter-node latency: `ping -c 20 <target IP>` (run `iperf3 -s` on the target first for throughput tests)\n2. Cross-rack bandwidth: `iperf3 -c <target IP> -P 8 -t 30`\n3. Failover: Randomly disconnect core links to observe recovery time.\n\n### Criteria [#criteria]\n\n| Metric                | Requirements                       |\n| --------------------- | ---------------------------------- |\n| Node Latency          | ≤1ms (same room) / ≤5ms (cross AZ) |\n| Bandwidth Utilization | Peak ≤70% of design capacity       |\n| Failover              | \\< 500ms BPDU convergence          |\n\n***\n\n## Documentation Requirements [#documentation-requirements]\n\n1. Network topology diagram (including physical connections and logical IPs)\n2. Switch configuration backup files (with timestamps)\n3. Baseline test reports (including raw data)\n4. Change record table (including maintenance window information)\n\n<Callout type=\"info\">\n  Recommend conducting 72-hour stress testing before formal deployment, simulating 110% peak traffic load scenarios\n</Callout>\n\nThis checklist covers key checkpoints for enterprise storage system network deployment, specifically optimized parameter requirements for distributed object storage characteristics. You can contact RustFS for official technical support.\n";
var structuredData = {
	"contents": [
		{
			"heading": "planning",
			"content": "**Topology**\nVerify the architecture (star/ring/mesh) meets high availability requirements."
		},
		{
			"heading": "planning",
			"content": "**Redundancy**\nEnsure at least two independent physical links between nodes."
		},
		{
			"heading": "planning",
			"content": "**Bandwidth**\nCalculate estimated traffic: object storage read/write bandwidth × node count × replica count + 20% redundancy."
		},
		{
			"heading": "ip-allocation",
			"content": "Separate management network from data network."
		},
		{
			"heading": "ip-allocation",
			"content": "Allocate continuous IP segments for storage nodes (recommend /24 subnet)."
		},
		{
			"heading": "ip-allocation",
			"content": "Reserve at least 15% of IP addresses for expansion."
		},
		{
			"heading": "switches",
			"content": "Check Item"
		},
		{
			"heading": "switches",
			"content": "Requirements"
		},
		{
			"heading": "switches",
			"content": "Backplane Bandwidth"
		},
		{
			"heading": "switches",
			"content": "≥ Full port line rate forwarding capability × 1.2"
		},
		{
			"heading": "switches",
			"content": "Port Type"
		},
		{
			"heading": "switches",
			"content": "10G/25G/100G SFP+/QSFP+ fiber ports"
		},
		{
			"heading": "switches",
			"content": "Flow Table Capacity"
		},
		{
			"heading": "switches",
			"content": "≥ Node count × 5"
		},
		{
			"heading": "switches",
			"content": "Spanning Tree"
		},
		{
			"heading": "switches",
			"content": "Enable RSTP/MSTP fast convergence"
		},
		{
			"heading": "cabling",
			"content": "Fiber attenuation test (single mode ≤0.35dB/km)."
		},
		{
			"heading": "cabling",
			"content": "Port misalignment check (Node A eth0 ↔ Node B eth0)."
		},
		{
			"heading": "cabling",
			"content": "Cable labeling (including source/destination IP + port number)."
		},
		{
			"heading": "nic-configuration",
			"content": "Enable jumbo frames (MTU=9000, requires full path support)."
		},
		{
			"heading": "nic-configuration",
			"content": "Verify bonding mode (recommend LACP mode4)."
		},
		{
			"heading": "nic-configuration",
			"content": "Disable IPv6 (if not needed)."
		},
		{
			"heading": "access-control",
			"content": "Switch port security MAC restrictions."
		},
		{
			"heading": "access-control",
			"content": "IPSec tunnel encryption between storage nodes."
		},
		{
			"heading": "access-control",
			"content": "Enable TLS 1.3 for management interfaces."
		},
		{
			"heading": "benchmarks",
			"content": "Inter-node latency: `ping -c 20 <target IP>` (run `iperf3 -s` on the target first for throughput tests)"
		},
		{
			"heading": "benchmarks",
			"content": "Cross-rack bandwidth: `iperf3 -c <target IP> -P 8 -t 30`"
		},
		{
			"heading": "benchmarks",
			"content": "Failover: Randomly disconnect core links to observe recovery time."
		},
		{
			"heading": "criteria",
			"content": "Metric"
		},
		{
			"heading": "criteria",
			"content": "Requirements"
		},
		{
			"heading": "criteria",
			"content": "Node Latency"
		},
		{
			"heading": "criteria",
			"content": "≤1ms (same room) / ≤5ms (cross AZ)"
		},
		{
			"heading": "criteria",
			"content": "Bandwidth Utilization"
		},
		{
			"heading": "criteria",
			"content": "Peak ≤70% of design capacity"
		},
		{
			"heading": "criteria",
			"content": "Failover"
		},
		{
			"heading": "criteria",
			"content": "\\< 500ms BPDU convergence"
		},
		{
			"heading": "documentation-requirements",
			"content": "Network topology diagram (including physical connections and logical IPs)"
		},
		{
			"heading": "documentation-requirements",
			"content": "Switch configuration backup files (with timestamps)"
		},
		{
			"heading": "documentation-requirements",
			"content": "Baseline test reports (including raw data)"
		},
		{
			"heading": "documentation-requirements",
			"content": "Change record table (including maintenance window information)"
		},
		{
			"heading": "documentation-requirements",
			"content": ":::tip"
		},
		{
			"heading": "documentation-requirements",
			"content": "Recommend conducting 72-hour stress testing before formal deployment, simulating 110% peak traffic load scenarios"
		},
		{
			"heading": "documentation-requirements",
			"content": ":::"
		},
		{
			"heading": "documentation-requirements",
			"content": "This checklist covers key checkpoints for enterprise storage system network deployment, specifically optimized parameter requirements for distributed object storage characteristics. You can contact RustFS for official technical support."
		}
	],
	"headings": [
		{
			"id": "network-architecture",
			"content": "Network Architecture"
		},
		{
			"id": "planning",
			"content": "Planning"
		},
		{
			"id": "ip-allocation",
			"content": "IP Allocation"
		},
		{
			"id": "hardware-requirements",
			"content": "Hardware Requirements"
		},
		{
			"id": "switches",
			"content": "Switches"
		},
		{
			"id": "cabling",
			"content": "Cabling"
		},
		{
			"id": "os-configuration",
			"content": "OS Configuration"
		},
		{
			"id": "kernel-tuning",
			"content": "Kernel Tuning"
		},
		{
			"id": "nic-configuration",
			"content": "NIC Configuration"
		},
		{
			"id": "security",
			"content": "Security"
		},
		{
			"id": "firewall",
			"content": "Firewall"
		},
		{
			"id": "access-control",
			"content": "Access Control"
		},
		{
			"id": "performance-testing",
			"content": "Performance Testing"
		},
		{
			"id": "benchmarks",
			"content": "Benchmarks"
		},
		{
			"id": "criteria",
			"content": "Criteria"
		},
		{
			"id": "documentation-requirements",
			"content": "Documentation Requirements"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#network-architecture",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Network Architecture" })
	},
	{
		depth: 3,
		url: "#planning",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Planning" })
	},
	{
		depth: 3,
		url: "#ip-allocation",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "IP Allocation" })
	},
	{
		depth: 2,
		url: "#hardware-requirements",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Hardware Requirements" })
	},
	{
		depth: 3,
		url: "#switches",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Switches" })
	},
	{
		depth: 3,
		url: "#cabling",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Cabling" })
	},
	{
		depth: 2,
		url: "#os-configuration",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "OS Configuration" })
	},
	{
		depth: 3,
		url: "#kernel-tuning",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Kernel Tuning" })
	},
	{
		depth: 3,
		url: "#nic-configuration",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "NIC Configuration" })
	},
	{
		depth: 2,
		url: "#security",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Security" })
	},
	{
		depth: 3,
		url: "#firewall",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Firewall" })
	},
	{
		depth: 3,
		url: "#access-control",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Access Control" })
	},
	{
		depth: 2,
		url: "#performance-testing",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Performance Testing" })
	},
	{
		depth: 3,
		url: "#benchmarks",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Benchmarks" })
	},
	{
		depth: 3,
		url: "#criteria",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Criteria" })
	},
	{
		depth: 2,
		url: "#documentation-requirements",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Documentation Requirements" })
	}
];
function _createMdxContent(props) {
	const _components = {
		code: "code",
		h2: "h2",
		h3: "h3",
		hr: "hr",
		input: "input",
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
	}, { Callout } = _components;
	if (!Callout) _missingMdxReference("Callout", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "network-architecture",
			children: "Network Architecture"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "planning",
			children: "Planning"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Topology" }), "\nVerify the architecture (star/ring/mesh) meets high availability requirements."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Redundancy" }), "\nEnsure at least two independent physical links between nodes."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Bandwidth" }), "\nCalculate estimated traffic: object storage read/write bandwidth × node count × replica count + 20% redundancy."] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "ip-allocation",
			children: "IP Allocation"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, {
			className: "contains-task-list",
			children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, {
					className: "task-list-item",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.input, {
							type: "checkbox",
							disabled: true
						}),
						" ",
						"Separate management network from data network."
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, {
					className: "task-list-item",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.input, {
							type: "checkbox",
							disabled: true
						}),
						" ",
						"Allocate continuous IP segments for storage nodes (recommend /24 subnet)."
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, {
					className: "task-list-item",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.input, {
							type: "checkbox",
							disabled: true
						}),
						" ",
						"Reserve at least 15% of IP addresses for expansion."
					]
				}),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "hardware-requirements",
			children: "Hardware Requirements"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "switches",
			children: "Switches"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Check Item" }), (0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Requirements" })] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Backplane Bandwidth" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "≥ Full port line rate forwarding capability × 1.2" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Port Type" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "10G/25G/100G SFP+/QSFP+ fiber ports" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Flow Table Capacity" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "≥ Node count × 5" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Spanning Tree" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Enable RSTP/MSTP fast convergence" })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "cabling",
			children: "Cabling"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, {
			className: "contains-task-list",
			children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, {
					className: "task-list-item",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.input, {
							type: "checkbox",
							disabled: true
						}),
						" ",
						"Fiber attenuation test (single mode ≤0.35dB/km)."
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, {
					className: "task-list-item",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.input, {
							type: "checkbox",
							disabled: true
						}),
						" ",
						"Port misalignment check (Node A eth0 ↔ Node B eth0)."
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, {
					className: "task-list-item",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.input, {
							type: "checkbox",
							disabled: true
						}),
						" ",
						"Cable labeling (including source/destination IP + port number)."
					]
				}),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "os-configuration",
			children: "OS Configuration"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "kernel-tuning",
			children: "Kernel Tuning"
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
						children: "# Check the following parameter settings"
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
							children: "net.core.rmem_max"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " ="
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 16777216"
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
							children: "net.core.wmem_max"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " ="
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 16777216"
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
							children: "net.ipv4.tcp_keepalive_time"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " ="
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 600"
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
							children: "net.ipv4.tcp_slow_start_after_idle"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " ="
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
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "nic-configuration",
			children: "NIC Configuration"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, {
			className: "contains-task-list",
			children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, {
					className: "task-list-item",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.input, {
							type: "checkbox",
							disabled: true
						}),
						" ",
						"Enable jumbo frames (MTU=9000, requires full path support)."
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, {
					className: "task-list-item",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.input, {
							type: "checkbox",
							disabled: true
						}),
						" ",
						"Verify bonding mode (recommend LACP mode4)."
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, {
					className: "task-list-item",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.input, {
							type: "checkbox",
							disabled: true
						}),
						" ",
						"Disable IPv6 (if not needed)."
					]
				}),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "security",
			children: "Security"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "firewall",
			children: "Firewall"
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
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "# Necessary open ports" })
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "- TCP 9000 (S3 API; also used for internal node-to-node communication)" })
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "- TCP 9001 (RustFS Console)" })
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "- TCP 443 (only if you terminate HTTPS on a reverse proxy / load balancer)" })
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "access-control",
			children: "Access Control"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Switch port security MAC restrictions." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "IPSec tunnel encryption between storage nodes." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Enable TLS 1.3 for management interfaces." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "performance-testing",
			children: "Performance Testing"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "benchmarks",
			children: "Benchmarks"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"Inter-node latency: ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "ping -c 20 <target IP>" }),
				" (run ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "iperf3 -s" }),
				" on the target first for throughput tests)"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: ["Cross-rack bandwidth: ", (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "iperf3 -c <target IP> -P 8 -t 30" })] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Failover: Randomly disconnect core links to observe recovery time." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "criteria",
			children: "Criteria"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Metric" }), (0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Requirements" })] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Node Latency" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "≤1ms (same room) / ≤5ms (cross AZ)" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Bandwidth Utilization" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Peak ≤70% of design capacity" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Failover" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "< 500ms BPDU convergence" })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "documentation-requirements",
			children: "Documentation Requirements"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Network topology diagram (including physical connections and logical IPs)" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Switch configuration backup files (with timestamps)" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Baseline test reports (including raw data)" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Change record table (including maintenance window information)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Callout, {
			type: "info",
			children: (0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Recommend conducting 72-hour stress testing before formal deployment, simulating 110% peak traffic load scenarios" })
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "This checklist covers key checkpoints for enterprise storage system network deployment, specifically optimized parameter requirements for distributed object storage characteristics. You can contact RustFS for official technical support." })
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
