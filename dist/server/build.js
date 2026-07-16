import { n as joinPath, r as setAllEnv, t as waku_server_default } from "./assets/waku.server-coGNr6v3.js";
//#region node_modules/waku/dist/lib/vite-entries/entry.build.js
async function resolveModuleId(moduleId, rootDir) {
	if (moduleId.startsWith("file://")) return moduleId;
	const { pathToFileURL } = await import(
		/* @vite-ignore */
		"node:url"
);
	if (moduleId.startsWith("/")) return pathToFileURL(joinPath(rootDir, moduleId.slice(1))).href;
	const { createRequire } = await import(
		/* @vite-ignore */
		"node:module"
);
	return pathToFileURL(createRequire(joinPath(rootDir, "DUMMY.js")).resolve(moduleId)).href;
}
async function INTERNAL_runBuild({ rootDir, emitFile }) {
	setAllEnv(process.env);
	const prunableFiles = /* @__PURE__ */ new Set();
	let build = waku_server_default.build;
	for (const enhancer of waku_server_default.buildEnhancers || []) build = await (await import(await resolveModuleId(enhancer, rootDir))).default(build);
	await build({
		emitFile,
		unstable_registerPrunableFile: (srcPath) => {
			prunableFiles.add(srcPath);
		}
	}, waku_server_default.buildOptions || {});
	return { prunableFiles: Array.from(prunableFiles) };
}
//#endregion
export { INTERNAL_runBuild };
