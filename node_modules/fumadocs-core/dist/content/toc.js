import { remarkHeading } from "../mdx-plugins/remark-heading.js";
import { remark } from "remark";
//#region src/content/toc.ts
function getTableOfContents(content, remarkPlugins) {
	if (remarkPlugins) return remark().use(remarkPlugins).use(remarkHeading).process(content).then((result) => {
		if ("toc" in result.data) return result.data.toc;
		return [];
	});
	const result = remark().use(remarkHeading).processSync(content);
	if ("toc" in result.data) return result.data.toc;
	return [];
}
//#endregion
export { getTableOfContents };
