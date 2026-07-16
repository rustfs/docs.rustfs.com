//#region src/mdx-plugins/remark-llms.runtime.ts
const regex = /\0(.+?)\0/gs;
async function renderPlaceholder(text, renderers) {
	let out = "";
	let idx = 0;
	for (const match of text.matchAll(regex)) {
		out += text.slice(idx, match.index);
		const inner = match[1];
		try {
			const data = JSON.parse(inner);
			const renderer = data.name && renderers[data.name];
			if (data.children.trim()) data.children = await renderPlaceholder(data.children, renderers);
			if (renderer) out += await renderer(data);
			else out += data.children;
		} catch {
			out += match[0];
		}
		idx = match.index + match[0].length;
	}
	out += text.slice(idx);
	return out;
}
//#endregion
export { renderPlaceholder };
