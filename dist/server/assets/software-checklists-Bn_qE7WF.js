import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/installation/checklists/software-checklists.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Software Checklist",
	"description": "Software requirements and considerations."
};
var _markdown = "\n\nEnsure the following requirements are met before deployment.\n\n## OS Requirements [#os-requirements]\n\n* **Operating System**: Use LTS versions (Ubuntu 20.04+, RHEL 8/9).\n* **Kernel**: Linux 5.x+ is recommended.\n* **CPU & Memory**: x86\\_64 or ARM. Minimum 2 GB RAM for testing, 64 GB+ for production.\n* **Disable Interfering Services**: Disable file indexing and auditing services (e.g., `mlocate`, `auditd`, antivirus) to prevent I/O interference.\n\n> **Why Linux 5.x+?**\n> Modern LTS kernels bring mature async I/O and filesystem improvements. RustFS also offers an optional `io_uring` read path (`RUSTFS_IO_URING_READ_ENABLE`, disabled by default), which requires Linux 5.10+ to be effective.\n\n## Binary Deployment [#binary-deployment]\n\n* **Official Download**: Download binaries only from official RustFS channels.\n* **Integrity Verification**: Verify SHA256 checksums.\n* **Consistency**: Ensure all nodes run the same RustFS version.\n* **Installation Location**: Place binaries in `/usr/local/bin` and ensure they are executable (`chmod +x`).\n\n## File System & Disks [#file-system--disks]\n\n* **Dedicated Data Disks**: Use dedicated disks for RustFS data. Do not share with the OS.\n* **File System**: Use XFS or Ext4 with performance options (e.g., `noatime`).\n* **Disk Configuration**: Use JBOD (independent volumes). Do not use hardware RAID.\n* **Permissions**: Ensure the RustFS user has read/write access to data directories.\n\n## Dependencies [#dependencies]\n\n* **Time Synchronization**: Synchronize time across all nodes using `ntp` or `chrony`.\n* **Hostname and DNS**: Configure persistent hostnames and ensure proper DNS resolution.\n* **Network Connectivity**: Ensure all nodes can communicate on the RustFS port (default 9000).\n* **TLS/Certificates**: Install root certificates and prepare server certificates if using HTTPS.\n* **Packages**: Ensure standard tools (`bash`, `glibc`, `openssl`) are installed.\n\n## User & Security [#user--security]\n\n* **Dedicated User**: Run RustFS as a dedicated user (e.g., `rustfs-user`).\n* **File Permissions**: Restrict access to binaries and configuration files.\n* **SELinux/AppArmor**: Configure policies to allow RustFS operations, or disable if appropriate.\n* **Systemd**: Configure the systemd service file correctly (`User=`, `ExecStart=`, environment variables).\n\n## Other [#other]\n\n* **Monitoring**: Configure Prometheus and Grafana.\n* **Rollback Plan**: Prepare configuration backups and a rollback plan.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Ensure the following requirements are met before deployment."
		},
		{
			"heading": "os-requirements",
			"content": "**Operating System**: Use LTS versions (Ubuntu 20.04+, RHEL 8/9)."
		},
		{
			"heading": "os-requirements",
			"content": "**Kernel**: Linux 5.x+ is recommended."
		},
		{
			"heading": "os-requirements",
			"content": "**CPU & Memory**: x86\\_64 or ARM. Minimum 2 GB RAM for testing, 64 GB+ for production."
		},
		{
			"heading": "os-requirements",
			"content": "**Disable Interfering Services**: Disable file indexing and auditing services (e.g., `mlocate`, `auditd`, antivirus) to prevent I/O interference."
		},
		{
			"heading": "os-requirements",
			"content": "> **Why Linux 5.x+?**\n> Modern LTS kernels bring mature async I/O and filesystem improvements. RustFS also offers an optional `io_uring` read path (`RUSTFS_IO_URING_READ_ENABLE`, disabled by default), which requires Linux 5.10+ to be effective."
		},
		{
			"heading": "binary-deployment",
			"content": "**Official Download**: Download binaries only from official RustFS channels."
		},
		{
			"heading": "binary-deployment",
			"content": "**Integrity Verification**: Verify SHA256 checksums."
		},
		{
			"heading": "binary-deployment",
			"content": "**Consistency**: Ensure all nodes run the same RustFS version."
		},
		{
			"heading": "binary-deployment",
			"content": "**Installation Location**: Place binaries in `/usr/local/bin` and ensure they are executable (`chmod +x`)."
		},
		{
			"heading": "file-system--disks",
			"content": "**Dedicated Data Disks**: Use dedicated disks for RustFS data. Do not share with the OS."
		},
		{
			"heading": "file-system--disks",
			"content": "**File System**: Use XFS or Ext4 with performance options (e.g., `noatime`)."
		},
		{
			"heading": "file-system--disks",
			"content": "**Disk Configuration**: Use JBOD (independent volumes). Do not use hardware RAID."
		},
		{
			"heading": "file-system--disks",
			"content": "**Permissions**: Ensure the RustFS user has read/write access to data directories."
		},
		{
			"heading": "dependencies",
			"content": "**Time Synchronization**: Synchronize time across all nodes using `ntp` or `chrony`."
		},
		{
			"heading": "dependencies",
			"content": "**Hostname and DNS**: Configure persistent hostnames and ensure proper DNS resolution."
		},
		{
			"heading": "dependencies",
			"content": "**Network Connectivity**: Ensure all nodes can communicate on the RustFS port (default 9000)."
		},
		{
			"heading": "dependencies",
			"content": "**TLS/Certificates**: Install root certificates and prepare server certificates if using HTTPS."
		},
		{
			"heading": "dependencies",
			"content": "**Packages**: Ensure standard tools (`bash`, `glibc`, `openssl`) are installed."
		},
		{
			"heading": "user--security",
			"content": "**Dedicated User**: Run RustFS as a dedicated user (e.g., `rustfs-user`)."
		},
		{
			"heading": "user--security",
			"content": "**File Permissions**: Restrict access to binaries and configuration files."
		},
		{
			"heading": "user--security",
			"content": "**SELinux/AppArmor**: Configure policies to allow RustFS operations, or disable if appropriate."
		},
		{
			"heading": "user--security",
			"content": "**Systemd**: Configure the systemd service file correctly (`User=`, `ExecStart=`, environment variables)."
		},
		{
			"heading": "other",
			"content": "**Monitoring**: Configure Prometheus and Grafana."
		},
		{
			"heading": "other",
			"content": "**Rollback Plan**: Prepare configuration backups and a rollback plan."
		}
	],
	"headings": [
		{
			"id": "os-requirements",
			"content": "OS Requirements"
		},
		{
			"id": "binary-deployment",
			"content": "Binary Deployment"
		},
		{
			"id": "file-system--disks",
			"content": "File System & Disks"
		},
		{
			"id": "dependencies",
			"content": "Dependencies"
		},
		{
			"id": "user--security",
			"content": "User & Security"
		},
		{
			"id": "other",
			"content": "Other"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#os-requirements",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "OS Requirements" })
	},
	{
		depth: 2,
		url: "#binary-deployment",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Binary Deployment" })
	},
	{
		depth: 2,
		url: "#file-system--disks",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "File System & Disks" })
	},
	{
		depth: 2,
		url: "#dependencies",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Dependencies" })
	},
	{
		depth: 2,
		url: "#user--security",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "User & Security" })
	},
	{
		depth: 2,
		url: "#other",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Other" })
	}
];
function _createMdxContent(props) {
	const _components = {
		blockquote: "blockquote",
		code: "code",
		h2: "h2",
		li: "li",
		p: "p",
		strong: "strong",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Ensure the following requirements are met before deployment." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "os-requirements",
			children: "OS Requirements"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Operating System" }), ": Use LTS versions (Ubuntu 20.04+, RHEL 8/9)."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Kernel" }), ": Linux 5.x+ is recommended."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "CPU & Memory" }), ": x86_64 or ARM. Minimum 2 GB RAM for testing, 64 GB+ for production."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Disable Interfering Services" }),
				": Disable file indexing and auditing services (e.g., ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "mlocate" }),
				", ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "auditd" }),
				", antivirus) to prevent I/O interference."
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Why Linux 5.x+?" }),
				"\nModern LTS kernels bring mature async I/O and filesystem improvements. RustFS also offers an optional ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "io_uring" }),
				" read path (",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_IO_URING_READ_ENABLE" }),
				", disabled by default), which requires Linux 5.10+ to be effective."
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "binary-deployment",
			children: "Binary Deployment"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Official Download" }), ": Download binaries only from official RustFS channels."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Integrity Verification" }), ": Verify SHA256 checksums."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Consistency" }), ": Ensure all nodes run the same RustFS version."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Installation Location" }),
				": Place binaries in ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/usr/local/bin" }),
				" and ensure they are executable (",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "chmod +x" }),
				")."
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "file-system--disks",
			children: "File System & Disks"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Dedicated Data Disks" }), ": Use dedicated disks for RustFS data. Do not share with the OS."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "File System" }),
				": Use XFS or Ext4 with performance options (e.g., ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "noatime" }),
				")."
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Disk Configuration" }), ": Use JBOD (independent volumes). Do not use hardware RAID."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Permissions" }), ": Ensure the RustFS user has read/write access to data directories."] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "dependencies",
			children: "Dependencies"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Time Synchronization" }),
				": Synchronize time across all nodes using ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "ntp" }),
				" or ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "chrony" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Hostname and DNS" }), ": Configure persistent hostnames and ensure proper DNS resolution."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Network Connectivity" }), ": Ensure all nodes can communicate on the RustFS port (default 9000)."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "TLS/Certificates" }), ": Install root certificates and prepare server certificates if using HTTPS."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Packages" }),
				": Ensure standard tools (",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "bash" }),
				", ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "glibc" }),
				", ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "openssl" }),
				") are installed."
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "user--security",
			children: "User & Security"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Dedicated User" }),
				": Run RustFS as a dedicated user (e.g., ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs-user" }),
				")."
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "File Permissions" }), ": Restrict access to binaries and configuration files."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "SELinux/AppArmor" }), ": Configure policies to allow RustFS operations, or disable if appropriate."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Systemd" }),
				": Configure the systemd service file correctly (",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "User=" }),
				", ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "ExecStart=" }),
				", environment variables)."
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "other",
			children: "Other"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Monitoring" }), ": Configure Prometheus and Grafana."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Rollback Plan" }), ": Prepare configuration backups and a rollback plan."] }),
			"\n"
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
