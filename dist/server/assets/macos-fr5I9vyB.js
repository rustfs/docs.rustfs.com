import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/installation/macos/images/macos-setup.jpg
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var macos_setup_default = "/assets/macos-setup-DjUxT1xa.jpg";
//#endregion
//#region content/installation/macos/images/setting.jpg
var setting_default = "/assets/setting-CMbOzEQE.jpg";
//#endregion
//#region content/installation/macos/index.md?collection=docs
var frontmatter = {
	"title": "Installing RustFS on macOS",
	"description": "Quick ways to start RustFS on macOS, using the graphical one-click startup package."
};
var _markdown = "\n\n\n\n\n\nOn macOS, you can use three methods for installation:\n\n1. Docker\n2. Graphical one-click startup package\n3. Binary package\n\n> This article mainly explains how to use the RustFS **graphical one-click startup package** to quickly launch RustFS.\n\n<div className=\"fd-steps\">\n  <div className=\"fd-step\">\n    ## Preparation [#1-preparation]\n\n    <Callout type=\"info\">\n      **Graphical startup mode** only supports single-node single-disk mode, more suitable for development, debugging, and testing environments.\n    </Callout>\n\n    1. For detailed introduction about startup modes, please refer to [Installation Modes](../linux/quick-start.md#mode)\n    2. Download the installation package, modify permissions, and start.\n  </div>\n\n  <div className=\"fd-step\">\n    ## Download [#2-download]\n\n    Go to the official website download page and download the latest RustFS installation package.\n  </div>\n\n  <div className=\"fd-step\">\n    ## Modify Permissions [#3-modify-permissions]\n\n    Please confirm that this program has relevant execution permissions in the macOS operating system.\n  </div>\n\n  <div className=\"fd-step\">\n    ## Start the Service [#4-start-the-service]\n\n    1. Double-click the startup icon\n    2. Click configure disk\n    3. Click \"Start Service\", and RustFS service starts successfully.\n\n        <img alt=\"macos startup\" src=\"__img0\" />\n  </div>\n\n  <div className=\"fd-step\">\n    ## Modify Configuration [#5-modify-configuration]\n\n    Click the modify button (gear-shaped button) in the upper right corner to modify:\n\n    1. Server default port\n    2. Default administrator username and password\n    3. Specified disk directory\n\n        <img alt=\"RustFS macOS configuration\" src=\"__img1\" />\n  </div>\n\n  <div className=\"fd-step\">\n    ## Access Console [#6-access-console]\n\n    After successful startup, visit `http://127.0.0.1:7001` to access the console.\n\n    <Callout type=\"info\">\n      Port `7001` applies to the macOS desktop launcher. If you run the standalone `rustfs` server binary instead, the console listens on port `9001` by default.\n    </Callout>\n  </div>\n</div>\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "On macOS, you can use three methods for installation:"
		},
		{
			"heading": void 0,
			"content": "Docker"
		},
		{
			"heading": void 0,
			"content": "Graphical one-click startup package"
		},
		{
			"heading": void 0,
			"content": "Binary package"
		},
		{
			"heading": void 0,
			"content": "> This article mainly explains how to use the RustFS **graphical one-click startup package** to quickly launch RustFS."
		},
		{
			"heading": "1-preparation",
			"content": ":::note"
		},
		{
			"heading": "1-preparation",
			"content": "**Graphical startup mode** only supports single-node single-disk mode, more suitable for development, debugging, and testing environments."
		},
		{
			"heading": "1-preparation",
			"content": ":::"
		},
		{
			"heading": "1-preparation",
			"content": "For detailed introduction about startup modes, please refer to Installation Modes"
		},
		{
			"heading": "1-preparation",
			"content": "Download the installation package, modify permissions, and start."
		},
		{
			"heading": "2-download",
			"content": "Go to the official website download page and download the latest RustFS installation package."
		},
		{
			"heading": "3-modify-permissions",
			"content": "Please confirm that this program has relevant execution permissions in the macOS operating system."
		},
		{
			"heading": "4-start-the-service",
			"content": "Double-click the startup icon"
		},
		{
			"heading": "4-start-the-service",
			"content": "Click configure disk"
		},
		{
			"heading": "4-start-the-service",
			"content": "Click \"Start Service\", and RustFS service starts successfully."
		},
		{
			"heading": "5-modify-configuration",
			"content": "Click the modify button (gear-shaped button) in the upper right corner to modify:"
		},
		{
			"heading": "5-modify-configuration",
			"content": "Server default port"
		},
		{
			"heading": "5-modify-configuration",
			"content": "Default administrator username and password"
		},
		{
			"heading": "5-modify-configuration",
			"content": "Specified disk directory"
		},
		{
			"heading": "6-access-console",
			"content": "After successful startup, visit `http://127.0.0.1:7001` to access the console."
		},
		{
			"heading": "6-access-console",
			"content": ":::note"
		},
		{
			"heading": "6-access-console",
			"content": "Port `7001` applies to the macOS desktop launcher. If you run the standalone `rustfs` server binary instead, the console listens on port `9001` by default."
		},
		{
			"heading": "6-access-console",
			"content": ":::"
		}
	],
	"headings": [
		{
			"id": "1-preparation",
			"content": "1\\. Preparation"
		},
		{
			"id": "2-download",
			"content": "2\\. Download"
		},
		{
			"id": "3-modify-permissions",
			"content": "3\\. Modify Permissions"
		},
		{
			"id": "4-start-the-service",
			"content": "4\\. Start the Service"
		},
		{
			"id": "5-modify-configuration",
			"content": "5\\. Modify Configuration"
		},
		{
			"id": "6-access-console",
			"content": "6\\. Access Console"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#1-preparation",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Preparation" }),
		_step: 1
	},
	{
		depth: 2,
		url: "#2-download",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Download" }),
		_step: 2
	},
	{
		depth: 2,
		url: "#3-modify-permissions",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Modify Permissions" }),
		_step: 3
	},
	{
		depth: 2,
		url: "#4-start-the-service",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Start the Service" }),
		_step: 4
	},
	{
		depth: 2,
		url: "#5-modify-configuration",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Modify Configuration" }),
		_step: 5
	},
	{
		depth: 2,
		url: "#6-access-console",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Access Console" }),
		_step: 6
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		blockquote: "blockquote",
		code: "code",
		div: "div",
		h2: "h2",
		img: "img",
		li: "li",
		ol: "ol",
		p: "p",
		strong: "strong",
		...props.components
	}, { Callout } = _components;
	if (!Callout) _missingMdxReference("Callout", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "On macOS, you can use three methods for installation:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Docker" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Graphical one-click startup package" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Binary package" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
				"This article mainly explains how to use the RustFS ",
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "graphical one-click startup package" }),
				" to quickly launch RustFS."
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
			className: "fd-steps",
			children: [
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "1-preparation",
							"data-fd-step": "1",
							children: "Preparation"
						}),
						(0, import_jsx_runtime_react_server.jsx)(Callout, {
							type: "info",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Graphical startup mode" }), " only supports single-node single-disk mode, more suitable for development, debugging, and testing environments."] })
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: ["For detailed introduction about startup modes, please refer to ", (0, import_jsx_runtime_react_server.jsx)(_components.a, {
								href: "../linux/quick-start.md#mode",
								children: "Installation Modes"
							})] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Download the installation package, modify permissions, and start." }),
							"\n"
						] })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
						id: "2-download",
						"data-fd-step": "2",
						children: "Download"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Go to the official website download page and download the latest RustFS installation package." })]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
						id: "3-modify-permissions",
						"data-fd-step": "3",
						children: "Modify Permissions"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Please confirm that this program has relevant execution permissions in the macOS operating system." })]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "4-start-the-service",
							"data-fd-step": "4",
							children: "Start the Service"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Double-click the startup icon" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Click configure disk" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Click \"Start Service\", and RustFS service starts successfully." }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
							alt: "macos startup",
							src: macos_setup_default
						}) })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "5-modify-configuration",
							"data-fd-step": "5",
							children: "Modify Configuration"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Click the modify button (gear-shaped button) in the upper right corner to modify:" }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Server default port" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Default administrator username and password" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Specified disk directory" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
							alt: "RustFS macOS configuration",
							src: setting_default
						}) })
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "6-access-console",
							"data-fd-step": "6",
							children: "Access Console"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"After successful startup, visit ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "http://127.0.0.1:7001" }),
							" to access the console."
						] }),
						(0, import_jsx_runtime_react_server.jsx)(Callout, {
							type: "info",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
								"Port ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "7001" }),
								" applies to the macOS desktop launcher. If you run the standalone ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs" }),
								" server binary instead, the console listens on port ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "9001" }),
								" by default."
							] })
						})
					]
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
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
export { _markdown, MDXContent as default, frontmatter, structuredData, toc };
