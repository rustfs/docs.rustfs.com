import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/integration/tls-configured.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "TLS Configuration",
	"description": "Configure TLS for secure access."
};
var _markdown = "\n\nConfigure TLS for secure access. Set the `RUSTFS_TLS_PATH` environment variable.\n\n## Configuration [#configuration]\n\n### Prerequisites [#prerequisites]\n\n* A running RustFS instance (see [Installation Guide](../installation/index.md)).\n* Certificate pair (cert and key).\n\n**Note**: Certificates must be named `rustfs_cert.pem` and `rustfs_key.pem` and placed in the specified path.\n\n### Linux [#linux]\n\n1. Edit the RustFS instance configuration file (default `/etc/default/rustfs`) and add the `RUSTFS_TLS_PATH` environment variable.\n\n   ```bash\n   # Edit RustFS instance configuration file\n   sudo vi /etc/default/rustfs\n\n   # Add RUSTFS_TLS_PATH environment variable\n   RUSTFS_TLS_PATH=\"/opt/tls\"\n   ```\n\n**Note**: You can specify any path for `RUSTFS_TLS_PATH`, but it must contain both `rustfs_cert.pem` and `rustfs_key.pem`.\n\n2. Restart the RustFS instance.\n\n   ```bash\n   systemctl restart rustfs\n   ```\n\nTLS now applies to both listeners: the S3 API at `https://rustfs.example.com:9000` and the Console at `https://rustfs.example.com:9001`.\n\n### Docker [#docker]\n\n1. Mount the certificate path via `-v` and specify `RUSTFS_TLS_PATH` via `-e`.\n\n   ```bash\n       docker pull rustfs/rustfs:latest\n       docker run -d \\\n       --name rustfs \\\n       -e RUSTFS_TLS_PATH=\"/opt/tls/\" \\\n       -v /opt/tls:/opt/tls \\\n       -p 9000:9000 \\\n       -p 9001:9001 \\\n       -v /data:/data \\\n       rustfs/rustfs:latest\n   ```\n\n2. Restart the RustFS instance container, then access the S3 API at `https://rustfs.example.com:9000` and the Console at `https://rustfs.example.com:9001`.\n\n**Note**: Since the RustFS instance container runs as `rustfs` user by default, you need to ensure that the certificate files (`rustfs_key.pem` and `rustfs_cert.pem`) belong to the `rustfs` user, otherwise the RustFS instance will fail to read the certificate files due to permission issues, causing TLS configuration to fail.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Configure TLS for secure access. Set the `RUSTFS_TLS_PATH` environment variable."
		},
		{
			"heading": "prerequisites",
			"content": "A running RustFS instance (see Installation Guide)."
		},
		{
			"heading": "prerequisites",
			"content": "Certificate pair (cert and key)."
		},
		{
			"heading": "prerequisites",
			"content": "**Note**: Certificates must be named `rustfs_cert.pem` and `rustfs_key.pem` and placed in the specified path."
		},
		{
			"heading": "linux",
			"content": "Edit the RustFS instance configuration file (default `/etc/default/rustfs`) and add the `RUSTFS_TLS_PATH` environment variable."
		},
		{
			"heading": "linux",
			"content": "**Note**: You can specify any path for `RUSTFS_TLS_PATH`, but it must contain both `rustfs_cert.pem` and `rustfs_key.pem`."
		},
		{
			"heading": "linux",
			"content": "Restart the RustFS instance."
		},
		{
			"heading": "linux",
			"content": "TLS now applies to both listeners: the S3 API at `https://rustfs.example.com:9000` and the Console at `https://rustfs.example.com:9001`."
		},
		{
			"heading": "docker",
			"content": "Mount the certificate path via `-v` and specify `RUSTFS_TLS_PATH` via `-e`."
		},
		{
			"heading": "docker",
			"content": "Restart the RustFS instance container, then access the S3 API at `https://rustfs.example.com:9000` and the Console at `https://rustfs.example.com:9001`."
		},
		{
			"heading": "docker",
			"content": "**Note**: Since the RustFS instance container runs as `rustfs` user by default, you need to ensure that the certificate files (`rustfs_key.pem` and `rustfs_cert.pem`) belong to the `rustfs` user, otherwise the RustFS instance will fail to read the certificate files due to permission issues, causing TLS configuration to fail."
		}
	],
	"headings": [
		{
			"id": "configuration",
			"content": "Configuration"
		},
		{
			"id": "prerequisites",
			"content": "Prerequisites"
		},
		{
			"id": "linux",
			"content": "Linux"
		},
		{
			"id": "docker",
			"content": "Docker"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#configuration",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Configuration" })
	},
	{
		depth: 3,
		url: "#prerequisites",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Prerequisites" })
	},
	{
		depth: 3,
		url: "#linux",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Linux" })
	},
	{
		depth: 3,
		url: "#docker",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Docker" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		code: "code",
		h2: "h2",
		h3: "h3",
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
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Configure TLS for secure access. Set the ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_TLS_PATH" }),
			" environment variable."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "configuration",
			children: "Configuration"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "prerequisites",
			children: "Prerequisites"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"A running RustFS instance (see ",
				(0, import_jsx_runtime_react_server.jsx)(_components.a, {
					href: "../installation/index.md",
					children: "Installation Guide"
				}),
				")."
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Certificate pair (cert and key)." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Note" }),
			": Certificates must be named ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs_cert.pem" }),
			" and ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs_key.pem" }),
			" and placed in the specified path."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "linux",
			children: "Linux"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
					"Edit the RustFS instance configuration file (default ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/etc/default/rustfs" }),
					") and add the ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_TLS_PATH" }),
					" environment variable."
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
								children: "# Edit RustFS instance configuration file"
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
									children: " vi"
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
						(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
						"\n",
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							className: "line",
							children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
								style: {
									"--shiki-light": "#6A737D",
									"--shiki-dark": "#6A737D"
								},
								children: "# Add RUSTFS_TLS_PATH environment variable"
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
									children: "RUSTFS_TLS_PATH"
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
									children: "\"/opt/tls\""
								})
							]
						})
					] })
				}) }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Note" }),
			": You can specify any path for ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_TLS_PATH" }),
			", but it must contain both ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs_cert.pem" }),
			" and ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs_key.pem" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
			start: "2",
			children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
					"\n",
					(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Restart the RustFS instance." }),
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
									children: " restart"
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
					"\n"
				] }),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"TLS now applies to both listeners: the S3 API at ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "https://rustfs.example.com:9000" }),
			" and the Console at ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "https://rustfs.example.com:9001" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "docker",
			children: "Docker"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
					"Mount the certificate path via ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "-v" }),
					" and specify ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_TLS_PATH" }),
					" via ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "-e" }),
					"."
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
									children: "    docker"
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
									children: " rustfs/rustfs:latest"
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
									children: "    docker"
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
									children: "    --name"
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
									children: "    -e"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: " RUSTFS_TLS_PATH=\"/opt/tls/\""
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
									children: "    -v"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: " /opt/tls:/opt/tls"
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
									children: "    -p"
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
									children: "    -p"
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
									children: "    -v"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: " /data:/data"
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
								children: "    rustfs/rustfs:latest"
							})
						})
					] })
				}) }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
					"Restart the RustFS instance container, then access the S3 API at ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "https://rustfs.example.com:9000" }),
					" and the Console at ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "https://rustfs.example.com:9001" }),
					"."
				] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Note" }),
			": Since the RustFS instance container runs as ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs" }),
			" user by default, you need to ensure that the certificate files (",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs_key.pem" }),
			" and ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs_cert.pem" }),
			") belong to the ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs" }),
			" user, otherwise the RustFS instance will fail to read the certificate files due to permission issues, causing TLS configuration to fail."
		] })
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
