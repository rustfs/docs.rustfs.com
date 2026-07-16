import { defaultShikiFactory, wasmShikiFactory } from "../highlight/shiki/full.js";
import { n as rehypeCodeDefaultOptions$1, r as transformerTab, t as createRehypeCode } from "../rehype-code.core-CzMM-w8f.js";
import { transformerIcon } from "./transformer-icon.js";
//#region src/mdx-plugins/rehype-code.ts
const rehypeCodeDefaultOptions = {
	engine: "js",
	...rehypeCodeDefaultOptions$1()
};
const rehypeCode = createRehypeCode(async (_options) => {
	const options = {
		...rehypeCodeDefaultOptions,
		..._options
	};
	const factory = options.engine === "oniguruma" ? wasmShikiFactory : defaultShikiFactory;
	let highlighter;
	if (options.langAlias) highlighter = await factory.init({ langAlias: options.langAlias });
	else highlighter = await factory.getOrInit();
	return {
		highlighter,
		options
	};
});
//#endregion
export { rehypeCode, rehypeCodeDefaultOptions, transformerIcon, transformerTab };
