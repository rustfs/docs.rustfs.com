import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/concepts/principle/erasure-coding.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Erasure Coding Principles",
	"description": "RustFS, as a new-generation distributed object storage system, demonstrates unique advantages in cloud storage through innovative architectural design and memory safety features. One of its core innovations is the deep application of Reed-Solomon Erasure Coding."
};
var _markdown = "\n\n## Core Algorithm and Application Scope [#core-algorithm-and-application-scope]\n\nReed-Solomon Code (RS Code) is an erasure code based on finite field algebraic structures. Due to its **efficient data recovery capability** and **flexible redundancy configuration**, it is widely used in multiple fields. Below, we detail its core application scenarios from two dimensions: technical fields and practical applications:\n\n### 1.1. Distributed Storage Systems (such as RustFS) [#11-distributed-storage-systems-such-as-rustfs]\n\n* **Data Sharding and Redundancy**\n  Divide original data into `k` shards, generate `m` parity shards (total `n=k+m`). Any loss of ≤ `m` shards can recover data.\n  **Example**: RS(10,4) strategy allows simultaneous loss of 4 nodes (storage utilization 71%), saving 50% storage space compared to triple replication (33%).\n\n* **Fault Recovery Mechanism**\n  Through **Gaussian elimination** or &#x2A;*Fast Fourier Transform (FFT)** algorithms, use surviving shards to reconstruct lost data, with recovery time inversely proportional to network bandwidth.\n\n* **Dynamic Adjustment Capability**\n  Supports runtime adjustment of `(k,m)` parameters to adapt to different storage tiers' (hot/warm/cold data) reliability requirements.\n\n### 1.2. Communication Transmission [#12-communication-transmission]\n\n* **Satellite Communication**\n  Handle long delay, high bit error rate issues in deep space channels (e.g., NASA Mars rover uses RS(255,223) code with error correction capability up to 16 bytes/codeword).\n\n* **5G NR Standards**\n  Use RS codes combined with CRC checks in control channels to ensure reliable transmission of critical signaling.\n\n* **Wireless Sensor Networks**\n  Solve cumulative packet loss problems in multi-hop transmission, typical configuration RS(6,2) can tolerate 33% data loss.\n\n### 1.3. Digital Media Storage [#13-digital-media-storage]\n\n* **QR Codes**\n  Use RS codes to implement fault tolerance level adjustment (L7%, M15%, Q25%, H30%), ensuring correct decoding even with partially damaged areas.\n\n* **Blu-ray Discs**\n  Use RS(248,216) code combined with cross-interleaving to correct continuous burst errors caused by scratches.\n\n* **DNA Data Storage**\n  Add RS checksums during synthetic biomolecular chain synthesis to resist base synthesis/sequencing errors (e.g., Microsoft experimental project uses RS(4,2)).\n\n## Basic Concepts of Erasure Coding [#basic-concepts-of-erasure-coding]\n\n### 2.1 Evolution of Storage Redundancy [#21-evolution-of-storage-redundancy]\n\n```rust\n// Traditional triple replication storage\nlet data = \"object_content\";\nlet replicas = vec![data.clone(), data.clone(), data.clone()];\n```\n\nTraditional multi-replication schemes have low storage efficiency issues (storage utilization 33%). Erasure coding technology divides data into blocks and calculates checksum information, achieving a balance between storage efficiency and reliability.\n\n### 2.2 Core Parameter Definitions [#22-core-parameter-definitions]\n\n* **k**: Number of original data shards\n* **m**: Number of parity shards\n* **n**: Total number of shards (n = k + m)\n* **Recovery threshold**: Any k shards can recover original data\n\n| Scheme Type | Redundancy | Fault Tolerance |\n| ----------- | ---------- | --------------- |\n| 3 Replicas  | 200%       | 2 nodes         |\n| RS(10,4)    | 40%        | 4 nodes         |\n\n## Mathematical Principles of Reed-Solomon Codes [#mathematical-principles-of-reed-solomon-codes]\n\n### 3.1 Finite Field (Galois Field) Construction [#31-finite-field-galois-field-construction]\n\nUse GF(2^8) field (256 elements), satisfying:\n\n$$\nα^8 + α^4 + α^3 + α^2 + 1 = 0\n$$\n\nGenerator polynomial is `0x11D`, corresponding to binary `100011101`\n\n### 3.2 Encoding Matrix Construction [#32-encoding-matrix-construction]\n\nVandermonde matrix example (k=2, m=2):\n\n$$\nG = \\begin{bmatrix}\n1 & 0 \\\\\n0 & 1 \\\\\n1 & 1 \\\\\n1 & 2\n\\end{bmatrix}\n$$\n\n### 3.3 Encoding Process [#33-encoding-process]\n\nData vector D = \\[d₁, d₂,..., dk]\nEncoding result C = D × G\n\n**Generator polynomial interpolation method**:\nConstruct polynomial passing through k data points:\n\n$$\np(x) = d_1 + d_2x + ... + d_kx^{k-1}\n$$\n\nParity value calculation:\n\n$$\nc_i = p(i), \\quad i = k+1,...,n\n$$\n\n## Engineering Implementation in RustFS [#engineering-implementation-in-rustfs]\n\n### 4.1 Data Sharding Strategy [#41-data-sharding-strategy]\n\n```rust\nstruct Shard {\n index: u8,\n data: Vec<u8>,\n hash: [u8; 32],\n}\n\nfn split_data(data: &[u8], k: usize) -> Vec<Shard> {\n // Sharding logic implementation\n}\n```\n\n* Dynamic shard size adjustment (64 KB-4 MB)\n* Streaming shard checksums using the HighwayHash256 algorithm for bitrot detection\n\n### 4.2 Parallel Encoding Optimization [#42-parallel-encoding-optimization]\n\n```rust\nuse rayon::prelude::*;\n\nfn rs_encode(data: &[Shard], m: usize) -> Vec<Shard> {\n data.par_chunks(k).map(|chunk| {\n // SIMD-accelerated matrix operations\n unsafe { gf256_simd::rs_matrix_mul(chunk, &gen_matrix) }\n }).collect()\n}\n```\n\n* Parallel computing framework based on Rayon\n* Use AVX2 instruction set to optimize finite field operations\n\n### 4.3 Decoding Recovery Process [#43-decoding-recovery-process]\n\n<Mermaid\n  chart=\"sequenceDiagram\n Client->>Coordinator: Data read request\n Coordinator->>Nodes: Query shard status\n alt Sufficient available shards\n Nodes->>Coordinator: Return k shards\n Coordinator->>Decoder: Start decoding\n Decoder->>Client: Return original data\n else Insufficient shards\n Coordinator->>Repairer: Trigger repair process\n Repairer->>Nodes: Collect surviving shards\n Repairer->>Decoder: Data reconstruction\n Decoder->>Nodes: Write new shards\n end\"\n/>\n";
var structuredData = {
	"contents": [
		{
			"heading": "core-algorithm-and-application-scope",
			"content": "Reed-Solomon Code (RS Code) is an erasure code based on finite field algebraic structures. Due to its **efficient data recovery capability** and **flexible redundancy configuration**, it is widely used in multiple fields. Below, we detail its core application scenarios from two dimensions: technical fields and practical applications:"
		},
		{
			"heading": "11-distributed-storage-systems-such-as-rustfs",
			"content": "**Data Sharding and Redundancy**\nDivide original data into `k` shards, generate `m` parity shards (total `n=k+m`). Any loss of ≤ `m` shards can recover data.\n**Example**: RS(10,4) strategy allows simultaneous loss of 4 nodes (storage utilization 71%), saving 50% storage space compared to triple replication (33%)."
		},
		{
			"heading": "11-distributed-storage-systems-such-as-rustfs",
			"content": "**Fault Recovery Mechanism**\nThrough **Gaussian elimination** or &#x2A;*Fast Fourier Transform (FFT)** algorithms, use surviving shards to reconstruct lost data, with recovery time inversely proportional to network bandwidth."
		},
		{
			"heading": "11-distributed-storage-systems-such-as-rustfs",
			"content": "**Dynamic Adjustment Capability**\nSupports runtime adjustment of `(k,m)` parameters to adapt to different storage tiers' (hot/warm/cold data) reliability requirements."
		},
		{
			"heading": "12-communication-transmission",
			"content": "**Satellite Communication**\nHandle long delay, high bit error rate issues in deep space channels (e.g., NASA Mars rover uses RS(255,223) code with error correction capability up to 16 bytes/codeword)."
		},
		{
			"heading": "12-communication-transmission",
			"content": "**5G NR Standards**\nUse RS codes combined with CRC checks in control channels to ensure reliable transmission of critical signaling."
		},
		{
			"heading": "12-communication-transmission",
			"content": "**Wireless Sensor Networks**\nSolve cumulative packet loss problems in multi-hop transmission, typical configuration RS(6,2) can tolerate 33% data loss."
		},
		{
			"heading": "13-digital-media-storage",
			"content": "**QR Codes**\nUse RS codes to implement fault tolerance level adjustment (L7%, M15%, Q25%, H30%), ensuring correct decoding even with partially damaged areas."
		},
		{
			"heading": "13-digital-media-storage",
			"content": "**Blu-ray Discs**\nUse RS(248,216) code combined with cross-interleaving to correct continuous burst errors caused by scratches."
		},
		{
			"heading": "13-digital-media-storage",
			"content": "**DNA Data Storage**\nAdd RS checksums during synthetic biomolecular chain synthesis to resist base synthesis/sequencing errors (e.g., Microsoft experimental project uses RS(4,2))."
		},
		{
			"heading": "21-evolution-of-storage-redundancy",
			"content": "Traditional multi-replication schemes have low storage efficiency issues (storage utilization 33%). Erasure coding technology divides data into blocks and calculates checksum information, achieving a balance between storage efficiency and reliability."
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "**k**: Number of original data shards"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "**m**: Number of parity shards"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "**n**: Total number of shards (n = k + m)"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "**Recovery threshold**: Any k shards can recover original data"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "Scheme Type"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "Redundancy"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "Fault Tolerance"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "3 Replicas"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "200%"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "2 nodes"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "RS(10,4)"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "40%"
		},
		{
			"heading": "22-core-parameter-definitions",
			"content": "4 nodes"
		},
		{
			"heading": "31-finite-field-galois-field-construction",
			"content": "Use GF(2^8) field (256 elements), satisfying:"
		},
		{
			"heading": "31-finite-field-galois-field-construction",
			"content": "Generator polynomial is `0x11D`, corresponding to binary `100011101`"
		},
		{
			"heading": "32-encoding-matrix-construction",
			"content": "Vandermonde matrix example (k=2, m=2):"
		},
		{
			"heading": "33-encoding-process",
			"content": "Data vector D = \\[d₁, d₂,..., dk]\nEncoding result C = D × G"
		},
		{
			"heading": "33-encoding-process",
			"content": "**Generator polynomial interpolation method**:\nConstruct polynomial passing through k data points:"
		},
		{
			"heading": "33-encoding-process",
			"content": "Parity value calculation:"
		},
		{
			"heading": "41-data-sharding-strategy",
			"content": "Dynamic shard size adjustment (64 KB-4 MB)"
		},
		{
			"heading": "41-data-sharding-strategy",
			"content": "Streaming shard checksums using the HighwayHash256 algorithm for bitrot detection"
		},
		{
			"heading": "42-parallel-encoding-optimization",
			"content": "Parallel computing framework based on Rayon"
		},
		{
			"heading": "42-parallel-encoding-optimization",
			"content": "Use AVX2 instruction set to optimize finite field operations"
		}
	],
	"headings": [
		{
			"id": "core-algorithm-and-application-scope",
			"content": "Core Algorithm and Application Scope"
		},
		{
			"id": "11-distributed-storage-systems-such-as-rustfs",
			"content": "1.1. Distributed Storage Systems (such as RustFS)"
		},
		{
			"id": "12-communication-transmission",
			"content": "1.2. Communication Transmission"
		},
		{
			"id": "13-digital-media-storage",
			"content": "1.3. Digital Media Storage"
		},
		{
			"id": "basic-concepts-of-erasure-coding",
			"content": "Basic Concepts of Erasure Coding"
		},
		{
			"id": "21-evolution-of-storage-redundancy",
			"content": "2.1 Evolution of Storage Redundancy"
		},
		{
			"id": "22-core-parameter-definitions",
			"content": "2.2 Core Parameter Definitions"
		},
		{
			"id": "mathematical-principles-of-reed-solomon-codes",
			"content": "Mathematical Principles of Reed-Solomon Codes"
		},
		{
			"id": "31-finite-field-galois-field-construction",
			"content": "3.1 Finite Field (Galois Field) Construction"
		},
		{
			"id": "32-encoding-matrix-construction",
			"content": "3.2 Encoding Matrix Construction"
		},
		{
			"id": "33-encoding-process",
			"content": "3.3 Encoding Process"
		},
		{
			"id": "engineering-implementation-in-rustfs",
			"content": "Engineering Implementation in RustFS"
		},
		{
			"id": "41-data-sharding-strategy",
			"content": "4.1 Data Sharding Strategy"
		},
		{
			"id": "42-parallel-encoding-optimization",
			"content": "4.2 Parallel Encoding Optimization"
		},
		{
			"id": "43-decoding-recovery-process",
			"content": "4.3 Decoding Recovery Process"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#core-algorithm-and-application-scope",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Core Algorithm and Application Scope" })
	},
	{
		depth: 3,
		url: "#11-distributed-storage-systems-such-as-rustfs",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "1.1. Distributed Storage Systems (such as RustFS)" })
	},
	{
		depth: 3,
		url: "#12-communication-transmission",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "1.2. Communication Transmission" })
	},
	{
		depth: 3,
		url: "#13-digital-media-storage",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "1.3. Digital Media Storage" })
	},
	{
		depth: 2,
		url: "#basic-concepts-of-erasure-coding",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Basic Concepts of Erasure Coding" })
	},
	{
		depth: 3,
		url: "#21-evolution-of-storage-redundancy",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.1 Evolution of Storage Redundancy" })
	},
	{
		depth: 3,
		url: "#22-core-parameter-definitions",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.2 Core Parameter Definitions" })
	},
	{
		depth: 2,
		url: "#mathematical-principles-of-reed-solomon-codes",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Mathematical Principles of Reed-Solomon Codes" })
	},
	{
		depth: 3,
		url: "#31-finite-field-galois-field-construction",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "3.1 Finite Field (Galois Field) Construction" })
	},
	{
		depth: 3,
		url: "#32-encoding-matrix-construction",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "3.2 Encoding Matrix Construction" })
	},
	{
		depth: 3,
		url: "#33-encoding-process",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "3.3 Encoding Process" })
	},
	{
		depth: 2,
		url: "#engineering-implementation-in-rustfs",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Engineering Implementation in RustFS" })
	},
	{
		depth: 3,
		url: "#41-data-sharding-strategy",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "4.1 Data Sharding Strategy" })
	},
	{
		depth: 3,
		url: "#42-parallel-encoding-optimization",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "4.2 Parallel Encoding Optimization" })
	},
	{
		depth: 3,
		url: "#43-decoding-recovery-process",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "4.3 Decoding Recovery Process" })
	}
];
function _createMdxContent(props) {
	const _components = {
		annotation: "annotation",
		code: "code",
		h2: "h2",
		h3: "h3",
		li: "li",
		math: "math",
		mi: "mi",
		mn: "mn",
		mo: "mo",
		mrow: "mrow",
		mspace: "mspace",
		mstyle: "mstyle",
		msub: "msub",
		msup: "msup",
		mtable: "mtable",
		mtd: "mtd",
		mtr: "mtr",
		p: "p",
		path: "path",
		pre: "pre",
		semantics: "semantics",
		span: "span",
		strong: "strong",
		svg: "svg",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		ul: "ul",
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "core-algorithm-and-application-scope",
			children: "Core Algorithm and Application Scope"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Reed-Solomon Code (RS Code) is an erasure code based on finite field algebraic structures. Due to its ",
			(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "efficient data recovery capability" }),
			" and ",
			(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "flexible redundancy configuration" }),
			", it is widely used in multiple fields. Below, we detail its core application scenarios from two dimensions: technical fields and practical applications:"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "11-distributed-storage-systems-such-as-rustfs",
			children: "1.1. Distributed Storage Systems (such as RustFS)"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
					(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Data Sharding and Redundancy" }),
					"\nDivide original data into ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "k" }),
					" shards, generate ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "m" }),
					" parity shards (total ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "n=k+m" }),
					"). Any loss of ≤ ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "m" }),
					" shards can recover data.\n",
					(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Example" }),
					": RS(10,4) strategy allows simultaneous loss of 4 nodes (storage utilization 71%), saving 50% storage space compared to triple replication (33%)."
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
					(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Fault Recovery Mechanism" }),
					"\nThrough ",
					(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Gaussian elimination" }),
					" or ",
					(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Fast Fourier Transform (FFT)" }),
					" algorithms, use surviving shards to reconstruct lost data, with recovery time inversely proportional to network bandwidth."
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
					(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Dynamic Adjustment Capability" }),
					"\nSupports runtime adjustment of ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "(k,m)" }),
					" parameters to adapt to different storage tiers' (hot/warm/cold data) reliability requirements."
				] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "12-communication-transmission",
			children: "1.2. Communication Transmission"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Satellite Communication" }), "\nHandle long delay, high bit error rate issues in deep space channels (e.g., NASA Mars rover uses RS(255,223) code with error correction capability up to 16 bytes/codeword)."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "5G NR Standards" }), "\nUse RS codes combined with CRC checks in control channels to ensure reliable transmission of critical signaling."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Wireless Sensor Networks" }), "\nSolve cumulative packet loss problems in multi-hop transmission, typical configuration RS(6,2) can tolerate 33% data loss."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "13-digital-media-storage",
			children: "1.3. Digital Media Storage"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "QR Codes" }), "\nUse RS codes to implement fault tolerance level adjustment (L7%, M15%, Q25%, H30%), ensuring correct decoding even with partially damaged areas."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Blu-ray Discs" }), "\nUse RS(248,216) code combined with cross-interleaving to correct continuous burst errors caused by scratches."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "DNA Data Storage" }), "\nAdd RS checksums during synthetic biomolecular chain synthesis to resist base synthesis/sequencing errors (e.g., Microsoft experimental project uses RS(4,2))."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "basic-concepts-of-erasure-coding",
			children: "Basic Concepts of Erasure Coding"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "21-evolution-of-storage-redundancy",
			children: "2.1 Evolution of Storage Redundancy"
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
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M23.8346 11.7033l-1.0073-.6236a13.7268 13.7268 0 00-.0283-.2936l.8656-.8069a.3483.3483 0 00-.1154-.578l-1.1066-.414a8.4958 8.4958 0 00-.087-.2856l.6904-.9587a.3462.3462 0 00-.2257-.5446l-1.1663-.1894a9.3574 9.3574 0 00-.1407-.2622l.49-1.0761a.3437.3437 0 00-.0274-.3361.3486.3486 0 00-.3006-.154l-1.1845.0416a6.7444 6.7444 0 00-.1873-.2268l.2723-1.153a.3472.3472 0 00-.417-.4172l-1.1532.2724a14.0183 14.0183 0 00-.2278-.1873l.0415-1.1845a.3442.3442 0 00-.49-.328l-1.076.491c-.0872-.0476-.1742-.0952-.2623-.1407l-.1903-1.1673A.3483.3483 0 0016.256.955l-.9597.6905a8.4867 8.4867 0 00-.2855-.086l-.414-1.1066a.3483.3483 0 00-.5781-.1154l-.8069.8666a9.2936 9.2936 0 00-.2936-.0284L12.2946.1683a.3462.3462 0 00-.5892 0l-.6236 1.0073a13.7383 13.7383 0 00-.2936.0284L9.9803.3374a.3462.3462 0 00-.578.1154l-.4141 1.1065c-.0962.0274-.1903.0567-.2855.086L7.744.955a.3483.3483 0 00-.5447.2258L7.009 2.348a9.3574 9.3574 0 00-.2622.1407l-1.0762-.491a.3462.3462 0 00-.49.328l.0416 1.1845a7.9826 7.9826 0 00-.2278.1873L3.8413 3.425a.3472.3472 0 00-.4171.4171l.2713 1.1531c-.0628.075-.1255.1509-.1863.2268l-1.1845-.0415a.3462.3462 0 00-.328.49l.491 1.0761a9.167 9.167 0 00-.1407.2622l-1.1662.1894a.3483.3483 0 00-.2258.5446l.6904.9587a13.303 13.303 0 00-.087.2855l-1.1065.414a.3483.3483 0 00-.1155.5781l.8656.807a9.2936 9.2936 0 00-.0283.2935l-1.0073.6236a.3442.3442 0 000 .5892l1.0073.6236c.008.0982.0182.1964.0283.2936l-.8656.8079a.3462.3462 0 00.1155.578l1.1065.4141c.0273.0962.0567.1914.087.2855l-.6904.9587a.3452.3452 0 00.2268.5447l1.1662.1893c.0456.088.0922.1751.1408.2622l-.491 1.0762a.3462.3462 0 00.328.49l1.1834-.0415c.0618.0769.1235.1528.1873.2277l-.2713 1.1541a.3462.3462 0 00.4171.4161l1.153-.2713c.075.0638.151.1255.2279.1863l-.0415 1.1845a.3442.3442 0 00.49.327l1.0761-.49c.087.0486.1741.0951.2622.1407l.1903 1.1662a.3483.3483 0 00.5447.2268l.9587-.6904a9.299 9.299 0 00.2855.087l.414 1.1066a.3452.3452 0 00.5781.1154l.8079-.8656c.0972.0111.1954.0203.2936.0294l.6236 1.0073a.3472.3472 0 00.5892 0l.6236-1.0073c.0982-.0091.1964-.0183.2936-.0294l.8069.8656a.3483.3483 0 00.578-.1154l.4141-1.1066a8.4626 8.4626 0 00.2855-.087l.9587.6904a.3452.3452 0 00.5447-.2268l.1903-1.1662c.088-.0456.1751-.0931.2622-.1407l1.0762.49a.3472.3472 0 00.49-.327l-.0415-1.1845a6.7267 6.7267 0 00.2267-.1863l1.1531.2713a.3472.3472 0 00.4171-.416l-.2713-1.1542c.0628-.0749.1255-.1508.1863-.2278l1.1845.0415a.3442.3442 0 00.328-.49l-.49-1.076c.0475-.0872.0951-.1742.1407-.2623l1.1662-.1893a.3483.3483 0 00.2258-.5447l-.6904-.9587.087-.2855 1.1066-.414a.3462.3462 0 00.1154-.5781l-.8656-.8079c.0101-.0972.0202-.1954.0283-.2936l1.0073-.6236a.3442.3442 0 000-.5892zm-6.7413 8.3551a.7138.7138 0 01.2986-1.396.714.714 0 11-.2997 1.396zm-.3422-2.3142a.649.649 0 00-.7715.5l-.3573 1.6685c-1.1035.501-2.3285.7795-3.6193.7795a8.7368 8.7368 0 01-3.6951-.814l-.3574-1.6684a.648.648 0 00-.7714-.499l-1.473.3158a8.7216 8.7216 0 01-.7613-.898h7.1676c.081 0 .1356-.0141.1356-.088v-2.536c0-.074-.0536-.0881-.1356-.0881h-2.0966v-1.6077h2.2677c.2065 0 1.1065.0587 1.394 1.2088.0901.3533.2875 1.5044.4232 1.8729.1346.413.6833 1.2381 1.2685 1.2381h3.5716a.7492.7492 0 00.1296-.0131 8.7874 8.7874 0 01-.8119.9526zM6.8369 20.024a.714.714 0 11-.2997-1.396.714.714 0 01.2997 1.396zM4.1177 8.9972a.7137.7137 0 11-1.304.5791.7137.7137 0 011.304-.579zm-.8352 1.9813l1.5347-.6824a.65.65 0 00.33-.8585l-.3158-.7147h1.2432v5.6025H3.5669a8.7753 8.7753 0 01-.2834-3.348zm6.7343-.5437V8.7836h2.9601c.153 0 1.0792.1772 1.0792.8697 0 .575-.7107.7815-1.2948.7815zm10.7574 1.4862c0 .2187-.008.4363-.0243.651h-.9c-.09 0-.1265.0586-.1265.1477v.413c0 .973-.5487 1.1846-1.0296 1.2382-.4576.0517-.9648-.1913-1.0275-.4717-.2704-1.5186-.7198-1.8436-1.4305-2.4034.8817-.5599 1.799-1.386 1.799-2.4915 0-1.1936-.819-1.9458-1.3769-2.3153-.7825-.5163-1.6491-.6195-1.883-.6195H5.4682a8.7651 8.7651 0 014.907-2.7699l1.0974 1.151a.648.648 0 00.9182.0213l1.227-1.1743a8.7753 8.7753 0 016.0044 4.2762l-.8403 1.8982a.652.652 0 00.33.8585l1.6178.7188c.0283.2875.0425.577.0425.8717zm-9.3006-9.5993a.7128.7128 0 11.984 1.0316.7137.7137 0 01-.984-1.0316zm8.3389 6.71a.7107.7107 0 01.9395-.3625.7137.7137 0 11-.9405.3635z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6A737D",
							"--shiki-dark": "#6A737D"
						},
						children: "// Traditional triple replication storage"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "let"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " data "
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
							children: " \"object_content\""
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ";"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "let"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " replicas "
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
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " vec!"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "[data"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "."
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "clone"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "(), data"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "."
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "clone"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "(), data"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "."
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "clone"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "()];"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Traditional multi-replication schemes have low storage efficiency issues (storage utilization 33%). Erasure coding technology divides data into blocks and calculates checksum information, achieving a balance between storage efficiency and reliability." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "22-core-parameter-definitions",
			children: "2.2 Core Parameter Definitions"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "k" }), ": Number of original data shards"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "m" }), ": Number of parity shards"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "n" }), ": Total number of shards (n = k + m)"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Recovery threshold" }), ": Any k shards can recover original data"] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Scheme Type" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Redundancy" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Fault Tolerance" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "3 Replicas" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "200%" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "2 nodes" })
		] }), (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "RS(10,4)" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "40%" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "4 nodes" })
		] })] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "mathematical-principles-of-reed-solomon-codes",
			children: "Mathematical Principles of Reed-Solomon Codes"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "31-finite-field-galois-field-construction",
			children: "3.1 Finite Field (Galois Field) Construction"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Use GF(2^8) field (256 elements), satisfying:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.span, {
			className: "katex-display",
			children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
				className: "katex",
				children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "katex-mathml",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.math, {
						xmlns: "http://www.w3.org/1998/Math/MathML",
						display: "block",
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.semantics, { children: [(0, import_jsx_runtime_react_server.jsxs)(_components.mrow, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.msup, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "α" }), (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "8" })] }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "+" }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.msup, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "α" }), (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "4" })] }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "+" }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.msup, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "α" }), (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "3" })] }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "+" }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.msup, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "α" }), (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "2" })] }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "+" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "1" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "=" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "0" })
						] }), (0, import_jsx_runtime_react_server.jsx)(_components.annotation, {
							encoding: "application/x-tex",
							children: "α^8 + α^4 + α^3 + α^2 + 1 = 0"
						})] })
					})
				}), (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "katex-html",
					"aria-hidden": "true",
					children: [
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "0.9474em",
										verticalAlign: "-0.0833em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "mord",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "mord mathnormal",
										style: { marginRight: "0.0037em" },
										children: "α"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "msupsub",
										children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "vlist-t",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "vlist-r",
												children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.8641em" },
													children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														style: {
															top: "-3.113em",
															marginRight: "0.05em"
														},
														children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "pstrut",
															style: { height: "2.7em" }
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "sizing reset-size6 size3 mtight",
															children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																className: "mord mtight",
																children: "8"
															})
														})]
													})
												})
											})
										})
									})]
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mbin",
									children: "+"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "0.9474em",
										verticalAlign: "-0.0833em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "mord",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "mord mathnormal",
										style: { marginRight: "0.0037em" },
										children: "α"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "msupsub",
										children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "vlist-t",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "vlist-r",
												children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.8641em" },
													children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														style: {
															top: "-3.113em",
															marginRight: "0.05em"
														},
														children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "pstrut",
															style: { height: "2.7em" }
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "sizing reset-size6 size3 mtight",
															children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																className: "mord mtight",
																children: "4"
															})
														})]
													})
												})
											})
										})
									})]
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mbin",
									children: "+"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "0.9474em",
										verticalAlign: "-0.0833em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "mord",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "mord mathnormal",
										style: { marginRight: "0.0037em" },
										children: "α"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "msupsub",
										children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "vlist-t",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "vlist-r",
												children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.8641em" },
													children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														style: {
															top: "-3.113em",
															marginRight: "0.05em"
														},
														children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "pstrut",
															style: { height: "2.7em" }
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "sizing reset-size6 size3 mtight",
															children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																className: "mord mtight",
																children: "3"
															})
														})]
													})
												})
											})
										})
									})]
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mbin",
									children: "+"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "0.9474em",
										verticalAlign: "-0.0833em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "mord",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "mord mathnormal",
										style: { marginRight: "0.0037em" },
										children: "α"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "msupsub",
										children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "vlist-t",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "vlist-r",
												children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.8641em" },
													children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														style: {
															top: "-3.113em",
															marginRight: "0.05em"
														},
														children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "pstrut",
															style: { height: "2.7em" }
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "sizing reset-size6 size3 mtight",
															children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																className: "mord mtight",
																children: "2"
															})
														})]
													})
												})
											})
										})
									})]
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mbin",
									children: "+"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: { height: "0.6444em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord",
									children: "1"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2778em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mrel",
									children: "="
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2778em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "strut",
								style: { height: "0.6444em" }
							}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "mord",
								children: "0"
							})]
						})
					]
				})]
			})
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Generator polynomial is ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "0x11D" }),
			", corresponding to binary ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "100011101" })
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "32-encoding-matrix-construction",
			children: "3.2 Encoding Matrix Construction"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Vandermonde matrix example (k=2, m=2):" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.span, {
			className: "katex-display",
			children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
				className: "katex",
				children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "katex-mathml",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.math, {
						xmlns: "http://www.w3.org/1998/Math/MathML",
						display: "block",
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.semantics, { children: [(0, import_jsx_runtime_react_server.jsxs)(_components.mrow, { children: [
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "G" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "=" }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.mrow, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.mo, {
									fence: "true",
									children: "["
								}),
								(0, import_jsx_runtime_react_server.jsxs)(_components.mtable, {
									rowspacing: "0.16em",
									columnalign: "center center",
									columnspacing: "1em",
									children: [
										(0, import_jsx_runtime_react_server.jsxs)(_components.mtr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mtd, { children: (0, import_jsx_runtime_react_server.jsx)(_components.mstyle, {
											scriptlevel: "0",
											displaystyle: "false",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "1" })
										}) }), (0, import_jsx_runtime_react_server.jsx)(_components.mtd, { children: (0, import_jsx_runtime_react_server.jsx)(_components.mstyle, {
											scriptlevel: "0",
											displaystyle: "false",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "0" })
										}) })] }),
										(0, import_jsx_runtime_react_server.jsxs)(_components.mtr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mtd, { children: (0, import_jsx_runtime_react_server.jsx)(_components.mstyle, {
											scriptlevel: "0",
											displaystyle: "false",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "0" })
										}) }), (0, import_jsx_runtime_react_server.jsx)(_components.mtd, { children: (0, import_jsx_runtime_react_server.jsx)(_components.mstyle, {
											scriptlevel: "0",
											displaystyle: "false",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "1" })
										}) })] }),
										(0, import_jsx_runtime_react_server.jsxs)(_components.mtr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mtd, { children: (0, import_jsx_runtime_react_server.jsx)(_components.mstyle, {
											scriptlevel: "0",
											displaystyle: "false",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "1" })
										}) }), (0, import_jsx_runtime_react_server.jsx)(_components.mtd, { children: (0, import_jsx_runtime_react_server.jsx)(_components.mstyle, {
											scriptlevel: "0",
											displaystyle: "false",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "1" })
										}) })] }),
										(0, import_jsx_runtime_react_server.jsxs)(_components.mtr, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mtd, { children: (0, import_jsx_runtime_react_server.jsx)(_components.mstyle, {
											scriptlevel: "0",
											displaystyle: "false",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "1" })
										}) }), (0, import_jsx_runtime_react_server.jsx)(_components.mtd, { children: (0, import_jsx_runtime_react_server.jsx)(_components.mstyle, {
											scriptlevel: "0",
											displaystyle: "false",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "2" })
										}) })] })
									]
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.mo, {
									fence: "true",
									children: "]"
								})
							] })
						] }), (0, import_jsx_runtime_react_server.jsx)(_components.annotation, {
							encoding: "application/x-tex",
							children: "G = \\begin{bmatrix}\n1 & 0 \\\\\n0 & 1 \\\\\n1 & 1 \\\\\n1 & 2\n\\end{bmatrix}"
						})] })
					})
				}), (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "katex-html",
					"aria-hidden": "true",
					children: [(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
						className: "base",
						children: [
							(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "strut",
								style: { height: "0.6833em" }
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "mord mathnormal",
								children: "G"
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "mspace",
								style: { marginRight: "0.2778em" }
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "mrel",
								children: "="
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "mspace",
								style: { marginRight: "0.2778em" }
							})
						]
					}), (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
						className: "base",
						children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							className: "strut",
							style: {
								height: "4.8em",
								verticalAlign: "-2.15em"
							}
						}), (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "minner",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mopen",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "delimsizing mult",
										children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "vlist-t vlist-t2",
											children: [(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
												className: "vlist-r",
												children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "2.65em" },
													children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														style: { top: "-4.65em" },
														children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "pstrut",
															style: { height: "6.8em" }
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															style: {
																width: "0.667em",
																height: "4.8em"
															},
															children: (0, import_jsx_runtime_react_server.jsx)(_components.svg, {
																xmlns: "http://www.w3.org/2000/svg",
																width: "0.667em",
																height: "4.8em",
																viewBox: "0 0 667 4800",
																children: (0, import_jsx_runtime_react_server.jsx)(_components.path, { d: "M403 1759 V84 H666 V0 H319 V1759 v1200 v1759 v84 h347 v-84\nH403z M403 1759 V0 H319 V1759 v1200 v1759 v84 h84z" })
															})
														})]
													})
												}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist-s",
													children: "​"
												})]
											}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "vlist-r",
												children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "2.15em" },
													children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {})
												})
											})]
										})
									})
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord",
									children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
										className: "mtable",
										children: [
											(0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "col-align-c",
												children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
													className: "vlist-t vlist-t2",
													children: [(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														className: "vlist-r",
														children: [(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
															className: "vlist",
															style: { height: "2.65em" },
															children: [
																(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
																	style: { top: "-4.81em" },
																	children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "pstrut",
																		style: { height: "3em" }
																	}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "mord",
																		children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																			className: "mord",
																			children: "1"
																		})
																	})]
																}),
																(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
																	style: { top: "-3.61em" },
																	children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "pstrut",
																		style: { height: "3em" }
																	}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "mord",
																		children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																			className: "mord",
																			children: "0"
																		})
																	})]
																}),
																(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
																	style: { top: "-2.41em" },
																	children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "pstrut",
																		style: { height: "3em" }
																	}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "mord",
																		children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																			className: "mord",
																			children: "1"
																		})
																	})]
																}),
																(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
																	style: { top: "-1.21em" },
																	children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "pstrut",
																		style: { height: "3em" }
																	}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "mord",
																		children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																			className: "mord",
																			children: "1"
																		})
																	})]
																})
															]
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "vlist-s",
															children: "​"
														})]
													}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
														className: "vlist-r",
														children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "vlist",
															style: { height: "2.15em" },
															children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {})
														})
													})]
												})
											}),
											(0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "arraycolsep",
												style: { width: "0.5em" }
											}),
											(0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "arraycolsep",
												style: { width: "0.5em" }
											}),
											(0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "col-align-c",
												children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
													className: "vlist-t vlist-t2",
													children: [(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														className: "vlist-r",
														children: [(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
															className: "vlist",
															style: { height: "2.65em" },
															children: [
																(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
																	style: { top: "-4.81em" },
																	children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "pstrut",
																		style: { height: "3em" }
																	}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "mord",
																		children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																			className: "mord",
																			children: "0"
																		})
																	})]
																}),
																(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
																	style: { top: "-3.61em" },
																	children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "pstrut",
																		style: { height: "3em" }
																	}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "mord",
																		children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																			className: "mord",
																			children: "1"
																		})
																	})]
																}),
																(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
																	style: { top: "-2.41em" },
																	children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "pstrut",
																		style: { height: "3em" }
																	}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "mord",
																		children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																			className: "mord",
																			children: "1"
																		})
																	})]
																}),
																(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
																	style: { top: "-1.21em" },
																	children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "pstrut",
																		style: { height: "3em" }
																	}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "mord",
																		children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																			className: "mord",
																			children: "2"
																		})
																	})]
																})
															]
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "vlist-s",
															children: "​"
														})]
													}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
														className: "vlist-r",
														children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "vlist",
															style: { height: "2.15em" },
															children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {})
														})
													})]
												})
											})
										]
									})
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mclose",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "delimsizing mult",
										children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "vlist-t vlist-t2",
											children: [(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
												className: "vlist-r",
												children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "2.65em" },
													children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														style: { top: "-4.65em" },
														children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "pstrut",
															style: { height: "6.8em" }
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															style: {
																width: "0.667em",
																height: "4.8em"
															},
															children: (0, import_jsx_runtime_react_server.jsx)(_components.svg, {
																xmlns: "http://www.w3.org/2000/svg",
																width: "0.667em",
																height: "4.8em",
																viewBox: "0 0 667 4800",
																children: (0, import_jsx_runtime_react_server.jsx)(_components.path, { d: "M347 1759 V0 H0 V84 H263 V1759 v1200 v1759 H0 v84 H347z\nM347 1759 V0 H263 V1759 v1200 v1759 h84z" })
															})
														})]
													})
												}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist-s",
													children: "​"
												})]
											}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "vlist-r",
												children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "2.15em" },
													children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {})
												})
											})]
										})
									})
								})
							]
						})]
					})]
				})]
			})
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "33-encoding-process",
			children: "3.3 Encoding Process"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Data vector D = [d₁, d₂,..., dk]\nEncoding result C = D × G" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Generator polynomial interpolation method" }), ":\nConstruct polynomial passing through k data points:"] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.span, {
			className: "katex-display",
			children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
				className: "katex",
				children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "katex-mathml",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.math, {
						xmlns: "http://www.w3.org/1998/Math/MathML",
						display: "block",
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.semantics, { children: [(0, import_jsx_runtime_react_server.jsxs)(_components.mrow, { children: [
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "p" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, {
								stretchy: "false",
								children: "("
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "x" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, {
								stretchy: "false",
								children: ")"
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "=" }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.msub, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "d" }), (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "1" })] }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "+" }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.msub, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "d" }), (0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "2" })] }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "x" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "+" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, {
								mathvariant: "normal",
								children: "."
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, {
								mathvariant: "normal",
								children: "."
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, {
								mathvariant: "normal",
								children: "."
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "+" }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.msub, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "d" }), (0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "k" })] }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.msup, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "x" }), (0, import_jsx_runtime_react_server.jsxs)(_components.mrow, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "k" }),
								(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "−" }),
								(0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "1" })
							] })] })
						] }), (0, import_jsx_runtime_react_server.jsx)(_components.annotation, {
							encoding: "application/x-tex",
							children: "p(x) = d_1 + d_2x + ... + d_kx^{k-1}"
						})] })
					})
				}), (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "katex-html",
					"aria-hidden": "true",
					children: [
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "1em",
										verticalAlign: "-0.25em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord mathnormal",
									children: "p"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mopen",
									children: "("
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord mathnormal",
									children: "x"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mclose",
									children: ")"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2778em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mrel",
									children: "="
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2778em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "0.8444em",
										verticalAlign: "-0.15em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "mord",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "mord mathnormal",
										children: "d"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "msupsub",
										children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "vlist-t vlist-t2",
											children: [(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
												className: "vlist-r",
												children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.3011em" },
													children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														style: {
															top: "-2.55em",
															marginLeft: "0em",
															marginRight: "0.05em"
														},
														children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "pstrut",
															style: { height: "2.7em" }
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "sizing reset-size6 size3 mtight",
															children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																className: "mord mtight",
																children: "1"
															})
														})]
													})
												}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist-s",
													children: "​"
												})]
											}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "vlist-r",
												children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.15em" },
													children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {})
												})
											})]
										})
									})]
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mbin",
									children: "+"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "0.8444em",
										verticalAlign: "-0.15em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "mord",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "mord mathnormal",
										children: "d"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "msupsub",
										children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "vlist-t vlist-t2",
											children: [(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
												className: "vlist-r",
												children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.3011em" },
													children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														style: {
															top: "-2.55em",
															marginLeft: "0em",
															marginRight: "0.05em"
														},
														children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "pstrut",
															style: { height: "2.7em" }
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "sizing reset-size6 size3 mtight",
															children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																className: "mord mtight",
																children: "2"
															})
														})]
													})
												}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist-s",
													children: "​"
												})]
											}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "vlist-r",
												children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.15em" },
													children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {})
												})
											})]
										})
									})]
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord mathnormal",
									children: "x"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mbin",
									children: "+"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "0.6667em",
										verticalAlign: "-0.0833em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord",
									children: "..."
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mbin",
									children: "+"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "1.0491em",
										verticalAlign: "-0.15em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "mord",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "mord mathnormal",
										children: "d"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "msupsub",
										children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "vlist-t vlist-t2",
											children: [(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
												className: "vlist-r",
												children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.3361em" },
													children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														style: {
															top: "-2.55em",
															marginLeft: "0em",
															marginRight: "0.05em"
														},
														children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "pstrut",
															style: { height: "2.7em" }
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "sizing reset-size6 size3 mtight",
															children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																className: "mord mathnormal mtight",
																style: { marginRight: "0.0315em" },
																children: "k"
															})
														})]
													})
												}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist-s",
													children: "​"
												})]
											}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "vlist-r",
												children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.15em" },
													children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {})
												})
											})]
										})
									})]
								}),
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "mord",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "mord mathnormal",
										children: "x"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "msupsub",
										children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
											className: "vlist-t",
											children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "vlist-r",
												children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.8991em" },
													children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														style: {
															top: "-3.113em",
															marginRight: "0.05em"
														},
														children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "pstrut",
															style: { height: "2.7em" }
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "sizing reset-size6 size3 mtight",
															children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
																className: "mord mtight",
																children: [
																	(0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "mord mathnormal mtight",
																		style: { marginRight: "0.0315em" },
																		children: "k"
																	}),
																	(0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "mbin mtight",
																		children: "−"
																	}),
																	(0, import_jsx_runtime_react_server.jsx)(_components.span, {
																		className: "mord mtight",
																		children: "1"
																	})
																]
															})
														})]
													})
												})
											})
										})
									})]
								})
							]
						})
					]
				})]
			})
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Parity value calculation:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.span, {
			className: "katex-display",
			children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
				className: "katex",
				children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "katex-mathml",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.math, {
						xmlns: "http://www.w3.org/1998/Math/MathML",
						display: "block",
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.semantics, { children: [(0, import_jsx_runtime_react_server.jsxs)(_components.mrow, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.msub, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "c" }), (0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "i" })] }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "=" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "p" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, {
								stretchy: "false",
								children: "("
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "i" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, {
								stretchy: "false",
								children: ")"
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, {
								separator: "true",
								children: ","
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mspace, { width: "1em" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "i" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "=" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "k" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, { children: "+" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mn, { children: "1" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, {
								separator: "true",
								children: ","
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, {
								mathvariant: "normal",
								children: "."
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, {
								mathvariant: "normal",
								children: "."
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, {
								mathvariant: "normal",
								children: "."
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mo, {
								separator: "true",
								children: ","
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.mi, { children: "n" })
						] }), (0, import_jsx_runtime_react_server.jsx)(_components.annotation, {
							encoding: "application/x-tex",
							children: "c_i = p(i), \\quad i = k+1,...,n"
						})] })
					})
				}), (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "katex-html",
					"aria-hidden": "true",
					children: [
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "0.5806em",
										verticalAlign: "-0.15em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "mord",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "mord mathnormal",
										children: "c"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										className: "msupsub",
										children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
											className: "vlist-t vlist-t2",
											children: [(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
												className: "vlist-r",
												children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.3117em" },
													children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
														style: {
															top: "-2.55em",
															marginLeft: "0em",
															marginRight: "0.05em"
														},
														children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "pstrut",
															style: { height: "2.7em" }
														}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
															className: "sizing reset-size6 size3 mtight",
															children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
																className: "mord mathnormal mtight",
																children: "i"
															})
														})]
													})
												}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist-s",
													children: "​"
												})]
											}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
												className: "vlist-r",
												children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
													className: "vlist",
													style: { height: "0.15em" },
													children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {})
												})
											})]
										})
									})]
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2778em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mrel",
									children: "="
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2778em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "1em",
										verticalAlign: "-0.25em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord mathnormal",
									children: "p"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mopen",
									children: "("
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord mathnormal",
									children: "i"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mclose",
									children: ")"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mpunct",
									children: ","
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "1em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.1667em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord mathnormal",
									children: "i"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2778em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mrel",
									children: "="
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2778em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "0.7778em",
										verticalAlign: "-0.0833em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord mathnormal",
									style: { marginRight: "0.0315em" },
									children: "k"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mbin",
									children: "+"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.2222em" }
								})
							]
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "base",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "strut",
									style: {
										height: "0.8389em",
										verticalAlign: "-0.1944em"
									}
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord",
									children: "1"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mpunct",
									children: ","
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.1667em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord",
									children: "..."
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mpunct",
									children: ","
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mspace",
									style: { marginRight: "0.1667em" }
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "mord mathnormal",
									children: "n"
								})
							]
						})
					]
				})]
			})
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "engineering-implementation-in-rustfs",
			children: "Engineering Implementation in RustFS"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "41-data-sharding-strategy",
			children: "4.1 Data Sharding Strategy"
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
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M23.8346 11.7033l-1.0073-.6236a13.7268 13.7268 0 00-.0283-.2936l.8656-.8069a.3483.3483 0 00-.1154-.578l-1.1066-.414a8.4958 8.4958 0 00-.087-.2856l.6904-.9587a.3462.3462 0 00-.2257-.5446l-1.1663-.1894a9.3574 9.3574 0 00-.1407-.2622l.49-1.0761a.3437.3437 0 00-.0274-.3361.3486.3486 0 00-.3006-.154l-1.1845.0416a6.7444 6.7444 0 00-.1873-.2268l.2723-1.153a.3472.3472 0 00-.417-.4172l-1.1532.2724a14.0183 14.0183 0 00-.2278-.1873l.0415-1.1845a.3442.3442 0 00-.49-.328l-1.076.491c-.0872-.0476-.1742-.0952-.2623-.1407l-.1903-1.1673A.3483.3483 0 0016.256.955l-.9597.6905a8.4867 8.4867 0 00-.2855-.086l-.414-1.1066a.3483.3483 0 00-.5781-.1154l-.8069.8666a9.2936 9.2936 0 00-.2936-.0284L12.2946.1683a.3462.3462 0 00-.5892 0l-.6236 1.0073a13.7383 13.7383 0 00-.2936.0284L9.9803.3374a.3462.3462 0 00-.578.1154l-.4141 1.1065c-.0962.0274-.1903.0567-.2855.086L7.744.955a.3483.3483 0 00-.5447.2258L7.009 2.348a9.3574 9.3574 0 00-.2622.1407l-1.0762-.491a.3462.3462 0 00-.49.328l.0416 1.1845a7.9826 7.9826 0 00-.2278.1873L3.8413 3.425a.3472.3472 0 00-.4171.4171l.2713 1.1531c-.0628.075-.1255.1509-.1863.2268l-1.1845-.0415a.3462.3462 0 00-.328.49l.491 1.0761a9.167 9.167 0 00-.1407.2622l-1.1662.1894a.3483.3483 0 00-.2258.5446l.6904.9587a13.303 13.303 0 00-.087.2855l-1.1065.414a.3483.3483 0 00-.1155.5781l.8656.807a9.2936 9.2936 0 00-.0283.2935l-1.0073.6236a.3442.3442 0 000 .5892l1.0073.6236c.008.0982.0182.1964.0283.2936l-.8656.8079a.3462.3462 0 00.1155.578l1.1065.4141c.0273.0962.0567.1914.087.2855l-.6904.9587a.3452.3452 0 00.2268.5447l1.1662.1893c.0456.088.0922.1751.1408.2622l-.491 1.0762a.3462.3462 0 00.328.49l1.1834-.0415c.0618.0769.1235.1528.1873.2277l-.2713 1.1541a.3462.3462 0 00.4171.4161l1.153-.2713c.075.0638.151.1255.2279.1863l-.0415 1.1845a.3442.3442 0 00.49.327l1.0761-.49c.087.0486.1741.0951.2622.1407l.1903 1.1662a.3483.3483 0 00.5447.2268l.9587-.6904a9.299 9.299 0 00.2855.087l.414 1.1066a.3452.3452 0 00.5781.1154l.8079-.8656c.0972.0111.1954.0203.2936.0294l.6236 1.0073a.3472.3472 0 00.5892 0l.6236-1.0073c.0982-.0091.1964-.0183.2936-.0294l.8069.8656a.3483.3483 0 00.578-.1154l.4141-1.1066a8.4626 8.4626 0 00.2855-.087l.9587.6904a.3452.3452 0 00.5447-.2268l.1903-1.1662c.088-.0456.1751-.0931.2622-.1407l1.0762.49a.3472.3472 0 00.49-.327l-.0415-1.1845a6.7267 6.7267 0 00.2267-.1863l1.1531.2713a.3472.3472 0 00.4171-.416l-.2713-1.1542c.0628-.0749.1255-.1508.1863-.2278l1.1845.0415a.3442.3442 0 00.328-.49l-.49-1.076c.0475-.0872.0951-.1742.1407-.2623l1.1662-.1893a.3483.3483 0 00.2258-.5447l-.6904-.9587.087-.2855 1.1066-.414a.3462.3462 0 00.1154-.5781l-.8656-.8079c.0101-.0972.0202-.1954.0283-.2936l1.0073-.6236a.3442.3442 0 000-.5892zm-6.7413 8.3551a.7138.7138 0 01.2986-1.396.714.714 0 11-.2997 1.396zm-.3422-2.3142a.649.649 0 00-.7715.5l-.3573 1.6685c-1.1035.501-2.3285.7795-3.6193.7795a8.7368 8.7368 0 01-3.6951-.814l-.3574-1.6684a.648.648 0 00-.7714-.499l-1.473.3158a8.7216 8.7216 0 01-.7613-.898h7.1676c.081 0 .1356-.0141.1356-.088v-2.536c0-.074-.0536-.0881-.1356-.0881h-2.0966v-1.6077h2.2677c.2065 0 1.1065.0587 1.394 1.2088.0901.3533.2875 1.5044.4232 1.8729.1346.413.6833 1.2381 1.2685 1.2381h3.5716a.7492.7492 0 00.1296-.0131 8.7874 8.7874 0 01-.8119.9526zM6.8369 20.024a.714.714 0 11-.2997-1.396.714.714 0 01.2997 1.396zM4.1177 8.9972a.7137.7137 0 11-1.304.5791.7137.7137 0 011.304-.579zm-.8352 1.9813l1.5347-.6824a.65.65 0 00.33-.8585l-.3158-.7147h1.2432v5.6025H3.5669a8.7753 8.7753 0 01-.2834-3.348zm6.7343-.5437V8.7836h2.9601c.153 0 1.0792.1772 1.0792.8697 0 .575-.7107.7815-1.2948.7815zm10.7574 1.4862c0 .2187-.008.4363-.0243.651h-.9c-.09 0-.1265.0586-.1265.1477v.413c0 .973-.5487 1.1846-1.0296 1.2382-.4576.0517-.9648-.1913-1.0275-.4717-.2704-1.5186-.7198-1.8436-1.4305-2.4034.8817-.5599 1.799-1.386 1.799-2.4915 0-1.1936-.819-1.9458-1.3769-2.3153-.7825-.5163-1.6491-.6195-1.883-.6195H5.4682a8.7651 8.7651 0 014.907-2.7699l1.0974 1.151a.648.648 0 00.9182.0213l1.227-1.1743a8.7753 8.7753 0 016.0044 4.2762l-.8403 1.8982a.652.652 0 00.33.8585l1.6178.7188c.0283.2875.0425.577.0425.8717zm-9.3006-9.5993a.7128.7128 0 11.984 1.0316.7137.7137 0 01-.984-1.0316zm8.3389 6.71a.7107.7107 0 01.9395-.3625.7137.7137 0 11-.9405.3635z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "struct"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " Shard"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " {"
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
							children: " index"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: ":"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " u8"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ","
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
							children: " data"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: ":"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " Vec"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "<"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "u8"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">,"
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
							children: " hash"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: ":"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " ["
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "u8"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "; "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "32"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "],"
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
						children: "}"
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
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "fn"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " split_data"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "(data"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: ":"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " &"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "["
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "u8"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "], k"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: ":"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " usize"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ") "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "->"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " Vec"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "<"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "Shard"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "> {"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6A737D",
							"--shiki-dark": "#6A737D"
						},
						children: " // Sharding logic implementation"
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
						children: "}"
					})
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Dynamic shard size adjustment (64 KB-4 MB)" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Streaming shard checksums using the HighwayHash256 algorithm for bitrot detection" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "42-parallel-encoding-optimization",
			children: "4.2 Parallel Encoding Optimization"
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
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M23.8346 11.7033l-1.0073-.6236a13.7268 13.7268 0 00-.0283-.2936l.8656-.8069a.3483.3483 0 00-.1154-.578l-1.1066-.414a8.4958 8.4958 0 00-.087-.2856l.6904-.9587a.3462.3462 0 00-.2257-.5446l-1.1663-.1894a9.3574 9.3574 0 00-.1407-.2622l.49-1.0761a.3437.3437 0 00-.0274-.3361.3486.3486 0 00-.3006-.154l-1.1845.0416a6.7444 6.7444 0 00-.1873-.2268l.2723-1.153a.3472.3472 0 00-.417-.4172l-1.1532.2724a14.0183 14.0183 0 00-.2278-.1873l.0415-1.1845a.3442.3442 0 00-.49-.328l-1.076.491c-.0872-.0476-.1742-.0952-.2623-.1407l-.1903-1.1673A.3483.3483 0 0016.256.955l-.9597.6905a8.4867 8.4867 0 00-.2855-.086l-.414-1.1066a.3483.3483 0 00-.5781-.1154l-.8069.8666a9.2936 9.2936 0 00-.2936-.0284L12.2946.1683a.3462.3462 0 00-.5892 0l-.6236 1.0073a13.7383 13.7383 0 00-.2936.0284L9.9803.3374a.3462.3462 0 00-.578.1154l-.4141 1.1065c-.0962.0274-.1903.0567-.2855.086L7.744.955a.3483.3483 0 00-.5447.2258L7.009 2.348a9.3574 9.3574 0 00-.2622.1407l-1.0762-.491a.3462.3462 0 00-.49.328l.0416 1.1845a7.9826 7.9826 0 00-.2278.1873L3.8413 3.425a.3472.3472 0 00-.4171.4171l.2713 1.1531c-.0628.075-.1255.1509-.1863.2268l-1.1845-.0415a.3462.3462 0 00-.328.49l.491 1.0761a9.167 9.167 0 00-.1407.2622l-1.1662.1894a.3483.3483 0 00-.2258.5446l.6904.9587a13.303 13.303 0 00-.087.2855l-1.1065.414a.3483.3483 0 00-.1155.5781l.8656.807a9.2936 9.2936 0 00-.0283.2935l-1.0073.6236a.3442.3442 0 000 .5892l1.0073.6236c.008.0982.0182.1964.0283.2936l-.8656.8079a.3462.3462 0 00.1155.578l1.1065.4141c.0273.0962.0567.1914.087.2855l-.6904.9587a.3452.3452 0 00.2268.5447l1.1662.1893c.0456.088.0922.1751.1408.2622l-.491 1.0762a.3462.3462 0 00.328.49l1.1834-.0415c.0618.0769.1235.1528.1873.2277l-.2713 1.1541a.3462.3462 0 00.4171.4161l1.153-.2713c.075.0638.151.1255.2279.1863l-.0415 1.1845a.3442.3442 0 00.49.327l1.0761-.49c.087.0486.1741.0951.2622.1407l.1903 1.1662a.3483.3483 0 00.5447.2268l.9587-.6904a9.299 9.299 0 00.2855.087l.414 1.1066a.3452.3452 0 00.5781.1154l.8079-.8656c.0972.0111.1954.0203.2936.0294l.6236 1.0073a.3472.3472 0 00.5892 0l.6236-1.0073c.0982-.0091.1964-.0183.2936-.0294l.8069.8656a.3483.3483 0 00.578-.1154l.4141-1.1066a8.4626 8.4626 0 00.2855-.087l.9587.6904a.3452.3452 0 00.5447-.2268l.1903-1.1662c.088-.0456.1751-.0931.2622-.1407l1.0762.49a.3472.3472 0 00.49-.327l-.0415-1.1845a6.7267 6.7267 0 00.2267-.1863l1.1531.2713a.3472.3472 0 00.4171-.416l-.2713-1.1542c.0628-.0749.1255-.1508.1863-.2278l1.1845.0415a.3442.3442 0 00.328-.49l-.49-1.076c.0475-.0872.0951-.1742.1407-.2623l1.1662-.1893a.3483.3483 0 00.2258-.5447l-.6904-.9587.087-.2855 1.1066-.414a.3462.3462 0 00.1154-.5781l-.8656-.8079c.0101-.0972.0202-.1954.0283-.2936l1.0073-.6236a.3442.3442 0 000-.5892zm-6.7413 8.3551a.7138.7138 0 01.2986-1.396.714.714 0 11-.2997 1.396zm-.3422-2.3142a.649.649 0 00-.7715.5l-.3573 1.6685c-1.1035.501-2.3285.7795-3.6193.7795a8.7368 8.7368 0 01-3.6951-.814l-.3574-1.6684a.648.648 0 00-.7714-.499l-1.473.3158a8.7216 8.7216 0 01-.7613-.898h7.1676c.081 0 .1356-.0141.1356-.088v-2.536c0-.074-.0536-.0881-.1356-.0881h-2.0966v-1.6077h2.2677c.2065 0 1.1065.0587 1.394 1.2088.0901.3533.2875 1.5044.4232 1.8729.1346.413.6833 1.2381 1.2685 1.2381h3.5716a.7492.7492 0 00.1296-.0131 8.7874 8.7874 0 01-.8119.9526zM6.8369 20.024a.714.714 0 11-.2997-1.396.714.714 0 01.2997 1.396zM4.1177 8.9972a.7137.7137 0 11-1.304.5791.7137.7137 0 011.304-.579zm-.8352 1.9813l1.5347-.6824a.65.65 0 00.33-.8585l-.3158-.7147h1.2432v5.6025H3.5669a8.7753 8.7753 0 01-.2834-3.348zm6.7343-.5437V8.7836h2.9601c.153 0 1.0792.1772 1.0792.8697 0 .575-.7107.7815-1.2948.7815zm10.7574 1.4862c0 .2187-.008.4363-.0243.651h-.9c-.09 0-.1265.0586-.1265.1477v.413c0 .973-.5487 1.1846-1.0296 1.2382-.4576.0517-.9648-.1913-1.0275-.4717-.2704-1.5186-.7198-1.8436-1.4305-2.4034.8817-.5599 1.799-1.386 1.799-2.4915 0-1.1936-.819-1.9458-1.3769-2.3153-.7825-.5163-1.6491-.6195-1.883-.6195H5.4682a8.7651 8.7651 0 014.907-2.7699l1.0974 1.151a.648.648 0 00.9182.0213l1.227-1.1743a8.7753 8.7753 0 016.0044 4.2762l-.8403 1.8982a.652.652 0 00.33.8585l1.6178.7188c.0283.2875.0425.577.0425.8717zm-9.3006-9.5993a.7128.7128 0 11.984 1.0316.7137.7137 0 01-.984-1.0316zm8.3389 6.71a.7107.7107 0 01.9395-.3625.7137.7137 0 11-.9405.3635z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "use"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " rayon"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "::"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "prelude"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "::*"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ";"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "fn"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " rs_encode"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "(data"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: ":"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " &"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "["
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "Shard"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "], m"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: ":"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " usize"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ") "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "->"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " Vec"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "<"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "Shard"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "> {"
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
							children: " data"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "."
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "par_chunks"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "(k)"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "."
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "map"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "("
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "|"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "chunk"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "|"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " {"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6A737D",
							"--shiki-dark": "#6A737D"
						},
						children: " // SIMD-accelerated matrix operations"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " unsafe"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " { "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "gf256_simd"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "::"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "rs_matrix_mul"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "(chunk, "
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "&"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "gen_matrix) }"
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
							children: " })"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "."
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "collect"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "()"
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
						children: "}"
					})
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Parallel computing framework based on Rayon" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Use AVX2 instruction set to optimize finite field operations" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "43-decoding-recovery-process",
			children: "4.3 Decoding Recovery Process"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "sequenceDiagram\n Client->>Coordinator: Data read request\n Coordinator->>Nodes: Query shard status\n alt Sufficient available shards\n Nodes->>Coordinator: Return k shards\n Coordinator->>Decoder: Start decoding\n Decoder->>Client: Return original data\n else Insufficient shards\n Coordinator->>Repairer: Trigger repair process\n Repairer->>Nodes: Collect surviving shards\n Repairer->>Decoder: Data reconstruction\n Decoder->>Nodes: Write new shards\n end" })
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
