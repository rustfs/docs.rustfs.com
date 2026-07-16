//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/adjust-svg-ids.js
const adjustSvgIDs = (svgEl) => {
	const newIdSuffix = "-zoom";
	const attrs = [
		"clip-path",
		"fill",
		"mask",
		"marker-start",
		"marker-mid",
		"marker-end"
	];
	const idMap = /* @__PURE__ */ new Map();
	if (svgEl.hasAttribute("id")) {
		const { id: oldId } = svgEl;
		const newId = oldId + newIdSuffix;
		idMap.set(oldId, newId);
		const svgNode = svgEl;
		svgNode.id = newId;
	}
	svgEl.querySelectorAll("[id]").forEach((el) => {
		const { id: oldId } = el;
		const newId = oldId + newIdSuffix;
		idMap.set(oldId, newId);
		const node = el;
		node.id = newId;
	});
	const urlAttrSelector = attrs.map((attr) => `[${attr}]`).join(", ");
	svgEl.querySelectorAll(urlAttrSelector).forEach((el) => {
		for (const attr of attrs) {
			const val = el.getAttribute(attr);
			if (val?.startsWith("url(#") === true) {
				const oldId = val.slice(5, -1);
				const newId = idMap.get(oldId);
				if (newId !== void 0) el.setAttribute(attr, `url(#${newId})`);
			}
		}
	});
	svgEl.querySelectorAll("style").forEach((styleEl) => {
		const { textContent } = styleEl;
		if (textContent !== "") {
			let updated = textContent;
			idMap.forEach((newId, oldId) => {
				updated = updated.replaceAll(`#${oldId}`, `#${newId}`);
			});
			if (updated !== textContent) {
				const styleNode = styleEl;
				styleNode.textContent = updated;
			}
		}
	});
};
//#endregion
export { adjustSvgIDs };
