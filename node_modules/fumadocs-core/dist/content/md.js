import { use, useMemo } from "react";
import * as JsxRuntime from "react/jsx-runtime";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import { VFile } from "vfile";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
//#region src/content/md.ts
function createMarkdownRenderer({ rehypePlugins = [], remarkPlugins = [], remarkRehypeOptions } = {}) {
	const processor = remark().use(remarkPlugins).use(remarkRehype, remarkRehypeOptions).use(rehypePlugins);
	const promises = {};
	function render(tree, file, props) {
		return toJsxRuntime(tree, {
			development: false,
			filePath: file.path,
			components: props.components,
			...JsxRuntime
		});
	}
	function parse(file) {
		return processor.parse(file);
	}
	return {
		Markdown(props) {
			const { async = false, children } = props;
			const file = new VFile(children);
			const id = `${file.path}:${file.value}`;
			if (async) {
				promises[id] ??= processor.run(parse(file), file);
				return render(use(promises[id]), file, props);
			}
			return render(useMemo(() => processor.runSync(parse(file), file), [id]), file, props);
		},
		async MarkdownServer(props) {
			const file = new VFile(props.children);
			return render(await processor.run(parse(file), file), file, props);
		}
	};
}
function Markdown(props) {
	return createMarkdownRenderer(props).MarkdownServer(props);
}
//#endregion
export { Markdown, createMarkdownRenderer };
