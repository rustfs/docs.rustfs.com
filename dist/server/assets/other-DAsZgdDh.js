import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/developer/sdk/other.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Other SDKs",
	"description": "This article mainly explains the usage of various other language SDKs in RustFS."
};
var _markdown = "\n\nIf AWS S3 doesn't officially support your language, you can adopt the following strategies to integrate with RustFS:\n\n<div className=\"fd-steps\">\n  <div className=\"fd-step\">\n    ## Use HTTP Interface Direct Requests (Based on S3 API Protocol) [#1-use-http-interface-direct-requests-based-on-s3-api-protocol]\n\n    The S3 protocol is a standard RESTful API. You can encapsulate access logic yourself using any language that supports HTTP requests (such as C, Rust, Lua, Erlang).\n\n    ### Key points include: [#key-points-include]\n\n    * **Signature Algorithm**: Implement AWS Signature Version 4 signature (more complex)\n    * **Construct correct Headers and Canonical Request**\n    * **Use HTTPS/HTTP client to send requests**\n\n    👉 Recommended to reference open-source project signature implementations, for example:\n\n    * [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Call CLI Tools or Middleware Services of Existing SDKs [#2-call-cli-tools-or-middleware-services-of-existing-sdks]\n\n    If you don't want to implement signatures yourself, you can:\n\n    ### 2.1. Use AWS CLI tools with existing language support: [#21-use-aws-cli-tools-with-existing-language-support]\n\n    For example, call through Shell:\n\n    ```bash\n    aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000\n    ```\n\n    Or write a simple relay service using Node.js/Python SDK, and your language uploads/downloads by calling this service.\n\n    ### 2.2. Set up a Proxy (such as Flask, FastAPI, Express) [#22-set-up-a-proxy-such-as-flask-fastapi-express]\n\n    Let clients that don't support S3 call your encapsulated HTTP API:\n\n    ```http\n    POST /upload -> Service internally calls SDK to upload objects to RustFS\n    GET /presigned-url -> Generate presigned URL for frontend/client use\n    ```\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Find Third-Party Community SDKs [#3-find-third-party-community-sdks]\n\n    Although AWS doesn't have official SDKs, some language communities have developed unofficial S3 clients. For example:\n\n    * Haskell: `amazonka-s3`\n    * Rust: `rusoto` (deprecated) or `aws-sdk-rust`\n    * OCaml: May implement through `cohttp` yourself\n    * Delphi: Has commercial libraries supporting S3 protocol\n\n    Community SDKs vary greatly in stability, so you should evaluate activity, documentation, and compatibility before use.\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Delegate Core Upload Logic to Platform Hosting [#4-delegate-core-upload-logic-to-platform-hosting]\n\n    For example:\n\n    * Delegate frontend (Web/Mobile) upload tasks to browser or App side execution (using presigned URLs)\n    * Backend uses Node.js/Python/Go and other proxies to implement upload logic\n\n    ***\n  </div>\n</div>\n\n## Summary Recommendations [#summary-recommendations]\n\n| Scenario                                   | Recommended Solution                    |\n| ------------------------------------------ | --------------------------------------- |\n| Need complete control/embedded environment | Implement Signature V4 self-signing     |\n| Weak language support but has Shell        | Call upload through AWS CLI             |\n| Can deploy relay service                   | Use Python/Node to build S3 API gateway |\n| Frontend upload                            | Use presigned URLs                      |\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "If AWS S3 doesn't officially support your language, you can adopt the following strategies to integrate with RustFS:"
		},
		{
			"heading": "1-use-http-interface-direct-requests-based-on-s3-api-protocol",
			"content": "The S3 protocol is a standard RESTful API. You can encapsulate access logic yourself using any language that supports HTTP requests (such as C, Rust, Lua, Erlang)."
		},
		{
			"heading": "key-points-include",
			"content": "**Signature Algorithm**: Implement AWS Signature Version 4 signature (more complex)"
		},
		{
			"heading": "key-points-include",
			"content": "**Construct correct Headers and Canonical Request**"
		},
		{
			"heading": "key-points-include",
			"content": "**Use HTTPS/HTTP client to send requests**"
		},
		{
			"heading": "key-points-include",
			"content": "👉 Recommended to reference open-source project signature implementations, for example:"
		},
		{
			"heading": "key-points-include",
			"content": "https\\://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html"
		},
		{
			"heading": "2-call-cli-tools-or-middleware-services-of-existing-sdks",
			"content": "If you don't want to implement signatures yourself, you can:"
		},
		{
			"heading": "21-use-aws-cli-tools-with-existing-language-support",
			"content": "For example, call through Shell:"
		},
		{
			"heading": "21-use-aws-cli-tools-with-existing-language-support",
			"content": "Or write a simple relay service using Node.js/Python SDK, and your language uploads/downloads by calling this service."
		},
		{
			"heading": "22-set-up-a-proxy-such-as-flask-fastapi-express",
			"content": "Let clients that don't support S3 call your encapsulated HTTP API:"
		},
		{
			"heading": "3-find-third-party-community-sdks",
			"content": "Although AWS doesn't have official SDKs, some language communities have developed unofficial S3 clients. For example:"
		},
		{
			"heading": "3-find-third-party-community-sdks",
			"content": "Haskell: `amazonka-s3`"
		},
		{
			"heading": "3-find-third-party-community-sdks",
			"content": "Rust: `rusoto` (deprecated) or `aws-sdk-rust`"
		},
		{
			"heading": "3-find-third-party-community-sdks",
			"content": "OCaml: May implement through `cohttp` yourself"
		},
		{
			"heading": "3-find-third-party-community-sdks",
			"content": "Delphi: Has commercial libraries supporting S3 protocol"
		},
		{
			"heading": "3-find-third-party-community-sdks",
			"content": "Community SDKs vary greatly in stability, so you should evaluate activity, documentation, and compatibility before use."
		},
		{
			"heading": "4-delegate-core-upload-logic-to-platform-hosting",
			"content": "For example:"
		},
		{
			"heading": "4-delegate-core-upload-logic-to-platform-hosting",
			"content": "Delegate frontend (Web/Mobile) upload tasks to browser or App side execution (using presigned URLs)"
		},
		{
			"heading": "4-delegate-core-upload-logic-to-platform-hosting",
			"content": "Backend uses Node.js/Python/Go and other proxies to implement upload logic"
		},
		{
			"heading": "summary-recommendations",
			"content": "Scenario"
		},
		{
			"heading": "summary-recommendations",
			"content": "Recommended Solution"
		},
		{
			"heading": "summary-recommendations",
			"content": "Need complete control/embedded environment"
		},
		{
			"heading": "summary-recommendations",
			"content": "Implement Signature V4 self-signing"
		},
		{
			"heading": "summary-recommendations",
			"content": "Weak language support but has Shell"
		},
		{
			"heading": "summary-recommendations",
			"content": "Call upload through AWS CLI"
		},
		{
			"heading": "summary-recommendations",
			"content": "Can deploy relay service"
		},
		{
			"heading": "summary-recommendations",
			"content": "Use Python/Node to build S3 API gateway"
		},
		{
			"heading": "summary-recommendations",
			"content": "Frontend upload"
		},
		{
			"heading": "summary-recommendations",
			"content": "Use presigned URLs"
		}
	],
	"headings": [
		{
			"id": "1-use-http-interface-direct-requests-based-on-s3-api-protocol",
			"content": "1\\. Use HTTP Interface Direct Requests (Based on S3 API Protocol)"
		},
		{
			"id": "key-points-include",
			"content": "Key points include:"
		},
		{
			"id": "2-call-cli-tools-or-middleware-services-of-existing-sdks",
			"content": "2\\. Call CLI Tools or Middleware Services of Existing SDKs"
		},
		{
			"id": "21-use-aws-cli-tools-with-existing-language-support",
			"content": "2.1. Use AWS CLI tools with existing language support:"
		},
		{
			"id": "22-set-up-a-proxy-such-as-flask-fastapi-express",
			"content": "2.2. Set up a Proxy (such as Flask, FastAPI, Express)"
		},
		{
			"id": "3-find-third-party-community-sdks",
			"content": "3\\. Find Third-Party Community SDKs"
		},
		{
			"id": "4-delegate-core-upload-logic-to-platform-hosting",
			"content": "4\\. Delegate Core Upload Logic to Platform Hosting"
		},
		{
			"id": "summary-recommendations",
			"content": "Summary Recommendations"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#1-use-http-interface-direct-requests-based-on-s3-api-protocol",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Use HTTP Interface Direct Requests (Based on S3 API Protocol)" }),
		_step: 1
	},
	{
		depth: 3,
		url: "#key-points-include",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Key points include:" })
	},
	{
		depth: 2,
		url: "#2-call-cli-tools-or-middleware-services-of-existing-sdks",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Call CLI Tools or Middleware Services of Existing SDKs" }),
		_step: 2
	},
	{
		depth: 3,
		url: "#21-use-aws-cli-tools-with-existing-language-support",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.1. Use AWS CLI tools with existing language support:" })
	},
	{
		depth: 3,
		url: "#22-set-up-a-proxy-such-as-flask-fastapi-express",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.2. Set up a Proxy (such as Flask, FastAPI, Express)" })
	},
	{
		depth: 2,
		url: "#3-find-third-party-community-sdks",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Find Third-Party Community SDKs" }),
		_step: 3
	},
	{
		depth: 2,
		url: "#4-delegate-core-upload-logic-to-platform-hosting",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Delegate Core Upload Logic to Platform Hosting" }),
		_step: 4
	},
	{
		depth: 2,
		url: "#summary-recommendations",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Summary Recommendations" })
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
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If AWS S3 doesn't officially support your language, you can adopt the following strategies to integrate with RustFS:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
			className: "fd-steps",
			children: [
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "1-use-http-interface-direct-requests-based-on-s3-api-protocol",
							"data-fd-step": "1",
							children: "Use HTTP Interface Direct Requests (Based on S3 API Protocol)"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The S3 protocol is a standard RESTful API. You can encapsulate access logic yourself using any language that supports HTTP requests (such as C, Rust, Lua, Erlang)." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "key-points-include",
							children: "Key points include:"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Signature Algorithm" }), ": Implement AWS Signature Version 4 signature (more complex)"] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Construct correct Headers and Canonical Request" }) }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Use HTTPS/HTTP client to send requests" }) }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "👉 Recommended to reference open-source project signature implementations, for example:" }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
								href: "https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html",
								children: "https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html"
							}) }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "2-call-cli-tools-or-middleware-services-of-existing-sdks",
							"data-fd-step": "2",
							children: "Call CLI Tools or Middleware Services of Existing SDKs"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If you don't want to implement signatures yourself, you can:" }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "21-use-aws-cli-tools-with-existing-language-support",
							children: "2.1. Use AWS CLI tools with existing language support:"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "For example, call through Shell:" }),
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
										children: "aws"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " s3"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " cp"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " local.txt"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " s3://mybucket/myfile.txt"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " --endpoint-url"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " http://rustfs.local:9000"
									})
								]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Or write a simple relay service using Node.js/Python SDK, and your language uploads/downloads by calling this service." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "22-set-up-a-proxy-such-as-flask-fastapi-express",
							children: "2.2. Set up a Proxy (such as Flask, FastAPI, Express)"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Let clients that don't support S3 call your encapsulated HTTP API:" }),
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
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "POST"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " /upload -> Service internally calls SDK to upload objects to RustFS"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "GET"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " /presigned-url -> Generate presigned URL for frontend/client use"
									})]
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "3-find-third-party-community-sdks",
							"data-fd-step": "3",
							children: "Find Third-Party Community SDKs"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Although AWS doesn't have official SDKs, some language communities have developed unofficial S3 clients. For example:" }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: ["Haskell: ", (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "amazonka-s3" })] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"Rust: ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rusoto" }),
								" (deprecated) or ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "aws-sdk-rust" })
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"OCaml: May implement through ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "cohttp" }),
								" yourself"
							] }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Delphi: Has commercial libraries supporting S3 protocol" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Community SDKs vary greatly in stability, so you should evaluate activity, documentation, and compatibility before use." }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "4-delegate-core-upload-logic-to-platform-hosting",
							"data-fd-step": "4",
							children: "Delegate Core Upload Logic to Platform Hosting"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "For example:" }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Delegate frontend (Web/Mobile) upload tasks to browser or App side execution (using presigned URLs)" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Backend uses Node.js/Python/Go and other proxies to implement upload logic" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				})
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "summary-recommendations",
			children: "Summary Recommendations"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Scenario" }), (0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Recommended Solution" })] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Need complete control/embedded environment" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Implement Signature V4 self-signing" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Weak language support but has Shell" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Call upload through AWS CLI" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Can deploy relay service" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Use Python/Node to build S3 API gateway" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Frontend upload" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Use presigned URLs" })] })
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
//#endregion
export { _markdown, MDXContent as default, frontmatter, structuredData, toc };
