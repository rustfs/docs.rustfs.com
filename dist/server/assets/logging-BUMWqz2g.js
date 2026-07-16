import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/logging/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Logging and Auditing",
	"description": "RustFS observability: OpenTelemetry metrics, audit logging, and event notifications to external targets."
};
var _markdown = "\n\nMetrics and logging are crucial for system health. RustFS provides robust monitoring and observability through detailed storage performance monitoring, metrics, and logging.\n\n## Features [#features]\n\n### Monitoring Metrics [#monitoring-metrics]\n\nProvides complete system monitoring and performance metrics collection.\n\n### Logging [#logging]\n\nRecords detailed log information for every operation, supporting audit trails.\n\n## Metrics Monitoring [#metrics-monitoring]\n\nRustFS collects a wide range of fine-grained hardware and software metrics and exports them over OTLP (the OpenTelemetry Protocol, configured via `RUSTFS_OBS_ENDPOINT`). Deploy an OpenTelemetry Collector to forward these metrics to Prometheus, Grafana, or any OTLP-compatible backend. The upstream [`docker-compose.yml`](https://github.com/rustfs/rustfs/blob/main/docker-compose.yml) ships a ready-made observability profile with OpenTelemetry Collector, Prometheus, Grafana, and Jaeger.\n\nRustFS also provides health check endpoints (`/health` and `/health/ready`) for probing node and cluster liveness.\n\n## Audit Logs [#audit-logs]\n\nAudit logging generates logs for every cluster operation. Each operation generates an audit log containing a unique ID and detailed information about the client, object, bucket, and metadata. RustFS writes audit data to configured targets such as HTTP/HTTPS webhook endpoints and Kafka (`RUSTFS_AUDIT_*` environment variables).\n\nRustFS event notifications provide additional logging support: bucket and object events can be pushed automatically to third-party systems (for example RabbitMQ via AMQP, Kafka, or a webhook) for event-driven processing.\n\n## Architecture [#architecture]\n\nRustFS does not natively expose metrics via Prometheus-compatible HTTP(S) endpoints for direct scraping. To integrate with Prometheus, deploy an OpenTelemetry Collector to gather metrics from RustFS and forward them to your Prometheus backend.\n\n<Mermaid\n  chart=\"flowchart TD\n  RUSTFS[&#x22;RustFS Object Storage&#x22;]\n  OTEL[&#x22;OpenTelemetry Collector&#x22;]\n  subgraph PROM[&#x22;Prometheus&#x22;]\n    AM[Alertmanager]\n    QA[&#x22;Query API&#x22;]\n    RRW[&#x22;Remote Read/Write&#x22;]\n    WH[Webhooks]\n  end\n  AR[&#x22;Alert Response&#x22;]\n  VA[&#x22;Visualization / Analytics&#x22;]\n  AB[&#x22;Archival / Backup&#x22;]\n  RUSTFS -->|OTLP| OTEL\n  OTEL --> PROM\n  PROM --> AR\n  PROM --> VA\n  PROM --> AB\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class RUSTFS server\n  class OTEL,AM,QA,RRW,WH svc\n  class AR,VA,AB accent\"\n/>\n\nRustFS event notifications automatically push bucket and object events to supported target services. Administrators can define bucket-level notification rules.\n\n<Mermaid\n  chart=\"flowchart LR\n  subgraph Clients[&#x22;Client Applications&#x22;]\n    IOT[&#x22;Internet of Things&#x22;]\n    WEB[&#x22;Web Applications&#x22;]\n    BK[&#x22;Backup / Archival&#x22;]\n    BS[&#x22;Block Storage&#x22;]\n  end\n  TENANT[&#x22;RustFS Cluster&#x22;]\n  subgraph Targets[&#x22;Notification Targets&#x22;]\n    WH[Webhooks]\n    KAFKA[Kafka]\n    AMQP[AMQP]\n    MQTT[MQTT]\n    RED[Redis]\n    NATS[NATS]\n    PULSAR[Pulsar]\n    MYSQL[MySQL]\n    PG[PostgreSQL]\n  end\n  Clients <-->|S3 operations| TENANT\n  TENANT -->|events| Targets\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class IOT,WEB,BK,BS server\n  class TENANT svc\n  class WH,KAFKA,AMQP,MQTT,RED,NATS,PULSAR,MYSQL,PG accent\"\n/>\n\n## Requirements [#requirements]\n\n### For Metrics [#for-metrics]\n\nDeploy an OpenTelemetry Collector and point `RUSTFS_OBS_ENDPOINT` at it; visualize with Prometheus and Grafana (see the upstream observability compose profile).\n\n### For Audit Logs [#for-audit-logs]\n\nConfigure one or more audit targets (webhook, Kafka) via `RUSTFS_AUDIT_*` environment variables.\n\n### For Event Notifications [#for-event-notifications]\n\nConfigure bucket notification rules toward the supported targets: webhook, Kafka, AMQP, MQTT, Redis, NATS, Pulsar, MySQL, or PostgreSQL.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Metrics and logging are crucial for system health. RustFS provides robust monitoring and observability through detailed storage performance monitoring, metrics, and logging."
		},
		{
			"heading": "monitoring-metrics",
			"content": "Provides complete system monitoring and performance metrics collection."
		},
		{
			"heading": "logging",
			"content": "Records detailed log information for every operation, supporting audit trails."
		},
		{
			"heading": "metrics-monitoring",
			"content": "RustFS collects a wide range of fine-grained hardware and software metrics and exports them over OTLP (the OpenTelemetry Protocol, configured via `RUSTFS_OBS_ENDPOINT`). Deploy an OpenTelemetry Collector to forward these metrics to Prometheus, Grafana, or any OTLP-compatible backend. The upstream `docker-compose.yml` ships a ready-made observability profile with OpenTelemetry Collector, Prometheus, Grafana, and Jaeger."
		},
		{
			"heading": "metrics-monitoring",
			"content": "RustFS also provides health check endpoints (`/health` and `/health/ready`) for probing node and cluster liveness."
		},
		{
			"heading": "audit-logs",
			"content": "Audit logging generates logs for every cluster operation. Each operation generates an audit log containing a unique ID and detailed information about the client, object, bucket, and metadata. RustFS writes audit data to configured targets such as HTTP/HTTPS webhook endpoints and Kafka (`RUSTFS_AUDIT_*` environment variables)."
		},
		{
			"heading": "audit-logs",
			"content": "RustFS event notifications provide additional logging support: bucket and object events can be pushed automatically to third-party systems (for example RabbitMQ via AMQP, Kafka, or a webhook) for event-driven processing."
		},
		{
			"heading": "architecture",
			"content": "RustFS does not natively expose metrics via Prometheus-compatible HTTP(S) endpoints for direct scraping. To integrate with Prometheus, deploy an OpenTelemetry Collector to gather metrics from RustFS and forward them to your Prometheus backend."
		},
		{
			"heading": "architecture",
			"content": "RustFS event notifications automatically push bucket and object events to supported target services. Administrators can define bucket-level notification rules."
		},
		{
			"heading": "for-metrics",
			"content": "Deploy an OpenTelemetry Collector and point `RUSTFS_OBS_ENDPOINT` at it; visualize with Prometheus and Grafana (see the upstream observability compose profile)."
		},
		{
			"heading": "for-audit-logs",
			"content": "Configure one or more audit targets (webhook, Kafka) via `RUSTFS_AUDIT_*` environment variables."
		},
		{
			"heading": "for-event-notifications",
			"content": "Configure bucket notification rules toward the supported targets: webhook, Kafka, AMQP, MQTT, Redis, NATS, Pulsar, MySQL, or PostgreSQL."
		}
	],
	"headings": [
		{
			"id": "features",
			"content": "Features"
		},
		{
			"id": "monitoring-metrics",
			"content": "Monitoring Metrics"
		},
		{
			"id": "logging",
			"content": "Logging"
		},
		{
			"id": "metrics-monitoring",
			"content": "Metrics Monitoring"
		},
		{
			"id": "audit-logs",
			"content": "Audit Logs"
		},
		{
			"id": "architecture",
			"content": "Architecture"
		},
		{
			"id": "requirements",
			"content": "Requirements"
		},
		{
			"id": "for-metrics",
			"content": "For Metrics"
		},
		{
			"id": "for-audit-logs",
			"content": "For Audit Logs"
		},
		{
			"id": "for-event-notifications",
			"content": "For Event Notifications"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#features",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Features" })
	},
	{
		depth: 3,
		url: "#monitoring-metrics",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Monitoring Metrics" })
	},
	{
		depth: 3,
		url: "#logging",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Logging" })
	},
	{
		depth: 2,
		url: "#metrics-monitoring",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Metrics Monitoring" })
	},
	{
		depth: 2,
		url: "#audit-logs",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Audit Logs" })
	},
	{
		depth: 2,
		url: "#architecture",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Architecture" })
	},
	{
		depth: 2,
		url: "#requirements",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Requirements" })
	},
	{
		depth: 3,
		url: "#for-metrics",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "For Metrics" })
	},
	{
		depth: 3,
		url: "#for-audit-logs",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "For Audit Logs" })
	},
	{
		depth: 3,
		url: "#for-event-notifications",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "For Event Notifications" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		code: "code",
		h2: "h2",
		h3: "h3",
		p: "p",
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Metrics and logging are crucial for system health. RustFS provides robust monitoring and observability through detailed storage performance monitoring, metrics, and logging." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "features",
			children: "Features"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "monitoring-metrics",
			children: "Monitoring Metrics"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Provides complete system monitoring and performance metrics collection." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "logging",
			children: "Logging"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Records detailed log information for every operation, supporting audit trails." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "metrics-monitoring",
			children: "Metrics Monitoring"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"RustFS collects a wide range of fine-grained hardware and software metrics and exports them over OTLP (the OpenTelemetry Protocol, configured via ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_OBS_ENDPOINT" }),
			"). Deploy an OpenTelemetry Collector to forward these metrics to Prometheus, Grafana, or any OTLP-compatible backend. The upstream ",
			(0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "https://github.com/rustfs/rustfs/blob/main/docker-compose.yml",
				children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "docker-compose.yml" })
			}),
			" ships a ready-made observability profile with OpenTelemetry Collector, Prometheus, Grafana, and Jaeger."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"RustFS also provides health check endpoints (",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/health" }),
			" and ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/health/ready" }),
			") for probing node and cluster liveness."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "audit-logs",
			children: "Audit Logs"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Audit logging generates logs for every cluster operation. Each operation generates an audit log containing a unique ID and detailed information about the client, object, bucket, and metadata. RustFS writes audit data to configured targets such as HTTP/HTTPS webhook endpoints and Kafka (",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_AUDIT_*" }),
			" environment variables)."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS event notifications provide additional logging support: bucket and object events can be pushed automatically to third-party systems (for example RabbitMQ via AMQP, Kafka, or a webhook) for event-driven processing." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "architecture",
			children: "Architecture"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS does not natively expose metrics via Prometheus-compatible HTTP(S) endpoints for direct scraping. To integrate with Prometheus, deploy an OpenTelemetry Collector to gather metrics from RustFS and forward them to your Prometheus backend." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart TD\n  RUSTFS[\"RustFS Object Storage\"]\n  OTEL[\"OpenTelemetry Collector\"]\n  subgraph PROM[\"Prometheus\"]\n    AM[Alertmanager]\n    QA[\"Query API\"]\n    RRW[\"Remote Read/Write\"]\n    WH[Webhooks]\n  end\n  AR[\"Alert Response\"]\n  VA[\"Visualization / Analytics\"]\n  AB[\"Archival / Backup\"]\n  RUSTFS -->|OTLP| OTEL\n  OTEL --> PROM\n  PROM --> AR\n  PROM --> VA\n  PROM --> AB\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class RUSTFS server\n  class OTEL,AM,QA,RRW,WH svc\n  class AR,VA,AB accent" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS event notifications automatically push bucket and object events to supported target services. Administrators can define bucket-level notification rules." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n  subgraph Clients[\"Client Applications\"]\n    IOT[\"Internet of Things\"]\n    WEB[\"Web Applications\"]\n    BK[\"Backup / Archival\"]\n    BS[\"Block Storage\"]\n  end\n  TENANT[\"RustFS Cluster\"]\n  subgraph Targets[\"Notification Targets\"]\n    WH[Webhooks]\n    KAFKA[Kafka]\n    AMQP[AMQP]\n    MQTT[MQTT]\n    RED[Redis]\n    NATS[NATS]\n    PULSAR[Pulsar]\n    MYSQL[MySQL]\n    PG[PostgreSQL]\n  end\n  Clients <-->|S3 operations| TENANT\n  TENANT -->|events| Targets\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class IOT,WEB,BK,BS server\n  class TENANT svc\n  class WH,KAFKA,AMQP,MQTT,RED,NATS,PULSAR,MYSQL,PG accent" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "requirements",
			children: "Requirements"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "for-metrics",
			children: "For Metrics"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Deploy an OpenTelemetry Collector and point ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_OBS_ENDPOINT" }),
			" at it; visualize with Prometheus and Grafana (see the upstream observability compose profile)."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "for-audit-logs",
			children: "For Audit Logs"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Configure one or more audit targets (webhook, Kafka) via ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_AUDIT_*" }),
			" environment variables."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "for-event-notifications",
			children: "For Event Notifications"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Configure bucket notification rules toward the supported targets: webhook, Kafka, AMQP, MQTT, Redis, NATS, Pulsar, MySQL, or PostgreSQL." })
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
