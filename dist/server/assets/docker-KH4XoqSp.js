import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/installation/docker/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Installing RustFS with Docker",
	"description": "RustFS Docker deployment."
};
var _markdown = "\n\nRustFS is a high-performance, 100% S3-compatible open-source distributed object storage system. In single-node single-disk (SNSD) deployment mode, the backend uses zero erasure coding without additional data redundancy, suitable for local testing and small-scale scenarios.\nThis article is based on RustFS official Linux binary packages, packaging RustFS and its runtime environment into containers through custom Dockerfile, and configuring data volumes and environment variables for one-click service startup.\n\n***\n\n<div className=\"fd-steps\">\n  <div className=\"fd-step\">\n    ## Prerequisites [#1-prerequisites]\n\n    1. **Host Requirements**\n\n    * Docker installed (≥ 20.10) and able to pull images and run containers normally\n    * Local path `/mnt/rustfs/data` (or custom path) for mounting object data\n\n    2. **Network and Firewall**\n\n    * Ensure host port 9000 is open to external access (or consistent with custom port)\n\n    3. **Configuration File Preparation**\n\n    * Define listening port, admin account, data path, etc. in host `/etc/rustfs/config.toml` (see Section 4 for details)\n\n    4. RustFS container run as non-root user `rustfs` with id `10001`, if you run docker with `-v` to mount host directory into docker container, please make sure the owner of host directory has been changed to `10001`, otherwise you will encounter permission denied error. You can run `chown -R 10001:10001 /path/to/host_directory` to grant the necessary permissions.\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Quick Pull of RustFS Official Image [#2-quick-pull-of-rustfs-official-image]\n\n    Use official Ubuntu base image to quickly pull RustFS official image:\n\n    ```bash\n    docker pull rustfs/rustfs\n    ```\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Run RustFS Container [#3-run-rustfs-container]\n\n    RustFS SNSD Docker running method, combining the above image and configuration, execute:\n\n    ```bash\n     docker run -d \\\n      --name rustfs_local \\\n      -p 9000:9000 \\\n      -p 9001:9001 \\\n      -v /mnt/rustfs/data:/data \\\n      rustfs/rustfs:latest \\\n      /data\n    ```\n\n    Parameter descriptions:\n\n    * `-p 9000:9000`: Map host port 9000 to container\n    * `-v /mnt/rustfs/data:/data`: Mount data volume\n    * `--name rustfs_local`: Custom container name\n    * `-d`: Run in background\n\n    ***\n\n    ### Complete Parameter Configuration Example [#complete-parameter-configuration-example]\n\n    ```bash {7,8,15,16}\n    # Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)\n    docker run -d \\\n      --name rustfs_container \\\n      -p 9000:9000 \\\n      -p 9001:9001 \\\n      -v /mnt/rustfs/data:/data \\\n      -e RUSTFS_ACCESS_KEY=\"<your-access-key>\" \\\n      -e RUSTFS_SECRET_KEY=\"<your-secret-key>\" \\\n      -e RUSTFS_CONSOLE_ENABLE=true \\\n      -e RUSTFS_SERVER_DOMAINS=example.com \\\n      rustfs/rustfs:latest \\\n      --address :9000 \\\n      --console-enable \\\n      --server-domains example.com \\\n      --access-key \"<your-access-key>\" \\\n      --secret-key \"<your-secret-key>\" \\\n      /data\n    ```\n\n    ### Parameter Description and Corresponding Methods [#parameter-description-and-corresponding-methods]\n\n    1. **Environment Variable Method** (Recommended):\n       ```bash\n       # Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)\n       -e RUSTFS_ADDRESS=:9000 \\\n       -e RUSTFS_SERVER_DOMAINS=example.com \\\n       -e RUSTFS_ACCESS_KEY=\"<your-access-key>\" \\\n       -e RUSTFS_SECRET_KEY=\"<your-secret-key>\" \\\n       -e RUSTFS_CONSOLE_ENABLE=true \\\n       ```\n\n    2. **Command Line Parameter Method**:\n       ```\n       # Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)\n       --address :9000 \\\n       --server-domains example.com \\\n       --access-key \"<your-access-key>\" \\\n       --secret-key \"<your-secret-key>\" \\\n       --console-enable \\\n       ```\n\n    3. **Required Parameters**:\n       * `<VOLUMES>`: Specify at the end of command, such as `/data`\n\n    ### Common Configuration Combinations [#common-configuration-combinations]\n\n    1. **Basic Configuration**:\n       ```bash\n       docker run -d \\\n         -p 9000:9000 \\\n         -p 9001:9001 \\\n         -v /mnt/data:/data \\\n         rustfs/rustfs:latest \\\n         /data\n       ```\n\n    2. **Enable Console**:\n       ```bash\n       docker run -d \\\n         -p 9000:9000 \\\n         -p 9001:9001 \\\n         -v /mnt/data:/data \\\n         -e RUSTFS_CONSOLE_ENABLE=true \\\n         rustfs/rustfs:latest \\\n         --console-enable \\\n         /data\n       ```\n\n    3. **Custom Authentication Keys**:\n       ```bash\n       # Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)\n       docker run -d \\\n         -p 9000:9000 \\\n         -p 9001:9001 \\\n         -v /mnt/data:/data \\\n         -e RUSTFS_ACCESS_KEY=\"<your-access-key>\" \\\n         -e RUSTFS_SECRET_KEY=\"<your-secret-key>\" \\\n         rustfs/rustfs:latest \\\n         --access-key \"<your-access-key>\" \\\n         --secret-key \"<your-secret-key>\" \\\n         /data\n       ```\n\n    ### Important Notes [#important-notes]\n\n    1. Port mapping must correspond:\n       * Service port defaults to 9000 (`-p 9000:9000`)\n\n    2. Data volumes must be persistent:\n       * `-v /host/path:/container/path`\n\n    3. Environment variables and command line parameters can be mixed, but command line parameters have higher priority\n\n    4. If [using TLS](../../integration/tls-configured.md), additional certificate path mounting is needed:\n\n       ```bash\n       -v /path/to/certs:/certs \\\n       -e RUSTFS_TLS_PATH=/certs \\\n       ```\n\n    ### Docker Compose Installation [#docker-compose-installation]\n\n    RustFS officially provides a Docker Compose installation method. The [`docker-compose.yml`](https://github.com/rustfs/rustfs/blob/main/docker-compose.yml) file includes multiple services, such as `grafana`, `prometheus`, `otel-collector`, and `jaeger`, mainly for observability. If you want to deploy these services together, clone the [RustFS code repository](https://github.com/rustfs/rustfs) locally,\n\n    ```\n    git clone git@github.com:rustfs/rustfs.git\n    ```\n\n    Running the command under root directory,\n\n    ```\n    docker compose --profile observability up -d\n    ```\n\n    Providing the necessary permissions. An initialization container is necessary to grant the correct access rights to rustfs using the `depends_on` keyword. In the example below the `rustfs_perms` service is added to the `docker-compose.yml` to handle this. To ensure logs are persisted and accessible, we map the host log directory to the container's `/logs` path\n\n    ```yaml title=\"docker-compose.yml\"\n      services:\n        # grant the necessary permissions to RUSTFS volumes path\n        rustfs_perms:\n          image: alpine\n          user: root\n          volumes:\n            - /path/to/host_directory/volumes:/fix_path\n          command: chown -R 10001:10001 /fix_path\n        \n        rustfs:\n          image: rustfs/rustfs:latest\n          depends_on: \n            rustfs_perms:\n              condition: service_completed_successfully\n          volumes:\n            - /path/to_host_directory/volumes/data:/data\n            - /path/to_host_directory/volumes/logs:/logs\n          environment:\n            - RUSTFS_OBS_LOG_DIRECTORY=/logs\n        \n          # ... other configurations\n    ```\n\n    Started containers is as below,\n\n    ```\n    CONTAINER ID   IMAGE                                             COMMAND                  CREATED         STATUS                            PORTS                                                                                                                                     NAMES\n    c13c23fe3d9d   rustfs/rustfs:latest                              \"/entrypoint.sh rust…\"   6 seconds ago   Up 5 seconds (health: starting)   0.0.0.0:9000-9001->9000-9001/tcp, :::9000-9001->9000-9001/tcp                                                                             rustfs-server\n    e3f4fc4a83a2   grafana/grafana:latest                            \"/run.sh\"                7 seconds ago   Up 5 seconds                      0.0.0.0:3000->3000/tcp, :::3000->3000/tcp                                                                                                 grafana\n    71ef1b8212cf   prom/prometheus:latest                            \"/bin/prometheus --c…\"   7 seconds ago   Up 5 seconds                      0.0.0.0:9090->9090/tcp, :::9090->9090/tcp                                                                                                 prometheus\n    e7db806b2d6f   jaegertracing/all-in-one:latest                   \"/go/bin/all-in-one-…\"   7 seconds ago   Up 5 seconds                      4317-4318/tcp, 9411/tcp, 0.0.0.0:14250->14250/tcp, :::14250->14250/tcp, 14268/tcp, 0.0.0.0:16686->16686/tcp, :::16686->16686/tcp          jaeger\n    1897830a2f1e   otel/opentelemetry-collector-contrib:latest       \"/otelcol-contrib --…\"   7 seconds ago   Up 5 seconds                      0.0.0.0:4317-4318->4317-4318/tcp, :::4317-4318->4317-4318/tcp, 0.0.0.0:8888-8889->8888-8889/tcp, :::8888-8889->8888-8889/tcp, 55679/tcp   otel-collector\n    ```\n\n    If you only want to install rustfs, do not want to deploy grafana,prometheus,etc, please comment below lines in `docker-compose.yml` file,\n\n    ```\n    #depends_on:\n    #  - otel-collector\n    ```\n\n    Then, run the command,\n\n    ```\n    docker compose -f docker-compose.yml up -d rustfs\n    ```\n\n    This way will only install and start `rustfs-server` service, namely rustfs container,\n\n    ```\n    docker ps\n    CONTAINER ID   IMAGE                                             COMMAND                  CREATED         STATUS                           PORTS                                                           NAMES\n    e07121ecdd39   rustfs/rustfs:latest                              \"/entrypoint.sh rust…\"   2 seconds ago   Up 1 second (health: starting)   0.0.0.0:9000-9001->9000-9001/tcp, :::9000-9001->9000-9001/tcp   rustfs-server\n    ```\n\n    Whether you start only the `rustfs-server` or together with observability services, you can access the RustFS instance via `http://localhost:9000` using the access key and secret key you configured above (the `<your-access-key>` / `<your-secret-key>` placeholders). Generate a strong secret with, for example, `openssl rand -base64 24`, and never ship the placeholder values to production.\n  </div>\n\n  <div className=\"fd-step\">\n    ## Verification and Access [#4-verification-and-access]\n\n    1. **View Container Status and Logs:**\n\n    ```bash\n    docker logs rustfs_local\n    ```\n\n    Logs should show successful service startup and listening on port 9000.\n\n    2. **Test S3 API:**\n\n    Use `mc` or other S3 clients:\n\n    ```bash\n    # Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)\n    mc alias set rustfs http://localhost:9000 \"<your-access-key>\" \"<your-secret-key>\"\n    mc mb rustfs/mybucket\n    mc ls rustfs\n    ```\n\n    If buckets can be successfully created and listed, deployment is effective.\n  </div>\n\n  <div className=\"fd-step\">\n    ## Multiple Nodes [#5-multiple-nodes]\n\n    Dockers default bridge networking does not support multi-node deployments. Use `--network host` so each container can communicate directly with other nodes.\n\n    Run the following on **each node**\n\n    ```bash\n    # Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)\n    docker run -d \\\n      --name rustfs \\\n      --network host \\\n      -v /mnt/rustfs/data:/data \\\n      -e RUSTFS_ACCESS_KEY=\"<your-access-key>\" \\\n      -e RUSTFS_SECRET_KEY=\"<your-secret-key>\" \\\n      -e RUSTFS_CONSOLE_ENABLE=true \\\n      -e RUSTFS_VOLUMES=\"http://node{1...4}:9000/data/rustfs{0...3}\" \\\n      rustfs/rustfs:latest\n    ```\n\n    Add the entries to `/etc/hosts` on **every** node:\n\n    ```ini title=\"/etc/hosts\"\n    192.168.1.1 node1\n    192.168.1.2 node2\n    192.168.1.3 node3\n    192.168.1.4 node4\n    ```\n  </div>\n\n  <div className=\"fd-step\">\n    ## Other Recommendations [#6-other-recommendations]\n\n    1. Production Environment Recommendations:\n\n    * Use multi-node deployment architecture\n    * [Enable TLS encrypted communication](../../integration/tls-configured.md)\n    * Configure log rotation strategy\n    * Set up regular backup strategy\n\n    2. Storage Recommendations:\n\n    * Use local SSD/NVMe storage\n    * Avoid using network file systems (NFS)\n    * Ensure storage directory exclusive access\n\n    ***\n  </div>\n</div>\n\n## Summary [#summary]\n\nThis article explains how to deploy RustFS using Docker with best practices, starting with a single-node single-disk (SNSD) setup and then extending to a multi-node deployment option.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "RustFS is a high-performance, 100% S3-compatible open-source distributed object storage system. In single-node single-disk (SNSD) deployment mode, the backend uses zero erasure coding without additional data redundancy, suitable for local testing and small-scale scenarios.\nThis article is based on RustFS official Linux binary packages, packaging RustFS and its runtime environment into containers through custom Dockerfile, and configuring data volumes and environment variables for one-click service startup."
		},
		{
			"heading": "1-prerequisites",
			"content": "**Host Requirements**"
		},
		{
			"heading": "1-prerequisites",
			"content": "Docker installed (≥ 20.10) and able to pull images and run containers normally"
		},
		{
			"heading": "1-prerequisites",
			"content": "Local path `/mnt/rustfs/data` (or custom path) for mounting object data"
		},
		{
			"heading": "1-prerequisites",
			"content": "**Network and Firewall**"
		},
		{
			"heading": "1-prerequisites",
			"content": "Ensure host port 9000 is open to external access (or consistent with custom port)"
		},
		{
			"heading": "1-prerequisites",
			"content": "**Configuration File Preparation**"
		},
		{
			"heading": "1-prerequisites",
			"content": "Define listening port, admin account, data path, etc. in host `/etc/rustfs/config.toml` (see Section 4 for details)"
		},
		{
			"heading": "1-prerequisites",
			"content": "RustFS container run as non-root user `rustfs` with id `10001`, if you run docker with `-v` to mount host directory into docker container, please make sure the owner of host directory has been changed to `10001`, otherwise you will encounter permission denied error. You can run `chown -R 10001:10001 /path/to/host_directory` to grant the necessary permissions."
		},
		{
			"heading": "2-quick-pull-of-rustfs-official-image",
			"content": "Use official Ubuntu base image to quickly pull RustFS official image:"
		},
		{
			"heading": "3-run-rustfs-container",
			"content": "RustFS SNSD Docker running method, combining the above image and configuration, execute:"
		},
		{
			"heading": "3-run-rustfs-container",
			"content": "Parameter descriptions:"
		},
		{
			"heading": "3-run-rustfs-container",
			"content": "`-p 9000:9000`: Map host port 9000 to container"
		},
		{
			"heading": "3-run-rustfs-container",
			"content": "`-v /mnt/rustfs/data:/data`: Mount data volume"
		},
		{
			"heading": "3-run-rustfs-container",
			"content": "`--name rustfs_local`: Custom container name"
		},
		{
			"heading": "3-run-rustfs-container",
			"content": "`-d`: Run in background"
		},
		{
			"heading": "parameter-description-and-corresponding-methods",
			"content": "**Environment Variable Method** (Recommended):"
		},
		{
			"heading": "parameter-description-and-corresponding-methods",
			"content": "**Command Line Parameter Method**:"
		},
		{
			"heading": "parameter-description-and-corresponding-methods",
			"content": "**Required Parameters**:"
		},
		{
			"heading": "parameter-description-and-corresponding-methods",
			"content": "`<VOLUMES>`: Specify at the end of command, such as `/data`"
		},
		{
			"heading": "common-configuration-combinations",
			"content": "**Basic Configuration**:"
		},
		{
			"heading": "common-configuration-combinations",
			"content": "**Enable Console**:"
		},
		{
			"heading": "common-configuration-combinations",
			"content": "**Custom Authentication Keys**:"
		},
		{
			"heading": "important-notes",
			"content": "Port mapping must correspond:"
		},
		{
			"heading": "important-notes",
			"content": "Service port defaults to 9000 (`-p 9000:9000`)"
		},
		{
			"heading": "important-notes",
			"content": "Data volumes must be persistent:"
		},
		{
			"heading": "important-notes",
			"content": "`-v /host/path:/container/path`"
		},
		{
			"heading": "important-notes",
			"content": "Environment variables and command line parameters can be mixed, but command line parameters have higher priority"
		},
		{
			"heading": "important-notes",
			"content": "If using TLS, additional certificate path mounting is needed:"
		},
		{
			"heading": "docker-compose-installation",
			"content": "RustFS officially provides a Docker Compose installation method. The `docker-compose.yml` file includes multiple services, such as `grafana`, `prometheus`, `otel-collector`, and `jaeger`, mainly for observability. If you want to deploy these services together, clone the RustFS code repository locally,"
		},
		{
			"heading": "docker-compose-installation",
			"content": "Running the command under root directory,"
		},
		{
			"heading": "docker-compose-installation",
			"content": "Providing the necessary permissions. An initialization container is necessary to grant the correct access rights to rustfs using the `depends_on` keyword. In the example below the `rustfs_perms` service is added to the `docker-compose.yml` to handle this. To ensure logs are persisted and accessible, we map the host log directory to the container's `/logs` path"
		},
		{
			"heading": "docker-compose-installation",
			"content": "Started containers is as below,"
		},
		{
			"heading": "docker-compose-installation",
			"content": "If you only want to install rustfs, do not want to deploy grafana,prometheus,etc, please comment below lines in `docker-compose.yml` file,"
		},
		{
			"heading": "docker-compose-installation",
			"content": "Then, run the command,"
		},
		{
			"heading": "docker-compose-installation",
			"content": "This way will only install and start `rustfs-server` service, namely rustfs container,"
		},
		{
			"heading": "docker-compose-installation",
			"content": "Whether you start only the `rustfs-server` or together with observability services, you can access the RustFS instance via `http://localhost:9000` using the access key and secret key you configured above (the `<your-access-key>` / `<your-secret-key>` placeholders). Generate a strong secret with, for example, `openssl rand -base64 24`, and never ship the placeholder values to production."
		},
		{
			"heading": "4-verification-and-access",
			"content": "**View Container Status and Logs:**"
		},
		{
			"heading": "4-verification-and-access",
			"content": "Logs should show successful service startup and listening on port 9000."
		},
		{
			"heading": "4-verification-and-access",
			"content": "**Test S3 API:**"
		},
		{
			"heading": "4-verification-and-access",
			"content": "Use `mc` or other S3 clients:"
		},
		{
			"heading": "4-verification-and-access",
			"content": "If buckets can be successfully created and listed, deployment is effective."
		},
		{
			"heading": "5-multiple-nodes",
			"content": "Dockers default bridge networking does not support multi-node deployments. Use `--network host` so each container can communicate directly with other nodes."
		},
		{
			"heading": "5-multiple-nodes",
			"content": "Run the following on **each node**"
		},
		{
			"heading": "5-multiple-nodes",
			"content": "Add the entries to `/etc/hosts` on **every** node:"
		},
		{
			"heading": "6-other-recommendations",
			"content": "Production Environment Recommendations:"
		},
		{
			"heading": "6-other-recommendations",
			"content": "Use multi-node deployment architecture"
		},
		{
			"heading": "6-other-recommendations",
			"content": "Enable TLS encrypted communication"
		},
		{
			"heading": "6-other-recommendations",
			"content": "Configure log rotation strategy"
		},
		{
			"heading": "6-other-recommendations",
			"content": "Set up regular backup strategy"
		},
		{
			"heading": "6-other-recommendations",
			"content": "Storage Recommendations:"
		},
		{
			"heading": "6-other-recommendations",
			"content": "Use local SSD/NVMe storage"
		},
		{
			"heading": "6-other-recommendations",
			"content": "Avoid using network file systems (NFS)"
		},
		{
			"heading": "6-other-recommendations",
			"content": "Ensure storage directory exclusive access"
		},
		{
			"heading": "summary",
			"content": "This article explains how to deploy RustFS using Docker with best practices, starting with a single-node single-disk (SNSD) setup and then extending to a multi-node deployment option."
		}
	],
	"headings": [
		{
			"id": "1-prerequisites",
			"content": "1\\. Prerequisites"
		},
		{
			"id": "2-quick-pull-of-rustfs-official-image",
			"content": "2\\. Quick Pull of RustFS Official Image"
		},
		{
			"id": "3-run-rustfs-container",
			"content": "3\\. Run RustFS Container"
		},
		{
			"id": "complete-parameter-configuration-example",
			"content": "Complete Parameter Configuration Example"
		},
		{
			"id": "parameter-description-and-corresponding-methods",
			"content": "Parameter Description and Corresponding Methods"
		},
		{
			"id": "common-configuration-combinations",
			"content": "Common Configuration Combinations"
		},
		{
			"id": "important-notes",
			"content": "Important Notes"
		},
		{
			"id": "docker-compose-installation",
			"content": "Docker Compose Installation"
		},
		{
			"id": "4-verification-and-access",
			"content": "4\\. Verification and Access"
		},
		{
			"id": "5-multiple-nodes",
			"content": "5\\. Multiple Nodes"
		},
		{
			"id": "6-other-recommendations",
			"content": "6\\. Other Recommendations"
		},
		{
			"id": "summary",
			"content": "Summary"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#1-prerequisites",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Prerequisites" }),
		_step: 1
	},
	{
		depth: 2,
		url: "#2-quick-pull-of-rustfs-official-image",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Quick Pull of RustFS Official Image" }),
		_step: 2
	},
	{
		depth: 2,
		url: "#3-run-rustfs-container",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Run RustFS Container" }),
		_step: 3
	},
	{
		depth: 3,
		url: "#complete-parameter-configuration-example",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Complete Parameter Configuration Example" })
	},
	{
		depth: 3,
		url: "#parameter-description-and-corresponding-methods",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Parameter Description and Corresponding Methods" })
	},
	{
		depth: 3,
		url: "#common-configuration-combinations",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Common Configuration Combinations" })
	},
	{
		depth: 3,
		url: "#important-notes",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Important Notes" })
	},
	{
		depth: 3,
		url: "#docker-compose-installation",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Docker Compose Installation" })
	},
	{
		depth: 2,
		url: "#4-verification-and-access",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Verification and Access" }),
		_step: 4
	},
	{
		depth: 2,
		url: "#5-multiple-nodes",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Multiple Nodes" }),
		_step: 5
	},
	{
		depth: 2,
		url: "#6-other-recommendations",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Other Recommendations" }),
		_step: 6
	},
	{
		depth: 2,
		url: "#summary",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Summary" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		code: "code",
		div: "div",
		h2: "h2",
		h3: "h3",
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
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is a high-performance, 100% S3-compatible open-source distributed object storage system. In single-node single-disk (SNSD) deployment mode, the backend uses zero erasure coding without additional data redundancy, suitable for local testing and small-scale scenarios.\nThis article is based on RustFS official Linux binary packages, packaging RustFS and its runtime environment into containers through custom Dockerfile, and configuring data volumes and environment variables for one-click service startup." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
			className: "fd-steps",
			children: [
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "1-prerequisites",
							"data-fd-step": "1",
							children: "Prerequisites"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Host Requirements" }) }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Docker installed (≥ 20.10) and able to pull images and run containers normally" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"Local path ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/mnt/rustfs/data" }),
								" (or custom path) for mounting object data"
							] }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
							start: "2",
							children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Network and Firewall" }) }),
								"\n"
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Ensure host port 9000 is open to external access (or consistent with custom port)" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
							start: "3",
							children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Configuration File Preparation" }) }),
								"\n"
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"Define listening port, admin account, data path, etc. in host ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/etc/rustfs/config.toml" }),
								" (see Section 4 for details)"
							] }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
							start: "4",
							children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
									"RustFS container run as non-root user ",
									(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs" }),
									" with id ",
									(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "10001" }),
									", if you run docker with ",
									(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "-v" }),
									" to mount host directory into docker container, please make sure the owner of host directory has been changed to ",
									(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "10001" }),
									", otherwise you will encounter permission denied error. You can run ",
									(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "chown -R 10001:10001 /path/to/host_directory" }),
									" to grant the necessary permissions."
								] }),
								"\n"
							]
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "2-quick-pull-of-rustfs-official-image",
							"data-fd-step": "2",
							children: "Quick Pull of RustFS Official Image"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Use official Ubuntu base image to quickly pull RustFS official image:" }),
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
										children: "docker"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " pull"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " rustfs/rustfs"
									})
								]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "3-run-rustfs-container",
							"data-fd-step": "3",
							children: "Run RustFS Container"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS SNSD Docker running method, combining the above image and configuration, execute:" }),
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
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: " docker"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " run"
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
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  --name"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " rustfs_local"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -p"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " 9000:9000"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -p"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " 9001:9001"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -v"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /mnt/rustfs/data:/data"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "  rustfs/rustfs:latest"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " \\"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "  /data"
									})
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Parameter descriptions:" }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "-p 9000:9000" }), ": Map host port 9000 to container"] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "-v /mnt/rustfs/data:/data" }), ": Mount data volume"] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "--name rustfs_local" }), ": Custom container name"] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "-d" }), ": Run in background"] }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "complete-parameter-configuration-example",
							children: "Complete Parameter Configuration Example"
						}),
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
										children: "# Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)"
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
											children: "docker"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " run"
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
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  --name"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " rustfs_container"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -p"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " 9000:9000"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -p"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " 9001:9001"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -v"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /mnt/rustfs/data:/data"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line highlighted",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "  -e"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " RUSTFS_ACCESS_KEY=\"<your-access-key>\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line highlighted",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "  -e"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " RUSTFS_SECRET_KEY=\"<your-secret-key>\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -e"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " RUSTFS_CONSOLE_ENABLE="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "true"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -e"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " RUSTFS_SERVER_DOMAINS=example.com"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "  rustfs/rustfs:latest"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " \\"
									})]
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
											children: "  --address"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " :9000"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "  --console-enable"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " \\"
									})]
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
											children: "  --server-domains"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " example.com"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line highlighted",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "  --access-key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " \"<your-access-key>\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line highlighted",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "  --secret-key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " \"<your-secret-key>\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
										children: "  /data"
									})
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "parameter-description-and-corresponding-methods",
							children: "Parameter Description and Corresponding Methods"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Environment Variable Method" }), " (Recommended):"] }),
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
												children: "# Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)"
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
													children: "-e"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " RUSTFS_ADDRESS=:9000"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "-e "
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: "RUSTFS_SERVER_DOMAINS=example.com"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "-e "
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: "RUSTFS_ACCESS_KEY=\"<your-access-key>\""
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "-e "
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: "RUSTFS_SECRET_KEY=\"<your-secret-key>\""
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "-e "
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: "RUSTFS_CONSOLE_ENABLE="
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: "true"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
												})
											]
										})
									] })
								}) }),
								"\n"
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Command Line Parameter Method" }), ":"] }),
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
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "# Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)" })
										}),
										"\n",
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "line",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "--address :9000 \\" })
										}),
										"\n",
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "line",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "--server-domains example.com \\" })
										}),
										"\n",
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "line",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "--access-key \"<your-access-key>\" \\" })
										}),
										"\n",
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "line",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "--secret-key \"<your-secret-key>\" \\" })
										}),
										"\n",
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "line",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "--console-enable \\" })
										})
									] })
								}) }),
								"\n"
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Required Parameters" }), ":"] }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
									"\n",
									(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "<VOLUMES>" }),
										": Specify at the end of command, such as ",
										(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/data" })
									] }),
									"\n"
								] }),
								"\n"
							] }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "common-configuration-combinations",
							children: "Common Configuration Combinations"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Basic Configuration" }), ":"] }),
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
										(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "line",
											children: [
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#6F42C1",
														"--shiki-dark": "#B392F0"
													},
													children: "docker"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " run"
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
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -p"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " 9000:9000"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -p"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " 9001:9001"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -v"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " /mnt/data:/data"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
												})
											]
										}),
										"\n",
										(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "line",
											children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
												style: {
													"--shiki-light": "#032F62",
													"--shiki-dark": "#9ECBFF"
												},
												children: "  rustfs/rustfs:latest"
											}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												style: {
													"--shiki-light": "#005CC5",
													"--shiki-dark": "#79B8FF"
												},
												children: " \\"
											})]
										}),
										"\n",
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "line",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												style: {
													"--shiki-light": "#032F62",
													"--shiki-dark": "#9ECBFF"
												},
												children: "  /data"
											})
										})
									] })
								}) }),
								"\n"
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Enable Console" }), ":"] }),
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
										(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "line",
											children: [
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#6F42C1",
														"--shiki-dark": "#B392F0"
													},
													children: "docker"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " run"
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
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -p"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " 9000:9000"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -p"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " 9001:9001"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -v"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " /mnt/data:/data"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -e"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " RUSTFS_CONSOLE_ENABLE="
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: "true"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
												})
											]
										}),
										"\n",
										(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "line",
											children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
												style: {
													"--shiki-light": "#032F62",
													"--shiki-dark": "#9ECBFF"
												},
												children: "  rustfs/rustfs:latest"
											}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												style: {
													"--shiki-light": "#005CC5",
													"--shiki-dark": "#79B8FF"
												},
												children: " \\"
											})]
										}),
										"\n",
										(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "line",
											children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
												style: {
													"--shiki-light": "#005CC5",
													"--shiki-dark": "#79B8FF"
												},
												children: "  --console-enable"
											}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												style: {
													"--shiki-light": "#005CC5",
													"--shiki-dark": "#79B8FF"
												},
												children: " \\"
											})]
										}),
										"\n",
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "line",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												style: {
													"--shiki-light": "#032F62",
													"--shiki-dark": "#9ECBFF"
												},
												children: "  /data"
											})
										})
									] })
								}) }),
								"\n"
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Custom Authentication Keys" }), ":"] }),
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
												children: "# Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)"
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
													children: "docker"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " run"
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
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -p"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " 9000:9000"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -p"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " 9001:9001"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -v"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " /mnt/data:/data"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -e"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " RUSTFS_ACCESS_KEY=\"<your-access-key>\""
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  -e"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " RUSTFS_SECRET_KEY=\"<your-secret-key>\""
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
												})
											]
										}),
										"\n",
										(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "line",
											children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
												style: {
													"--shiki-light": "#032F62",
													"--shiki-dark": "#9ECBFF"
												},
												children: "  rustfs/rustfs:latest"
											}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												style: {
													"--shiki-light": "#005CC5",
													"--shiki-dark": "#79B8FF"
												},
												children: " \\"
											})]
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
													children: "  --access-key"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " \"<your-access-key>\""
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "  --secret-key"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " \"<your-secret-key>\""
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
												children: "  /data"
											})
										})
									] })
								}) }),
								"\n"
							] }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "important-notes",
							children: "Important Notes"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Port mapping must correspond:" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
									"\n",
									(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
										"Service port defaults to 9000 (",
										(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "-p 9000:9000" }),
										")"
									] }),
									"\n"
								] }),
								"\n"
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Data volumes must be persistent:" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
									"\n",
									(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "-v /host/path:/container/path" }) }),
									"\n"
								] }),
								"\n"
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Environment variables and command line parameters can be mixed, but command line parameters have higher priority" }),
								"\n"
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
									"If ",
									(0, import_jsx_runtime_react_server.jsx)(_components.a, {
										href: "../../integration/tls-configured.md",
										children: "using TLS"
									}),
									", additional certificate path mounting is needed:"
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
										(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "line",
											children: [
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#6F42C1",
														"--shiki-dark": "#B392F0"
													},
													children: "-v"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: " /path/to/certs:/certs"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
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
													children: "-e "
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#032F62",
														"--shiki-dark": "#9ECBFF"
													},
													children: "RUSTFS_TLS_PATH=/certs"
												}),
												(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													style: {
														"--shiki-light": "#005CC5",
														"--shiki-dark": "#79B8FF"
													},
													children: " \\"
												})
											]
										})
									] })
								}) }),
								"\n"
							] }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "docker-compose-installation",
							children: "Docker Compose Installation"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"RustFS officially provides a Docker Compose installation method. The ",
							(0, import_jsx_runtime_react_server.jsx)(_components.a, {
								href: "https://github.com/rustfs/rustfs/blob/main/docker-compose.yml",
								children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "docker-compose.yml" })
							}),
							" file includes multiple services, such as ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "grafana" }),
							", ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "prometheus" }),
							", ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "otel-collector" }),
							", and ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "jaeger" }),
							", mainly for observability. If you want to deploy these services together, clone the ",
							(0, import_jsx_runtime_react_server.jsx)(_components.a, {
								href: "https://github.com/rustfs/rustfs",
								children: "RustFS code repository"
							}),
							" locally,"
						] }),
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
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "line",
								children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "git clone git@github.com:rustfs/rustfs.git" })
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Running the command under root directory," }),
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
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "line",
								children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "docker compose --profile observability up -d" })
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"Providing the necessary permissions. An initialization container is necessary to grant the correct access rights to rustfs using the ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "depends_on" }),
							" keyword. In the example below the ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs_perms" }),
							" service is added to the ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "docker-compose.yml" }),
							" to handle this. To ensure logs are persisted and accessible, we map the host log directory to the container's ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/logs" }),
							" path"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							title: "docker-compose.yml",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#22863A",
											"--shiki-dark": "#85E89D"
										},
										children: "  services"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ":"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: "    # grant the necessary permissions to RUSTFS volumes path"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#22863A",
											"--shiki-dark": "#85E89D"
										},
										children: "    rustfs_perms"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ":"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "      image"
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
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "alpine"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "      user"
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
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "root"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#22863A",
											"--shiki-dark": "#85E89D"
										},
										children: "      volumes"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ":"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "        - "
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "/path/to/host_directory/volumes:/fix_path"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "      command"
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
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "chown -R 10001:10001 /fix_path"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "    "
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#22863A",
											"--shiki-dark": "#85E89D"
										},
										children: "    rustfs"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ":"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "      image"
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
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "rustfs/rustfs:latest"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#22863A",
											"--shiki-dark": "#85E89D"
										},
										children: "      depends_on"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ": "
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#22863A",
											"--shiki-dark": "#85E89D"
										},
										children: "        rustfs_perms"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ":"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "          condition"
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
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "service_completed_successfully"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#22863A",
											"--shiki-dark": "#85E89D"
										},
										children: "      volumes"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ":"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "        - "
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "/path/to_host_directory/volumes/data:/data"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "        - "
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "/path/to_host_directory/volumes/logs:/logs"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#22863A",
											"--shiki-dark": "#85E89D"
										},
										children: "      environment"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ":"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "        - "
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "RUSTFS_OBS_LOG_DIRECTORY=/logs"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "    "
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
										children: "      # ... other configurations"
									})
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Started containers is as below," }),
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
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "CONTAINER ID   IMAGE                                             COMMAND                  CREATED         STATUS                            PORTS                                                                                                                                     NAMES" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "c13c23fe3d9d   rustfs/rustfs:latest                              \"/entrypoint.sh rust…\"   6 seconds ago   Up 5 seconds (health: starting)   0.0.0.0:9000-9001->9000-9001/tcp, :::9000-9001->9000-9001/tcp                                                                             rustfs-server" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "e3f4fc4a83a2   grafana/grafana:latest                            \"/run.sh\"                7 seconds ago   Up 5 seconds                      0.0.0.0:3000->3000/tcp, :::3000->3000/tcp                                                                                                 grafana" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "71ef1b8212cf   prom/prometheus:latest                            \"/bin/prometheus --c…\"   7 seconds ago   Up 5 seconds                      0.0.0.0:9090->9090/tcp, :::9090->9090/tcp                                                                                                 prometheus" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "e7db806b2d6f   jaegertracing/all-in-one:latest                   \"/go/bin/all-in-one-…\"   7 seconds ago   Up 5 seconds                      4317-4318/tcp, 9411/tcp, 0.0.0.0:14250->14250/tcp, :::14250->14250/tcp, 14268/tcp, 0.0.0.0:16686->16686/tcp, :::16686->16686/tcp          jaeger" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "1897830a2f1e   otel/opentelemetry-collector-contrib:latest       \"/otelcol-contrib --…\"   7 seconds ago   Up 5 seconds                      0.0.0.0:4317-4318->4317-4318/tcp, :::4317-4318->4317-4318/tcp, 0.0.0.0:8888-8889->8888-8889/tcp, :::8888-8889->8888-8889/tcp, 55679/tcp   otel-collector" })
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"If you only want to install rustfs, do not want to deploy grafana,prometheus,etc, please comment below lines in ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "docker-compose.yml" }),
							" file,"
						] }),
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
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "#depends_on:" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "#  - otel-collector" })
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Then, run the command," }),
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
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "line",
								children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "docker compose -f docker-compose.yml up -d rustfs" })
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"This way will only install and start ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs-server" }),
							" service, namely rustfs container,"
						] }),
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
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "docker ps" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "CONTAINER ID   IMAGE                                             COMMAND                  CREATED         STATUS                           PORTS                                                           NAMES" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "e07121ecdd39   rustfs/rustfs:latest                              \"/entrypoint.sh rust…\"   2 seconds ago   Up 1 second (health: starting)   0.0.0.0:9000-9001->9000-9001/tcp, :::9000-9001->9000-9001/tcp   rustfs-server" })
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"Whether you start only the ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs-server" }),
							" or together with observability services, you can access the RustFS instance via ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "http://localhost:9000" }),
							" using the access key and secret key you configured above (the ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "<your-access-key>" }),
							" / ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "<your-secret-key>" }),
							" placeholders). Generate a strong secret with, for example, ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "openssl rand -base64 24" }),
							", and never ship the placeholder values to production."
						] })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "4-verification-and-access",
							"data-fd-step": "4",
							children: "Verification and Access"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "View Container Status and Logs:" }) }),
							"\n"
						] }),
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
										children: "docker"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " logs"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " rustfs_local"
									})
								]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Logs should show successful service startup and listening on port 9000." }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
							start: "2",
							children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Test S3 API:" }) }),
								"\n"
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"Use ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "mc" }),
							" or other S3 clients:"
						] }),
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
										children: "# Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)"
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
											children: "mc"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " alias"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " set"
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
											children: " http://localhost:9000"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " \"<your-access-key>\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " \"<your-secret-key>\""
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
											children: "mc"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " mb"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " rustfs/mybucket"
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
											children: "mc"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " ls"
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
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If buckets can be successfully created and listed, deployment is effective." })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "5-multiple-nodes",
							"data-fd-step": "5",
							children: "Multiple Nodes"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"Dockers default bridge networking does not support multi-node deployments. Use ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "--network host" }),
							" so each container can communicate directly with other nodes."
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: ["Run the following on ", (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "each node" })] }),
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
										children: "# Use a unique access key and a strong, random secret (e.g. openssl rand -base64 24)"
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
											children: "docker"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " run"
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
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  --name"
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
											children: " \\"
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
											children: "  --network"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " host"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -v"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " /mnt/rustfs/data:/data"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -e"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " RUSTFS_ACCESS_KEY=\"<your-access-key>\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -e"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " RUSTFS_SECRET_KEY=\"<your-secret-key>\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -e"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " RUSTFS_CONSOLE_ENABLE="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "true"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
											children: "  -e"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " RUSTFS_VOLUMES=\"http://node{1...4}:9000/data/rustfs{0...3}\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " \\"
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
										children: "  rustfs/rustfs:latest"
									})
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"Add the entries to ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/etc/hosts" }),
							" on ",
							(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "every" }),
							" node:"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							title: "/etc/hosts",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "192.168.1.1 node1"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "192.168.1.2 node2"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "192.168.1.3 node3"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "192.168.1.4 node4"
									})
								})
							] })
						}) })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "6-other-recommendations",
							"data-fd-step": "6",
							children: "Other Recommendations"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Production Environment Recommendations:" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Use multi-node deployment architecture" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
								href: "../../integration/tls-configured.md",
								children: "Enable TLS encrypted communication"
							}) }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Configure log rotation strategy" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Set up regular backup strategy" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
							start: "2",
							children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Storage Recommendations:" }),
								"\n"
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Use local SSD/NVMe storage" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Avoid using network file systems (NFS)" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Ensure storage directory exclusive access" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				})
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "summary",
			children: "Summary"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "This article explains how to deploy RustFS using Docker with best practices, starting with a single-node single-disk (SNSD) setup and then extending to a multi-node deployment option." })
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
