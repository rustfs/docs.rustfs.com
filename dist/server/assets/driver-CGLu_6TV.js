import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/troubleshooting/driver.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Hard Drive Failures",
	"description": "RustFS ensures read/write access can still be provided when some disks fail through mechanisms similar to erasure coding, and automatically heals data after replacing disks."
};
var _markdown = "\n\nRustFS ensures read/write access can still be provided when some disks fail through mechanisms similar to erasure coding, and automatically heals data after replacing disks.\n\n## Table of Contents [#table-of-contents]\n\n1. [Unmount Failed Disk](#unmount-failed-disk)\n2. [Replace Failed Disk](#replace-failed-disk)\n3. [Update `/etc/fstab` or RustFS Configuration](#update-etcfstab-or-rustfs-configuration)\n4. [Remount New Disk](#remount-new-disk)\n5. [Trigger and Monitor Data Healing](#trigger-and-monitor-data-healing)\n6. [Follow-up Checks and Notes](#follow-up-checks-and-notes)\n\n<a id=\"unmount-failed-disk\"></a>\n\n### Unmount Failed Disk [#unmount-failed-disk]\n\nBefore replacing the physical hard drive, you need to safely unmount the failed disk from the operating system level to avoid I/O errors in the file system or RustFS during the replacement process.\n\n```bash\n# Assume the failed disk is /dev/sdb\numount /dev/sdb\n```\n\n<Callout type=\"info\" title=\"Notes\">\n  * If there are multiple mount points, execute `umount` separately.\n  * If encountering \"device is busy\", you can first stop the RustFS service:\n\n  ```bash\n  systemctl stop rustfs\n  ```\n</Callout>\n\n<a id=\"replace-failed-disk\"></a>\n\n### Replace Failed Disk [#replace-failed-disk]\n\nAfter physically replacing the failed disk, you need to partition and format the new disk, and apply the same label as the original disk.\n\n```bash\n# Format as XFS and apply the same label as the original disk (RustFS requires XFS, like the other disks in the deployment)\nmkfs.xfs -L DISK1 /dev/sdb\n```\n\n> **Requirements**\n>\n> * New disk capacity ≥ original disk capacity;\n> * File system type consistent with other disks (XFS, per the [installation guide](../installation/linux/index.md));\n> * Recommend using labels (LABEL) or UUID for mounting to ensure disk order is not affected by system restarts.\n\n<a id=\"update-etcfstab-or-rustfs-configuration\"></a>\n\n### Update `/etc/fstab` or RustFS Configuration [#update-etcfstab-or-rustfs-configuration]\n\nConfirm that the mount item labels or UUIDs in `/etc/fstab` point to the new disk. The mount point must stay identical to the one listed in `RUSTFS_VOLUMES` (in `/etc/default/rustfs`), so the healed disk rejoins the cluster at the same path.\n\n```bash\n# View current fstab\ncat /etc/fstab\n\n# Example fstab entry (no modification needed if labels are the same)\nLABEL=DISK1 /data/rustfs0 xfs defaults,noatime 0 2\n```\n\n<Callout type=\"info\" title=\"Tips\">\n  * If using UUID:\n\n  ```bash\n  blkid /dev/sdb\n  # Get the new partition's UUID, then replace the corresponding field in fstab\n  ```\n\n  * After modifying fstab, be sure to validate syntax:\n\n  ```bash\n  mount -a # If no errors, configuration is correct\n  ```\n</Callout>\n\n<a id=\"remount-new-disk\"></a>\n\n### Remount New Disk [#remount-new-disk]\n\nExecute the following commands to batch mount all disks and start the RustFS service:\n\n```bash\nmount -a\nsystemctl start rustfs\n```\n\nConfirm all disks are mounted normally:\n\n```bash\ndf -h | grep /data/rustfs\n```\n\n<Callout type=\"info\">\n  If some mounts fail, please check if fstab entries are consistent with disk labels/UUIDs.\n</Callout>\n\n<a id=\"trigger-and-monitor-data-healing\"></a>\n\n### Trigger and Monitor Data Healing [#trigger-and-monitor-data-healing]\n\nOnce RustFS detects a freshly formatted disk at a known mount point, its background scanner heals the missing data onto it automatically — no manual command is required. Confirm that recovery has started and track its progress through the service logs:\n\n```bash\n# For systemd-managed installations\njournalctl -u rustfs -f\n\n# Or view the log files under the directory set by RUSTFS_OBS_LOG_DIRECTORY\ntail -f /var/logs/rustfs/rustfs.log\n```\n\nYou can also open the RustFS Console and check the disk status of the affected node.\n\n<Callout type=\"info\" title=\"Notes\">\n  * The healing process will complete in the background, usually with minimal impact on online access;\n  * After healing is complete, the tool will report success or list failed objects.\n</Callout>\n\n<a id=\"follow-up-checks-and-notes\"></a>\n\n### Follow-up Checks and Notes [#follow-up-checks-and-notes]\n\n1. **Performance Monitoring**\n\n* I/O may fluctuate slightly during healing, recommend monitoring disk and network load.\n\n2. **Batch Failures**\n\n* If multiple failures occur in the same batch of disks, consider more frequent hardware inspections.\n\n3. **Regular Drills**\n\n* Regularly simulate disk failure drills to ensure team familiarity with recovery processes.\n\n4. **Maintenance Windows**\n\n* When failure rates are high, arrange dedicated maintenance windows to speed up replacement and healing.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "RustFS ensures read/write access can still be provided when some disks fail through mechanisms similar to erasure coding, and automatically heals data after replacing disks."
		},
		{
			"heading": "table-of-contents",
			"content": "Unmount Failed Disk"
		},
		{
			"heading": "table-of-contents",
			"content": "Replace Failed Disk"
		},
		{
			"heading": "table-of-contents",
			"content": "Update `/etc/fstab` or RustFS Configuration"
		},
		{
			"heading": "table-of-contents",
			"content": "Remount New Disk"
		},
		{
			"heading": "table-of-contents",
			"content": "Trigger and Monitor Data Healing"
		},
		{
			"heading": "table-of-contents",
			"content": "Follow-up Checks and Notes"
		},
		{
			"heading": "table-of-contents",
			"content": "<a id=\"unmount-failed-disk\"></a>"
		},
		{
			"heading": "unmount-failed-disk",
			"content": "Before replacing the physical hard drive, you need to safely unmount the failed disk from the operating system level to avoid I/O errors in the file system or RustFS during the replacement process."
		},
		{
			"heading": "unmount-failed-disk",
			"content": ":::note\\[Notes]"
		},
		{
			"heading": "unmount-failed-disk",
			"content": "If there are multiple mount points, execute `umount` separately."
		},
		{
			"heading": "unmount-failed-disk",
			"content": "If encountering \"device is busy\", you can first stop the RustFS service:"
		},
		{
			"heading": "unmount-failed-disk",
			"content": ":::"
		},
		{
			"heading": "unmount-failed-disk",
			"content": "<a id=\"replace-failed-disk\"></a>"
		},
		{
			"heading": "replace-failed-disk",
			"content": "After physically replacing the failed disk, you need to partition and format the new disk, and apply the same label as the original disk."
		},
		{
			"heading": "replace-failed-disk",
			"content": "> **Requirements**\n>\n> * New disk capacity ≥ original disk capacity;\n> * File system type consistent with other disks (XFS, per the installation guide);\n> * Recommend using labels (LABEL) or UUID for mounting to ensure disk order is not affected by system restarts."
		},
		{
			"heading": "replace-failed-disk",
			"content": "<a id=\"update-etcfstab-or-rustfs-configuration\"></a>"
		},
		{
			"heading": "update-etcfstab-or-rustfs-configuration",
			"content": "Confirm that the mount item labels or UUIDs in `/etc/fstab` point to the new disk. The mount point must stay identical to the one listed in `RUSTFS_VOLUMES` (in `/etc/default/rustfs`), so the healed disk rejoins the cluster at the same path."
		},
		{
			"heading": "update-etcfstab-or-rustfs-configuration",
			"content": ":::tip\\[Tips]"
		},
		{
			"heading": "update-etcfstab-or-rustfs-configuration",
			"content": "If using UUID:"
		},
		{
			"heading": "update-etcfstab-or-rustfs-configuration",
			"content": "After modifying fstab, be sure to validate syntax:"
		},
		{
			"heading": "update-etcfstab-or-rustfs-configuration",
			"content": ":::"
		},
		{
			"heading": "update-etcfstab-or-rustfs-configuration",
			"content": "<a id=\"remount-new-disk\"></a>"
		},
		{
			"heading": "remount-new-disk",
			"content": "Execute the following commands to batch mount all disks and start the RustFS service:"
		},
		{
			"heading": "remount-new-disk",
			"content": "Confirm all disks are mounted normally:"
		},
		{
			"heading": "remount-new-disk",
			"content": ":::note"
		},
		{
			"heading": "remount-new-disk",
			"content": "If some mounts fail, please check if fstab entries are consistent with disk labels/UUIDs."
		},
		{
			"heading": "remount-new-disk",
			"content": ":::"
		},
		{
			"heading": "remount-new-disk",
			"content": "<a id=\"trigger-and-monitor-data-healing\"></a>"
		},
		{
			"heading": "trigger-and-monitor-data-healing",
			"content": "Once RustFS detects a freshly formatted disk at a known mount point, its background scanner heals the missing data onto it automatically — no manual command is required. Confirm that recovery has started and track its progress through the service logs:"
		},
		{
			"heading": "trigger-and-monitor-data-healing",
			"content": "You can also open the RustFS Console and check the disk status of the affected node."
		},
		{
			"heading": "trigger-and-monitor-data-healing",
			"content": ":::note\\[Notes]"
		},
		{
			"heading": "trigger-and-monitor-data-healing",
			"content": "The healing process will complete in the background, usually with minimal impact on online access;"
		},
		{
			"heading": "trigger-and-monitor-data-healing",
			"content": "After healing is complete, the tool will report success or list failed objects."
		},
		{
			"heading": "trigger-and-monitor-data-healing",
			"content": ":::"
		},
		{
			"heading": "trigger-and-monitor-data-healing",
			"content": "<a id=\"follow-up-checks-and-notes\"></a>"
		},
		{
			"heading": "follow-up-checks-and-notes",
			"content": "**Performance Monitoring**"
		},
		{
			"heading": "follow-up-checks-and-notes",
			"content": "I/O may fluctuate slightly during healing, recommend monitoring disk and network load."
		},
		{
			"heading": "follow-up-checks-and-notes",
			"content": "**Batch Failures**"
		},
		{
			"heading": "follow-up-checks-and-notes",
			"content": "If multiple failures occur in the same batch of disks, consider more frequent hardware inspections."
		},
		{
			"heading": "follow-up-checks-and-notes",
			"content": "**Regular Drills**"
		},
		{
			"heading": "follow-up-checks-and-notes",
			"content": "Regularly simulate disk failure drills to ensure team familiarity with recovery processes."
		},
		{
			"heading": "follow-up-checks-and-notes",
			"content": "**Maintenance Windows**"
		},
		{
			"heading": "follow-up-checks-and-notes",
			"content": "When failure rates are high, arrange dedicated maintenance windows to speed up replacement and healing."
		}
	],
	"headings": [
		{
			"id": "table-of-contents",
			"content": "Table of Contents"
		},
		{
			"id": "unmount-failed-disk",
			"content": "Unmount Failed Disk"
		},
		{
			"id": "replace-failed-disk",
			"content": "Replace Failed Disk"
		},
		{
			"id": "update-etcfstab-or-rustfs-configuration",
			"content": "Update `/etc/fstab` or RustFS Configuration"
		},
		{
			"id": "remount-new-disk",
			"content": "Remount New Disk"
		},
		{
			"id": "trigger-and-monitor-data-healing",
			"content": "Trigger and Monitor Data Healing"
		},
		{
			"id": "follow-up-checks-and-notes",
			"content": "Follow-up Checks and Notes"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#table-of-contents",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Table of Contents" })
	},
	{
		depth: 3,
		url: "#unmount-failed-disk",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Unmount Failed Disk" })
	},
	{
		depth: 3,
		url: "#replace-failed-disk",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Replace Failed Disk" })
	},
	{
		depth: 3,
		url: "#update-etcfstab-or-rustfs-configuration",
		title: (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
			"Update ",
			(0, import_jsx_runtime_react_server.jsx)("code", { children: "/etc/fstab" }),
			" or RustFS Configuration"
		] })
	},
	{
		depth: 3,
		url: "#remount-new-disk",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Remount New Disk" })
	},
	{
		depth: 3,
		url: "#trigger-and-monitor-data-healing",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Trigger and Monitor Data Healing" })
	},
	{
		depth: 3,
		url: "#follow-up-checks-and-notes",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Follow-up Checks and Notes" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		blockquote: "blockquote",
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
	}, { Callout } = _components;
	if (!Callout) _missingMdxReference("Callout", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS ensures read/write access can still be provided when some disks fail through mechanisms similar to erasure coding, and automatically heals data after replacing disks." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "table-of-contents",
			children: "Table of Contents"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "#unmount-failed-disk",
				children: "Unmount Failed Disk"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "#replace-failed-disk",
				children: "Replace Failed Disk"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.a, {
				href: "#update-etcfstab-or-rustfs-configuration",
				children: [
					"Update ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/etc/fstab" }),
					" or RustFS Configuration"
				]
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "#remount-new-disk",
				children: "Remount New Disk"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "#trigger-and-monitor-data-healing",
				children: "Trigger and Monitor Data Healing"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "#follow-up-checks-and-notes",
				children: "Follow-up Checks and Notes"
			}) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "unmount-failed-disk",
			children: "Unmount Failed Disk"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Before replacing the physical hard drive, you need to safely unmount the failed disk from the operating system level to avoid I/O errors in the file system or RustFS during the replacement process." }),
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
						children: "# Assume the failed disk is /dev/sdb"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "umount"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " /dev/sdb"
					})]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(Callout, {
			type: "info",
			title: "Notes",
			children: [(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
					"If there are multiple mount points, execute ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "umount" }),
					" separately."
				] }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "If encountering \"device is busy\", you can first stop the RustFS service:" }),
				"\n"
			] }), (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
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
							children: " stop"
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
			}) })]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "replace-failed-disk",
			children: "Replace Failed Disk"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "After physically replacing the failed disk, you need to partition and format the new disk, and apply the same label as the original disk." }),
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
						children: "# Format as XFS and apply the same label as the original disk (RustFS requires XFS, like the other disks in the deployment)"
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
							children: "mkfs.xfs"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -L"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " DISK1"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " /dev/sdb"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Requirements" }) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "New disk capacity ≥ original disk capacity;" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
					"File system type consistent with other disks (XFS, per the ",
					(0, import_jsx_runtime_react_server.jsx)(_components.a, {
						href: "../installation/linux/index.md",
						children: "installation guide"
					}),
					");"
				] }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Recommend using labels (LABEL) or UUID for mounting to ensure disk order is not affected by system restarts." }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.h3, {
			id: "update-etcfstab-or-rustfs-configuration",
			children: [
				"Update ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/etc/fstab" }),
				" or RustFS Configuration"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Confirm that the mount item labels or UUIDs in ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/etc/fstab" }),
			" point to the new disk. The mount point must stay identical to the one listed in ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_VOLUMES" }),
			" (in ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/etc/default/rustfs" }),
			"), so the healed disk rejoins the cluster at the same path."
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
						children: "# View current fstab"
					})
				}),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "cat"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " /etc/fstab"
					})]
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
						children: "# Example fstab entry (no modification needed if labels are the same)"
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
							children: "LABEL"
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
							children: "DISK1"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " /data/rustfs0"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " xfs"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " defaults,noatime"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 0"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " 2"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(Callout, {
			type: "info",
			title: "Tips",
			children: [
				(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
					"\n",
					(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "If using UUID:" }),
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
					children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "line",
							children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								style: {
									"--shiki-light": "#6F42C1",
									"--shiki-dark": "#B392F0"
								},
								children: "blkid"
							}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
								style: {
									"--shiki-light": "#032F62",
									"--shiki-dark": "#9ECBFF"
								},
								children: " /dev/sdb"
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
								children: "# Get the new partition's UUID, then replace the corresponding field in fstab"
							})
						})
					] })
				}) }),
				(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
					"\n",
					(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "After modifying fstab, be sure to validate syntax:" }),
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
								children: "mount"
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								style: {
									"--shiki-light": "#005CC5",
									"--shiki-dark": "#79B8FF"
								},
								children: " -a"
							}),
							(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								style: {
									"--shiki-light": "#6A737D",
									"--shiki-dark": "#6A737D"
								},
								children: " # If no errors, configuration is correct"
							})
						]
					}) })
				}) })
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "remount-new-disk",
			children: "Remount New Disk"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Execute the following commands to batch mount all disks and start the RustFS service:" }),
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
						children: "mount"
					}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: " -a"
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
							children: "systemctl"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " start"
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
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Confirm all disks are mounted normally:" }),
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
						children: "df"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: " -h"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: " |"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: " grep"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " /data/rustfs"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Callout, {
			type: "info",
			children: (0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If some mounts fail, please check if fstab entries are consistent with disk labels/UUIDs." })
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "trigger-and-monitor-data-healing",
			children: "Trigger and Monitor Data Healing"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Once RustFS detects a freshly formatted disk at a known mount point, its background scanner heals the missing data onto it automatically — no manual command is required. Confirm that recovery has started and track its progress through the service logs:" }),
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
						children: "# For systemd-managed installations"
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
							children: "journalctl"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -u"
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
							children: " -f"
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
						children: "# Or view the log files under the directory set by RUSTFS_OBS_LOG_DIRECTORY"
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
							children: "tail"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " -f"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " /var/logs/rustfs/rustfs.log"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "You can also open the RustFS Console and check the disk status of the affected node." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Callout, {
			type: "info",
			title: "Notes",
			children: (0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "The healing process will complete in the background, usually with minimal impact on online access;" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "After healing is complete, the tool will report success or list failed objects." }),
				"\n"
			] })
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "follow-up-checks-and-notes",
			children: "Follow-up Checks and Notes"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Performance Monitoring" }) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "I/O may fluctuate slightly during healing, recommend monitoring disk and network load." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
			start: "2",
			children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Batch Failures" }) }),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "If multiple failures occur in the same batch of disks, consider more frequent hardware inspections." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
			start: "3",
			children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Regular Drills" }) }),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Regularly simulate disk failure drills to ensure team familiarity with recovery processes." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, {
			start: "4",
			children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Maintenance Windows" }) }),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "When failure rates are high, arrange dedicated maintenance windows to speed up replacement and healing." }),
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
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
export { _markdown, MDXContent as default, frontmatter, structuredData, toc };
