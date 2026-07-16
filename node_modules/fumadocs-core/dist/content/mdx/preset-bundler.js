import { t as resolvePlugins } from "../../util-DjBr9b3w.js";
//#region src/content/mdx/preset-bundler.ts
/**
* apply MDX processor presets
*/
async function mdxPreset(options = {}) {
	const { rehypeCodeOptions, remarkImageOptions, remarkHeadingOptions, remarkStructureOptions, remarkCodeTabOptions, remarkNpmOptions, _include, ...mdxOptions } = options;
	const remarkPlugins = await resolvePlugins((v) => [
		import("remark-gfm").then((mod) => mod.default),
		remarkHeadingOptions !== false && import("../../mdx-plugins/remark-heading.js").then((mod) => [mod.remarkHeading, {
			generateToc: false,
			...remarkHeadingOptions
		}]),
		_include ?? false,
		remarkImageOptions !== false && import("../../mdx-plugins/remark-image.js").then((mod) => [mod.remarkImage, {
			...remarkImageOptions,
			useImport: remarkImageOptions?.useImport ?? true
		}]),
		remarkCodeTabOptions !== false && import("../../mdx-plugins/remark-code-tab.js").then((mod) => [mod.remarkCodeTab, remarkCodeTabOptions]),
		remarkNpmOptions !== false && import("../../mdx-plugins/remark-npm.js").then((mod) => [mod.remarkNpm, remarkNpmOptions]),
		...v,
		remarkStructureOptions !== false && import("../../mdx-plugins/remark-structure.js").then((mod) => [mod.remarkStructure, {
			exportAs: "structuredData",
			...remarkStructureOptions
		}])
	], mdxOptions.remarkPlugins);
	const rehypePlugins = await resolvePlugins((v) => [
		rehypeCodeOptions !== false && import("../../mdx-plugins/rehype-code.js").then((mod) => [mod.rehypeCode, rehypeCodeOptions]),
		...v,
		import("../../mdx-plugins/rehype-toc.js").then((mod) => mod.rehypeToc)
	], mdxOptions.rehypePlugins);
	return {
		...mdxOptions,
		remarkPlugins,
		rehypePlugins
	};
}
//#endregion
export { mdxPreset };
