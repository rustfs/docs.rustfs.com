import path from "node:path";
import { glob } from "tinyglobby";
//#region src/utils/codegen.ts
/**
* Code generator (one instance per file)
*/
function createCodegen({ target = "default", outDir = "", jsExtension = false, globCache = /* @__PURE__ */ new Map() }) {
	let eagerImportId = 0;
	const banner = ["// @ts-nocheck"];
	if (target === "vite") banner.push("/// <reference types=\"vite/client\" />");
	return {
		options: {
			target,
			outDir
		},
		lines: [],
		addImport(statement) {
			this.lines.unshift(statement);
		},
		async pushAsync(insert) {
			for (const line of await Promise.all(insert)) {
				if (line === void 0) continue;
				this.lines.push(line);
			}
		},
		async generateGlobImport(patterns, options) {
			if (target === "vite") return this.generateViteGlobImport(patterns, options);
			return this.generateNodeGlobImport(patterns, options);
		},
		generateViteGlobImport(patterns, { base, ...rest }) {
			patterns = (typeof patterns === "string" ? [patterns] : patterns).map(normalizeViteGlobPath);
			return `import.meta.glob(${JSON.stringify(patterns)}, ${JSON.stringify({
				base: normalizeViteGlobPath(path.relative(outDir, base)),
				...rest
			}, null, 2)})`;
		},
		async generateNodeGlobImport(patterns, { base, eager = false, query = {}, import: importName }) {
			const cacheKey = JSON.stringify({
				patterns,
				base
			});
			let files = globCache.get(cacheKey);
			if (!files) {
				files = glob(patterns, { cwd: base });
				globCache.set(cacheKey, files);
			}
			let code = "{";
			for (const item of await files) {
				const fullPath = path.join(base, item);
				const searchParams = new URLSearchParams();
				for (const [k, v] of Object.entries(query)) if (v !== void 0) searchParams.set(k, v);
				const importPath = this.formatImportPath(fullPath) + "?" + searchParams.toString();
				if (eager) {
					const name = `__fd_glob_${eagerImportId++}`;
					this.lines.unshift(importName ? `import { ${importName} as ${name} } from ${JSON.stringify(importPath)}` : `import * as ${name} from ${JSON.stringify(importPath)}`);
					code += `${JSON.stringify(item)}: ${name}, `;
				} else {
					let line = `${JSON.stringify(item)}: () => import(${JSON.stringify(importPath)})`;
					if (importName) line += `.then(mod => mod.${importName})`;
					code += `${line}, `;
				}
			}
			code += "}";
			return code;
		},
		formatImportPath(file) {
			const ext = path.extname(file);
			let filename;
			if (ext === ".ts") {
				filename = file.substring(0, file.length - ext.length);
				if (jsExtension) filename += ".js";
			} else filename = file;
			const importPath = slash(path.relative(outDir, filename));
			return importPath.startsWith(".") ? importPath : `./${importPath}`;
		},
		toString() {
			return [...banner, ...this.lines].join("\n");
		}
	};
}
/**
* convert into POSIX & relative file paths, such that Vite can accept it.
*/
function normalizeViteGlobPath(file) {
	file = slash(file);
	if (file.startsWith("./")) return file;
	if (file.startsWith("/")) return `.${file}`;
	return `./${file}`;
}
function slash(path) {
	if (path.startsWith("\\\\?\\")) return path;
	return path.replaceAll("\\", "/");
}
function ident(code, tab = 1) {
	return code.split("\n").map((v) => "  ".repeat(tab) + v).join("\n");
}
//#endregion
export { ident as n, slash as r, createCodegen as t };
