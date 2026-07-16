import { n as __name } from "./chunk-Y2CYZVJY-CrOJDJJy.js";
import { m as log } from "./src-DHnEm-5D.js";
import { c as configureSvgSize } from "./chunk-WYO6CB5R-DD19QnnH.js";
import { t as selectSvgElement } from "./chunk-VAUOI2AC-B_OZqD2U.js";
import { n as parse } from "./mermaid-parser.core-DLbnIe5e.js";
//#region node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-FWYZ7A6U.mjs
var parser = { parse: /* @__PURE__ */ __name(async (input) => {
	const ast = await parse("info", input);
	log.debug(ast);
}, "parse") };
var DEFAULT_INFO_DB = { version: "11.16.0" };
var diagram = {
	parser,
	db: { getVersion: /* @__PURE__ */ __name(() => DEFAULT_INFO_DB.version, "getVersion") },
	renderer: { draw: /* @__PURE__ */ __name((text, id, version) => {
		log.debug("rendering info diagram\n" + text);
		const svg = selectSvgElement(id);
		configureSvgSize(svg, 100, 400, true);
		svg.append("g").append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
	}, "draw") }
};
//#endregion
export { diagram };
