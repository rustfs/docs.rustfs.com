#!/usr/bin/env node
import { existsSync } from "node:fs";
//#region src/bin.ts
async function start() {
	const [configPath, outDir] = process.argv.slice(2);
	if (existsSync("next.config.js") || existsSync("next.config.mjs") || existsSync("next.config.mts") || existsSync("next.config.ts")) {
		const { postInstall } = await import("./next/index.js");
		await postInstall({
			configPath,
			outDir
		});
	} else {
		const { postInstall } = await import("./vite/index.js");
		await postInstall({
			configPath,
			outDir
		});
	}
}
start();
//#endregion
