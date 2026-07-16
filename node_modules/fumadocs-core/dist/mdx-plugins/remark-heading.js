import { t as flattenNode } from "../utils-Yx0IL9eW.js";
import Slugger from "github-slugger";
import { visit } from "unist-util-visit";
//#region src/mdx-plugins/remark-heading.ts
const regex = /\s*\[#(?<slug>[^]+?)]\s*$/;
/**
* Add heading ids and extract TOC
*/
function remarkHeading({ slug, customId = true, generateToc = true } = {}) {
	let slugger;
	if (!slug) {
		slugger = new Slugger();
		slug = (_root, _heading, text) => slugger.slug(text);
	}
	return (root, file) => {
		const toc = [];
		slugger?.reset();
		visit(root, "heading", (heading) => {
			heading.data ||= {};
			heading.data.hProperties ||= {};
			const props = heading.data.hProperties;
			const lastNode = heading.children.at(-1);
			if (lastNode?.type === "text" && customId) {
				const match = regex.exec(lastNode.value);
				if (match?.[1]) {
					props.id = match[1];
					lastNode.value = lastNode.value.slice(0, match.index);
				}
			}
			let flattened = null;
			if (!props.id) {
				flattened ??= flattenNode(heading);
				props.id = slug(root, heading, flattened);
			}
			if (generateToc) toc.push({
				title: flattened ?? flattenNode(heading),
				url: `#${props.id}`,
				depth: heading.depth
			});
			return "skip";
		});
		if (generateToc) file.data.toc = toc;
	};
}
//#endregion
export { remarkHeading };
