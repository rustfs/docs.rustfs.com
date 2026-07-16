import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/concepts/limit.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Usage Limits",
	"description": "RustFS is a simple, efficient, distributed object storage. It is fully S3 compatible, open source software released under the Apache2 license."
};
var _markdown = "\n\n## S3 API Limits [#s3-api-limits]\n\n> The following standards strictly follow S3 protocol standards for specification.\n\n| Item                                                                            | Specification                                        |\n| ------------------------------------------------------------------------------- | ---------------------------------------------------- |\n| Maximum object size                                                             | 5 TiB                                                |\n| Minimum object size                                                             | 0 B                                                  |\n| Maximum object size for single PUT operation                                    | Non-multipart upload: 5 GiB; Multipart upload: 5 TiB |\n| Maximum number of parts per upload                                              | 10,000                                               |\n| Part size range                                                                 | 5 MiB to 5 GiB; last part can be 0 B to 5 GiB        |\n| Maximum number of parts returned per list parts request                         | 10,000                                               |\n| Maximum number of objects returned per list objects request                     | 1,000                                                |\n| Maximum number of multipart uploads returned per list multipart uploads request | 1,000                                                |\n| Maximum length of bucket name                                                   | 63 characters                                        |\n| Maximum length of object name                                                   | 1024 characters                                      |\n| Maximum length of each `/` separated object name segment                        | 255 characters                                       |\n| Maximum number of versions per single object                                    | 10,000                                               |\n\n***\n\n## Erasure Coding Limits [#erasure-coding-limits]\n\n> EC parameters are configured based on Reed-Solomon matrix EC algorithm. Actual limits depend on the specific Erasure Coding (EC) configuration.\n\n| Item                                                                | Specification                                                                                      |\n| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |\n| Maximum number of servers per cluster                               | No hard limit                                                                                      |\n| Minimum number of servers                                           | 1                                                                                                  |\n| When server count is 1, minimum number of drives per server         | 1 (for single-node single-drive deployment, cannot provide additional reliability or availability) |\n| When server count is 2 or more, minimum number of drives per server | 1                                                                                                  |\n| Maximum number of drives per server                                 | No hard limit                                                                                      |\n| Read quorum count                                                   | N − M (the number of data shards, where M is the parity shard count)                               |\n| Write quorum count                                                  | N − M; when data and parity counts are equal, N − M + 1                                            |\n\n***\n\n## Object Naming Limits [#object-naming-limits]\n\n### File System and Operating System Limits [#file-system-and-operating-system-limits]\n\nObject names in RustFS are primarily limited by the underlying operating system and file system. For example, Windows and some other operating systems restrict the use of certain special characters such as `^`, `*`, `|`, `\\`, `/`, `&`, `\"`, or `;`.\n\nRefer to relevant documentation for a complete list of restrictions based on your specific operating system and file system.\n\nRustFS recommends using Linux operating systems based on XFS file systems in production environments for better performance and compatibility.\n\n### Naming Conflict Handling [#naming-conflict-handling]\n\nIn RustFS, applications must assign unique and non-conflicting keys to all objects. This includes avoiding creating objects whose names might conflict with parent object or sibling object names. RustFS will return an empty set when performing LIST operations at locations where conflicts occur.\n\nFor example, the following operations would cause namespace conflicts:\n\n```bash\nPUT data/hello/2025/first/a.csv\nPUT data/hello/2025/first # Conflicts with existing object prefix\n\nPUT data/hello/2025/first/\nPUT data/hello/2025/first/vendors.csv # Conflicts with existing object\n```\n\nAlthough you can perform GET or HEAD operations on these objects, naming conflicts will cause LIST operations executed at the `hello/2025/first/` path to return empty result sets.\n";
var structuredData = {
	"contents": [
		{
			"heading": "s3-api-limits",
			"content": "> The following standards strictly follow S3 protocol standards for specification."
		},
		{
			"heading": "s3-api-limits",
			"content": "Item"
		},
		{
			"heading": "s3-api-limits",
			"content": "Specification"
		},
		{
			"heading": "s3-api-limits",
			"content": "Maximum object size"
		},
		{
			"heading": "s3-api-limits",
			"content": "5 TiB"
		},
		{
			"heading": "s3-api-limits",
			"content": "Minimum object size"
		},
		{
			"heading": "s3-api-limits",
			"content": "0 B"
		},
		{
			"heading": "s3-api-limits",
			"content": "Maximum object size for single PUT operation"
		},
		{
			"heading": "s3-api-limits",
			"content": "Non-multipart upload: 5 GiB; Multipart upload: 5 TiB"
		},
		{
			"heading": "s3-api-limits",
			"content": "Maximum number of parts per upload"
		},
		{
			"heading": "s3-api-limits",
			"content": "10,000"
		},
		{
			"heading": "s3-api-limits",
			"content": "Part size range"
		},
		{
			"heading": "s3-api-limits",
			"content": "5 MiB to 5 GiB; last part can be 0 B to 5 GiB"
		},
		{
			"heading": "s3-api-limits",
			"content": "Maximum number of parts returned per list parts request"
		},
		{
			"heading": "s3-api-limits",
			"content": "10,000"
		},
		{
			"heading": "s3-api-limits",
			"content": "Maximum number of objects returned per list objects request"
		},
		{
			"heading": "s3-api-limits",
			"content": "1,000"
		},
		{
			"heading": "s3-api-limits",
			"content": "Maximum number of multipart uploads returned per list multipart uploads request"
		},
		{
			"heading": "s3-api-limits",
			"content": "1,000"
		},
		{
			"heading": "s3-api-limits",
			"content": "Maximum length of bucket name"
		},
		{
			"heading": "s3-api-limits",
			"content": "63 characters"
		},
		{
			"heading": "s3-api-limits",
			"content": "Maximum length of object name"
		},
		{
			"heading": "s3-api-limits",
			"content": "1024 characters"
		},
		{
			"heading": "s3-api-limits",
			"content": "Maximum length of each `/` separated object name segment"
		},
		{
			"heading": "s3-api-limits",
			"content": "255 characters"
		},
		{
			"heading": "s3-api-limits",
			"content": "Maximum number of versions per single object"
		},
		{
			"heading": "s3-api-limits",
			"content": "10,000"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "> EC parameters are configured based on Reed-Solomon matrix EC algorithm. Actual limits depend on the specific Erasure Coding (EC) configuration."
		},
		{
			"heading": "erasure-coding-limits",
			"content": "Item"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "Specification"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "Maximum number of servers per cluster"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "No hard limit"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "Minimum number of servers"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "1"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "When server count is 1, minimum number of drives per server"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "1 (for single-node single-drive deployment, cannot provide additional reliability or availability)"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "When server count is 2 or more, minimum number of drives per server"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "1"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "Maximum number of drives per server"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "No hard limit"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "Read quorum count"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "N − M (the number of data shards, where M is the parity shard count)"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "Write quorum count"
		},
		{
			"heading": "erasure-coding-limits",
			"content": "N − M; when data and parity counts are equal, N − M + 1"
		},
		{
			"heading": "file-system-and-operating-system-limits",
			"content": "Object names in RustFS are primarily limited by the underlying operating system and file system. For example, Windows and some other operating systems restrict the use of certain special characters such as `^`, `*`, `|`, `\\`, `/`, `&`, `\"`, or `;`."
		},
		{
			"heading": "file-system-and-operating-system-limits",
			"content": "Refer to relevant documentation for a complete list of restrictions based on your specific operating system and file system."
		},
		{
			"heading": "file-system-and-operating-system-limits",
			"content": "RustFS recommends using Linux operating systems based on XFS file systems in production environments for better performance and compatibility."
		},
		{
			"heading": "naming-conflict-handling",
			"content": "In RustFS, applications must assign unique and non-conflicting keys to all objects. This includes avoiding creating objects whose names might conflict with parent object or sibling object names. RustFS will return an empty set when performing LIST operations at locations where conflicts occur."
		},
		{
			"heading": "naming-conflict-handling",
			"content": "For example, the following operations would cause namespace conflicts:"
		},
		{
			"heading": "naming-conflict-handling",
			"content": "Although you can perform GET or HEAD operations on these objects, naming conflicts will cause LIST operations executed at the `hello/2025/first/` path to return empty result sets."
		}
	],
	"headings": [
		{
			"id": "s3-api-limits",
			"content": "S3 API Limits"
		},
		{
			"id": "erasure-coding-limits",
			"content": "Erasure Coding Limits"
		},
		{
			"id": "object-naming-limits",
			"content": "Object Naming Limits"
		},
		{
			"id": "file-system-and-operating-system-limits",
			"content": "File System and Operating System Limits"
		},
		{
			"id": "naming-conflict-handling",
			"content": "Naming Conflict Handling"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#s3-api-limits",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "S3 API Limits" })
	},
	{
		depth: 2,
		url: "#erasure-coding-limits",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Erasure Coding Limits" })
	},
	{
		depth: 2,
		url: "#object-naming-limits",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Object Naming Limits" })
	},
	{
		depth: 3,
		url: "#file-system-and-operating-system-limits",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "File System and Operating System Limits" })
	},
	{
		depth: 3,
		url: "#naming-conflict-handling",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Naming Conflict Handling" })
	}
];
function _createMdxContent(props) {
	const _components = {
		blockquote: "blockquote",
		code: "code",
		h2: "h2",
		h3: "h3",
		hr: "hr",
		p: "p",
		pre: "pre",
		span: "span",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "s3-api-limits",
			children: "S3 API Limits"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The following standards strictly follow S3 protocol standards for specification." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Item" }), (0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Specification" })] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Maximum object size" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "5 TiB" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Minimum object size" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "0 B" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Maximum object size for single PUT operation" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Non-multipart upload: 5 GiB; Multipart upload: 5 TiB" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Maximum number of parts per upload" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "10,000" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Part size range" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "5 MiB to 5 GiB; last part can be 0 B to 5 GiB" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Maximum number of parts returned per list parts request" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "10,000" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Maximum number of objects returned per list objects request" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "1,000" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Maximum number of multipart uploads returned per list multipart uploads request" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "1,000" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Maximum length of bucket name" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "63 characters" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Maximum length of object name" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "1024 characters" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsxs)(_components.td, { children: [
				"Maximum length of each ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/" }),
				" separated object name segment"
			] }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "255 characters" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Maximum number of versions per single object" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "10,000" })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "erasure-coding-limits",
			children: "Erasure Coding Limits"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "EC parameters are configured based on Reed-Solomon matrix EC algorithm. Actual limits depend on the specific Erasure Coding (EC) configuration." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Item" }), (0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Specification" })] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Maximum number of servers per cluster" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "No hard limit" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Minimum number of servers" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "1" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "When server count is 1, minimum number of drives per server" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "1 (for single-node single-drive deployment, cannot provide additional reliability or availability)" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "When server count is 2 or more, minimum number of drives per server" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "1" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Maximum number of drives per server" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "No hard limit" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Read quorum count" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "N − M (the number of data shards, where M is the parity shard count)" })] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Write quorum count" }), (0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "N − M; when data and parity counts are equal, N − M + 1" })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "object-naming-limits",
			children: "Object Naming Limits"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "file-system-and-operating-system-limits",
			children: "File System and Operating System Limits"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Object names in RustFS are primarily limited by the underlying operating system and file system. For example, Windows and some other operating systems restrict the use of certain special characters such as ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "^" }),
			", ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "*" }),
			", ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "|" }),
			", ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "\\" }),
			", ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/" }),
			", ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "&" }),
			", ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "\"" }),
			", or ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: ";" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Refer to relevant documentation for a complete list of restrictions based on your specific operating system and file system." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS recommends using Linux operating systems based on XFS file systems in production environments for better performance and compatibility." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "naming-conflict-handling",
			children: "Naming Conflict Handling"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "In RustFS, applications must assign unique and non-conflicting keys to all objects. This includes avoiding creating objects whose names might conflict with parent object or sibling object names. RustFS will return an empty set when performing LIST operations at locations where conflicts occur." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "For example, the following operations would cause namespace conflicts:" }),
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
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "PUT"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " data/hello/2025/first/a.csv"
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
							children: "PUT"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " data/hello/2025/first"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6A737D",
								"--shiki-dark": "#6A737D"
							},
							children: " # Conflicts with existing object prefix"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "PUT"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " data/hello/2025/first/"
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
							children: "PUT"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " data/hello/2025/first/vendors.csv"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6A737D",
								"--shiki-dark": "#6A737D"
							},
							children: " # Conflicts with existing object"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Although you can perform GET or HEAD operations on these objects, naming conflicts will cause LIST operations executed at the ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "hello/2025/first/" }),
			" path to return empty result sets."
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
