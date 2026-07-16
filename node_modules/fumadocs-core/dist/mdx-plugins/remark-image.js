import { visit } from "unist-util-visit";
import * as path$1 from "node:path";
import { fileURLToPath } from "node:url";
//#region src/mdx-plugins/remark-image.ts
const VALID_BLUR_EXT = [
	".jpeg",
	".png",
	".webp",
	".avif",
	".jpg"
];
const EXTERNAL_URL_REGEX = /^https?:\/\//;
/**
* Turn images into Next.js Image compatible usage.
*/
function remarkImage({ placeholder = "none", external = true, useImport = true, onError = "error", publicDir = path$1.join(process.cwd(), "public") } = {}) {
	return async (tree, file) => {
		const importsToInject = [];
		const promises = [];
		async function updateImage(src, node) {
			if (src.type === "file" && useImport) {
				const variableName = `__img${importsToInject.length}`;
				const hasBlur = placeholder === "blur" && VALID_BLUR_EXT.some((ext) => src.file.endsWith(ext));
				if (!file.dirname) throw new Error("When `useImport` is enabled, you must specify `dirname` in the VFile passed to compiler.");
				importsToInject.push({
					variableName,
					importPath: getImportPath(src.file, file.dirname)
				});
				const out = {
					children: [],
					type: "mdxJsxFlowElement",
					name: "img",
					attributes: [{
						type: "mdxJsxAttribute",
						name: "alt",
						value: node.alt ?? "image"
					}, {
						type: "mdxJsxAttribute",
						name: "src",
						value: {
							type: "mdxJsxAttributeValueExpression",
							value: variableName,
							data: { estree: {
								body: [{
									type: "ExpressionStatement",
									expression: {
										type: "Identifier",
										name: variableName
									}
								}],
								type: "Program",
								sourceType: "script"
							} }
						}
					}]
				};
				if (node.title) out.attributes.push({
					type: "mdxJsxAttribute",
					name: "title",
					value: node.title
				});
				if (hasBlur) out.attributes.push({
					type: "mdxJsxAttribute",
					name: "placeholder",
					value: "blur"
				});
				return out;
			}
			const size = await getImageSize(src, external).catch((e) => {
				throw new Error(`[Remark Image] Failed obtain image size for ${node.url} (public directory configured as ${publicDir})`, { cause: e });
			});
			if (!size) return;
			node.data ??= {};
			node.data.hProperties ??= {};
			node.data.hProperties.src = src.type === "url" ? src.url.href : node.url;
			node.data.hProperties.width = size.width.toString();
			node.data.hProperties.height = size.height.toString();
		}
		visit(tree, "image", (node, idx, parent) => {
			if (typeof idx !== "number" || !parent) return;
			const src = parseSrc(decodeURI(node.url), publicDir, file.dirname);
			if (!src) return;
			const task = updateImage(src, node).catch((e) => {
				if (onError === "ignore" || node.url.endsWith(".svg")) return;
				if (onError === "hide") {
					parent.children.splice(idx, 1);
					return;
				}
				if (onError === "error") throw e;
				onError(e);
			}).then((res) => {
				if (res) parent.children[idx] = res;
			});
			promises.push(task);
		});
		await Promise.all(promises);
		if (importsToInject.length === 0) return;
		const imports = importsToInject.map(({ variableName, importPath }) => ({
			type: "mdxjsEsm",
			data: { estree: { body: [{
				type: "ImportDeclaration",
				source: {
					type: "Literal",
					value: importPath
				},
				specifiers: [{
					type: "ImportDefaultSpecifier",
					local: {
						type: "Identifier",
						name: variableName
					}
				}]
			}] } }
		}));
		tree.children.unshift(...imports);
	};
}
function getImportPath(file, dir) {
	const relative = path$1.relative(dir, file).replaceAll(path$1.sep, "/");
	return relative.startsWith("../") ? relative : `./${relative}`;
}
/**
* @param src - src href
* @param publicDir - dir/url to resolve absolute paths
* @param dir - dir to resolve relative paths
*/
function parseSrc(src, publicDir, dir) {
	if (src.startsWith("file:///")) return {
		type: "file",
		file: fileURLToPath(src)
	};
	if (EXTERNAL_URL_REGEX.test(src)) return {
		type: "url",
		url: new URL(src)
	};
	if (src.startsWith("/")) {
		if (EXTERNAL_URL_REGEX.test(publicDir)) {
			const url = new URL(publicDir);
			url.pathname = `/${[...url.pathname.split("/"), ...src.split("/")].filter((v) => v.length > 0).join("/")}`;
			return {
				type: "url",
				url
			};
		}
		return {
			type: "file",
			file: path$1.join(publicDir, src)
		};
	}
	if (!dir) {
		console.warn(`[Remark Image] found relative path ${src} but missing 'dirname' in VFile, this image will be skipped for now.`);
		return;
	}
	return {
		type: "file",
		file: path$1.join(dir, src)
	};
}
async function getImageSize(src, onExternal) {
	if (src.type === "file") {
		const { imageSizeFromFile } = await import("../fromFile-DoNs4YiN.js");
		return imageSizeFromFile(src.file);
	}
	if (onExternal === false) return;
	const { timeout } = typeof onExternal === "object" ? onExternal : {};
	const res = await fetch(src.url, { signal: typeof timeout === "number" ? AbortSignal.timeout(timeout) : void 0 });
	if (!res.ok) throw new Error(`[Remark Image] Failed to fetch ${src.url} (${res.status}): ${await res.text()}`);
	const { imageSize } = await import("../dist-DrR2d46_.js");
	return imageSize(new Uint8Array(await res.arrayBuffer()));
}
//#endregion
export { remarkImage };
