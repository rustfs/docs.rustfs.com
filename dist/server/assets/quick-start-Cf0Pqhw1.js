import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/installation/linux/quick-start.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Quick Start Guide for Linux",
	"description": "Quick deployment and installation in Linux environment using RustFS one-click installation package"
};
var _markdown = "\n\n<a id=\"mode\"></a>\n\n<div className=\"fd-steps\">\n  <div className=\"fd-step\">\n    ## Pre-Installation Reading [#1-pre-installation-reading]\n\n    This page contains complete documentation and instructions for all three installation modes of RustFS. Among them, the multi-machine multi-disk mode includes enterprise-grade performance, security, and scalability. It also provides architecture diagrams needed for production workloads. Please read before installation, our startup modes and checklists are as follows:\n\n    1. Choose one of the following installation modes:\n\n       * [Single Node Single Disk Mode (SNSD)](./single-node-single-disk.md)\n       * [Single Node Multiple Disk Mode (SNMD)](./single-node-multiple-disk.md)\n       * [Multiple Node Multiple Disk Mode (MNMD)](./multiple-node-multiple-disk.md)\n\n    2. [Pre-Installation Check](../checklists/index.md), ensure your system meets the production requirements. For non-production environments, you can skip this step.\n  </div>\n\n  <div className=\"fd-step\">\n    ## Quick Installation [#2-quick-installation]\n\n    The quick installation script sets up the &#x2A;*Single Node Single Disk (SNSD)** mode. The script is as follows:\n\n    ```bash\n    curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh\n    ```\n\n    **Notes:**\n\n    * Default installation port is `9000`.\n    * Default installation path is `/data/rustfs0`. If you have independent disks, please mount them in advance.\n    * Ensure `unzip` is installed to ensure RustFS zip installation package can be extracted normally.\n\n    The quick installation script is available on GitHub at: [https://github.com/rustfs/rustfs.com/blob/main/public/install\\_rustfs.sh](https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh)\n  </div>\n\n  <div className=\"fd-step\">\n    ## Other Important Notes [#3-other-important-notes]\n\n    1. Verify firewall settings.\n    2. Ensure NTP synchronization.\n    3. Determine current disk capacity and planning.\n    4. Confirm the operating system kernel version supports IO-Uring.\n    5. Check SELinux settings.\n  </div>\n</div>\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "<a id=\"mode\"></a>"
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "This page contains complete documentation and instructions for all three installation modes of RustFS. Among them, the multi-machine multi-disk mode includes enterprise-grade performance, security, and scalability. It also provides architecture diagrams needed for production workloads. Please read before installation, our startup modes and checklists are as follows:"
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "Choose one of the following installation modes:"
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "Single Node Single Disk Mode (SNSD)"
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "Single Node Multiple Disk Mode (SNMD)"
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "Multiple Node Multiple Disk Mode (MNMD)"
		},
		{
			"heading": "1-pre-installation-reading",
			"content": "Pre-Installation Check, ensure your system meets the production requirements. For non-production environments, you can skip this step."
		},
		{
			"heading": "2-quick-installation",
			"content": "The quick installation script sets up the &#x2A;*Single Node Single Disk (SNSD)** mode. The script is as follows:"
		},
		{
			"heading": "2-quick-installation",
			"content": "**Notes:**"
		},
		{
			"heading": "2-quick-installation",
			"content": "Default installation port is `9000`."
		},
		{
			"heading": "2-quick-installation",
			"content": "Default installation path is `/data/rustfs0`. If you have independent disks, please mount them in advance."
		},
		{
			"heading": "2-quick-installation",
			"content": "Ensure `unzip` is installed to ensure RustFS zip installation package can be extracted normally."
		},
		{
			"heading": "2-quick-installation",
			"content": "The quick installation script is available on GitHub at: https\\://github.com/rustfs/rustfs.com/blob/main/public/install\\_rustfs.sh"
		},
		{
			"heading": "3-other-important-notes",
			"content": "Verify firewall settings."
		},
		{
			"heading": "3-other-important-notes",
			"content": "Ensure NTP synchronization."
		},
		{
			"heading": "3-other-important-notes",
			"content": "Determine current disk capacity and planning."
		},
		{
			"heading": "3-other-important-notes",
			"content": "Confirm the operating system kernel version supports IO-Uring."
		},
		{
			"heading": "3-other-important-notes",
			"content": "Check SELinux settings."
		}
	],
	"headings": [
		{
			"id": "1-pre-installation-reading",
			"content": "1\\. Pre-Installation Reading"
		},
		{
			"id": "2-quick-installation",
			"content": "2\\. Quick Installation"
		},
		{
			"id": "3-other-important-notes",
			"content": "3\\. Other Important Notes"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#1-pre-installation-reading",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Pre-Installation Reading" }),
		_step: 1
	},
	{
		depth: 2,
		url: "#2-quick-installation",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Quick Installation" }),
		_step: 2
	},
	{
		depth: 2,
		url: "#3-other-important-notes",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Other Important Notes" }),
		_step: 3
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		code: "code",
		div: "div",
		h2: "h2",
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
		(0, import_jsx_runtime_react_server.jsx)(_components.p, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
			className: "fd-steps",
			children: [
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "1-pre-installation-reading",
							"data-fd-step": "1",
							children: "Pre-Installation Reading"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "This page contains complete documentation and instructions for all three installation modes of RustFS. Among them, the multi-machine multi-disk mode includes enterprise-grade performance, security, and scalability. It also provides architecture diagrams needed for production workloads. Please read before installation, our startup modes and checklists are as follows:" }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Choose one of the following installation modes:" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
									"\n",
									(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
										href: "./single-node-single-disk.md",
										children: "Single Node Single Disk Mode (SNSD)"
									}) }),
									"\n",
									(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
										href: "./single-node-multiple-disk.md",
										children: "Single Node Multiple Disk Mode (SNMD)"
									}) }),
									"\n",
									(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
										href: "./multiple-node-multiple-disk.md",
										children: "Multiple Node Multiple Disk Mode (MNMD)"
									}) }),
									"\n"
								] }),
								"\n"
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.a, {
									href: "../checklists/index.md",
									children: "Pre-Installation Check"
								}), ", ensure your system meets the production requirements. For non-production environments, you can skip this step."] }),
								"\n"
							] }),
							"\n"
						] })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "2-quick-installation",
							"data-fd-step": "2",
							children: "Quick Installation"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"The quick installation script sets up the ",
							(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Single Node Single Disk (SNSD)" }),
							" mode. The script is as follows:"
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
										children: "curl"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " -O"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " https://rustfs.com/install_rustfs.sh"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " && "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "bash"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " install_rustfs.sh"
									})
								]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Notes:" }) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"Default installation port is ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "9000" }),
								"."
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"Default installation path is ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/data/rustfs0" }),
								". If you have independent disks, please mount them in advance."
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"Ensure ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "unzip" }),
								" is installed to ensure RustFS zip installation package can be extracted normally."
							] }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: ["The quick installation script is available on GitHub at: ", (0, import_jsx_runtime_react_server.jsx)(_components.a, {
							href: "https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh",
							children: "https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh"
						})] })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
						id: "3-other-important-notes",
						"data-fd-step": "3",
						children: "Other Important Notes"
					}), (0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
						"\n",
						(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Verify firewall settings." }),
						"\n",
						(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Ensure NTP synchronization." }),
						"\n",
						(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Determine current disk capacity and planning." }),
						"\n",
						(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Confirm the operating system kernel version supports IO-Uring." }),
						"\n",
						(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Check SELinux settings." }),
						"\n"
					] })]
				})
			]
		})
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
