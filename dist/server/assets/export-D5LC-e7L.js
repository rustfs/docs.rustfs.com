import { n as s, t as o } from "./renderer-C4vFFkqN.js";
import { createRequire } from "module";
//#region node_modules/@takumi-rs/core/dist/export.mjs
var require = createRequire(import.meta.url);
var { readFileSync } = require(
	/* turbopackOptional: true */
	"fs"
);
var nativeBinding = null;
var loadErrors = [];
var isMusl = () => {
	let musl = false;
	if (process.platform === "linux") {
		musl = isMuslFromFilesystem();
		if (musl === null) musl = isMuslFromReport();
		if (musl === null) musl = isMuslFromChildProcess();
	}
	return musl;
};
var isFileMusl = (f) => f.includes("libc.musl-") || f.includes("ld-musl-");
var isMuslFromFilesystem = () => {
	try {
		return readFileSync("/usr/bin/ldd", "utf-8").includes("musl");
	} catch {
		return null;
	}
};
var isMuslFromReport = () => {
	let report = null;
	if (process.report && typeof process.report.getReport === "function") {
		process.report.excludeNetwork = true;
		report = process.report.getReport();
	}
	if (!report) return null;
	if (report.header && report.header.glibcVersionRuntime) return false;
	if (Array.isArray(report.sharedObjects)) {
		if (report.sharedObjects.some(isFileMusl)) return true;
	}
	return false;
};
var isMuslFromChildProcess = () => {
	try {
		return require(
			/* turbopackOptional: true */
			"child_process"
		).execSync("ldd --version", { encoding: "utf8" }).includes("musl");
	} catch (e) {
		return false;
	}
};
function requireNative() {
	if (process.env.TAKUMI_CORE_TARGET) try {
		return require(
			/* turbopackOptional: true */
			process.env.TAKUMI_CORE_TARGET
		);
	} catch (err) {
		loadErrors.push(err);
	}
	else if (process.platform === "android") if (process.arch === "arm64") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.android-arm64.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-android-arm64/core.android-arm64.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-android-arm64/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "arm") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.android-arm-eabi.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-android-arm-eabi/core.android-arm-eabi.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-android-arm-eabi/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Android ${process.arch}`));
	else if (process.platform === "win32") if (process.arch === "x64") if (process.config && process.config.variables && process.config.variables.shlib_suffix === "dll.a" || process.config && process.config.variables && process.config.variables.node_target_type === "shared_library") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.win32-x64-gnu.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-win32-x64-gnu/core.win32-x64-gnu.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-win32-x64-gnu/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.win32-x64-msvc.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-win32-x64-msvc/core.win32-x64-msvc.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-win32-x64-msvc/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "ia32") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.win32-ia32-msvc.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-win32-ia32-msvc/core.win32-ia32-msvc.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-win32-ia32-msvc/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "arm64") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.win32-arm64-msvc.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-win32-arm64-msvc/core.win32-arm64-msvc.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-win32-arm64-msvc/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Windows: ${process.arch}`));
	else if (process.platform === "darwin") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.darwin-universal.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-darwin-universal/core.darwin-universal.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-darwin-universal/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
		if (process.arch === "x64") {
			try {
				return require(
					/* turbopackOptional: true */
					"../core.darwin-x64.node"
				);
			} catch (e) {
				loadErrors.push(e);
			}
			try {
				const binding = require(
					/* turbopackOptional: true */
					"@takumi-rs/core-darwin-x64/core.darwin-x64.node"
				);
				const bindingPackageVersion = require(
					/* turbopackOptional: true */
					"@takumi-rs/core-darwin-x64/package.json"
				).version;
				if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
				return binding;
			} catch (e) {
				loadErrors.push(e);
			}
		} else if (process.arch === "arm64") {
			try {
				return require(
					/* turbopackOptional: true */
					"../core.darwin-arm64.node"
				);
			} catch (e) {
				loadErrors.push(e);
			}
			try {
				const binding = require(
					/* turbopackOptional: true */
					"@takumi-rs/core-darwin-arm64/core.darwin-arm64.node"
				);
				const bindingPackageVersion = require(
					/* turbopackOptional: true */
					"@takumi-rs/core-darwin-arm64/package.json"
				).version;
				if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
				return binding;
			} catch (e) {
				loadErrors.push(e);
			}
		} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on macOS: ${process.arch}`));
	} else if (process.platform === "freebsd") if (process.arch === "x64") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.freebsd-x64.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-freebsd-x64/core.freebsd-x64.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-freebsd-x64/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "arm64") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.freebsd-arm64.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-freebsd-arm64/core.freebsd-arm64.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-freebsd-arm64/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on FreeBSD: ${process.arch}`));
	else if (process.platform === "linux") if (process.arch === "x64") if (isMusl()) {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-x64-musl.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-x64-musl/core.linux-x64-musl.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-x64-musl/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-x64-gnu.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-x64-gnu/core.linux-x64-gnu.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-x64-gnu/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "arm64") if (isMusl()) {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-arm64-musl.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-arm64-musl/core.linux-arm64-musl.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-arm64-musl/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-arm64-gnu.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-arm64-gnu/core.linux-arm64-gnu.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-arm64-gnu/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "arm") if (isMusl()) {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-arm-musleabihf.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-arm-musleabihf/core.linux-arm-musleabihf.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-arm-musleabihf/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-arm-gnueabihf.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-arm-gnueabihf/core.linux-arm-gnueabihf.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-arm-gnueabihf/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "loong64") if (isMusl()) {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-loong64-musl.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-loong64-musl/core.linux-loong64-musl.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-loong64-musl/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-loong64-gnu.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-loong64-gnu/core.linux-loong64-gnu.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-loong64-gnu/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "riscv64") if (isMusl()) {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-riscv64-musl.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-riscv64-musl/core.linux-riscv64-musl.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-riscv64-musl/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-riscv64-gnu.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-riscv64-gnu/core.linux-riscv64-gnu.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-riscv64-gnu/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "ppc64") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-ppc64-gnu.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-ppc64-gnu/core.linux-ppc64-gnu.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-ppc64-gnu/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "s390x") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.linux-s390x-gnu.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-s390x-gnu/core.linux-s390x-gnu.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-linux-s390x-gnu/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Linux: ${process.arch}`));
	else if (process.platform === "openharmony") if (process.arch === "arm64") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.openharmony-arm64.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-openharmony-arm64/core.openharmony-arm64.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-openharmony-arm64/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "x64") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.openharmony-x64.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-openharmony-x64/core.openharmony-x64.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-openharmony-x64/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "arm") {
		try {
			return require(
				/* turbopackOptional: true */
				"../core.openharmony-arm.node"
			);
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-openharmony-arm/core.openharmony-arm.node"
			);
			const bindingPackageVersion = require(
				/* turbopackOptional: true */
				"@takumi-rs/core-openharmony-arm/package.json"
			).version;
			if (bindingPackageVersion !== "2.1.1" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 2.1.1 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on OpenHarmony: ${process.arch}`));
	else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported OS: ${process.platform}, architecture: ${process.arch}`));
}
nativeBinding = requireNative();
var forceWasi = process.env.NAPI_RS_FORCE_WASI === "true" || process.env.NAPI_RS_FORCE_WASI === "error";
if (!nativeBinding || forceWasi) {
	let wasiBinding = null;
	let wasiBindingError = null;
	try {
		wasiBinding = require(
			/* turbopackOptional: true */
			"./core.wasi.cjs"
		);
		nativeBinding = wasiBinding;
	} catch (err) {
		if (forceWasi) wasiBindingError = err;
	}
	if (!nativeBinding || forceWasi) try {
		wasiBinding = require(
			/* turbopackOptional: true */
			"@takumi-rs/core-wasm32-wasi/core.wasm32-wasi.node"
		);
		nativeBinding = wasiBinding;
	} catch (err) {
		if (forceWasi) {
			if (!wasiBindingError) wasiBindingError = err;
			else wasiBindingError.cause = err;
			loadErrors.push(err);
		}
	}
	if (process.env.NAPI_RS_FORCE_WASI === "error" && !wasiBinding) {
		const error = /* @__PURE__ */ new Error("WASI binding not found and NAPI_RS_FORCE_WASI is set to error");
		error.cause = wasiBindingError;
		throw error;
	}
}
if (!nativeBinding) {
	if (loadErrors.length > 0) {
		const error = /* @__PURE__ */ new Error("Cannot find native binding. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.");
		error.cause = loadErrors.reduce((err, cur) => {
			cur.cause = err;
			return cur;
		});
		throw error;
	}
	throw new Error(`Failed to load native binding`);
}
var { Renderer: Renderer$1, AnimationOutputFormat, DitheringAlgorithm, ImageCacheMode, OutputFormat } = nativeBinding;
var Renderer = class {
	inner = new Renderer$1();
	fonts = new o((font) => this.inner.registerFont(font));
	async render(node, options) {
		const { options: opts, signal } = await s(this.fonts, options ?? {}, node);
		return this.inner.render(node, opts, signal);
	}
	async renderSvg(node, options) {
		const { options: opts, signal } = await s(this.fonts, options ?? {}, node);
		return this.inner.renderSvg(node, opts, signal);
	}
	async measure(node, options) {
		const { options: opts, signal } = await s(this.fonts, options ?? {}, node);
		return this.inner.measure(node, opts, signal);
	}
	async renderAnimation(options) {
		const nodes = options.scenes.map((scene) => scene.node);
		const { options: opts, signal } = await s(this.fonts, options, nodes);
		return this.inner.renderAnimation(opts, signal);
	}
	registerFont(font) {
		return this.fonts.register(font);
	}
};
//#endregion
export { Renderer };
