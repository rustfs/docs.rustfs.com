import { x as __name } from "./chunk-KEIR6QF5-286GemXP.js";
import "./chunk-MOZMSUNE-ZM7MO0Ka.js";
import "./chunk-OSBZ3O6U-ClQtrK1p.js";
import "./chunk-5JV3BV7I-DywBEuqF.js";
import "./chunk-CYSBUYHQ-oq6kJQJK.js";
import "./chunk-BIQX33UG-BsyCEGpD.js";
import "./chunk-EMLP6XTP-7B0b1d4y.js";
import "./chunk-YOTPTUD7-Co-roqSA.js";
import "./chunk-QBLGF6JB-hVx64JMc.js";
import "./chunk-5TONJI2A-B9ePlVv9.js";
import "./chunk-5HE753X5-BFwD_C6Q.js";
import "./chunk-U6XO7XAA-Bhh4-QF5.js";
import "./chunk-JG7HCLWE-IbpF6kls.js";
import "./chunk-CQNSW5MT-B5NFMEsU.js";
import "./chunk-R7FJI6CG-utw4MkpO.js";
import "./chunk-5FCAYU7R-Bl3jZfnR.js";
//#region node_modules/@mermaid-js/parser/dist/mermaid-parser.core.mjs
var parsers = {};
var initializers = {
	info: /* @__PURE__ */ __name(async () => {
		const { createInfoServices: createInfoServices2 } = await import("./info-DKCQHKI2-CZaE0uwi.js");
		parsers.info = createInfoServices2().Info.parser.LangiumParser;
	}, "info"),
	packet: /* @__PURE__ */ __name(async () => {
		const { createPacketServices: createPacketServices2 } = await import("./packet-7NZHBO7P-Dgy36yMZ.js");
		parsers.packet = createPacketServices2().Packet.parser.LangiumParser;
	}, "packet"),
	pie: /* @__PURE__ */ __name(async () => {
		const { createPieServices: createPieServices2 } = await import("./pie-RZYD4A2V-nwde6cw6.js");
		parsers.pie = createPieServices2().Pie.parser.LangiumParser;
	}, "pie"),
	treeView: /* @__PURE__ */ __name(async () => {
		const { createTreeViewServices: createTreeViewServices2 } = await import("./treeView-QDETBFTQ-BoqBwTFr.js");
		parsers.treeView = createTreeViewServices2().TreeView.parser.LangiumParser;
	}, "treeView"),
	architecture: /* @__PURE__ */ __name(async () => {
		const { createArchitectureServices: createArchitectureServices2 } = await import("./architecture-TIHT7OUA-CrsCLd-7.js");
		parsers.architecture = createArchitectureServices2().Architecture.parser.LangiumParser;
	}, "architecture"),
	gitGraph: /* @__PURE__ */ __name(async () => {
		const { createGitGraphServices: createGitGraphServices2 } = await import("./gitGraph-TEB2WS4Q-yv3uvLtu.js");
		parsers.gitGraph = createGitGraphServices2().GitGraph.parser.LangiumParser;
	}, "gitGraph"),
	eventmodeling: /* @__PURE__ */ __name(async () => {
		const { createEventModelingServices: createEventModelingServices2 } = await import("./eventmodeling-45OFAUF4-oz102gsb.js");
		parsers.eventmodeling = createEventModelingServices2().EventModel.parser.LangiumParser;
	}, "eventmodeling"),
	radar: /* @__PURE__ */ __name(async () => {
		const { createRadarServices: createRadarServices2 } = await import("./radar-I7S5WNFK-Cl-KRk2O.js");
		parsers.radar = createRadarServices2().Radar.parser.LangiumParser;
	}, "radar"),
	railroad: /* @__PURE__ */ __name(async () => {
		const { createRailroadServices: createRailroadServices2 } = await import("./railroad-3IZDKUUU-D062DK_1.js");
		parsers.railroad = createRailroadServices2().Railroad.parser.LangiumParser;
	}, "railroad"),
	railroadEbnf: /* @__PURE__ */ __name(async () => {
		const { createRailroadEbnfServices: createRailroadEbnfServices2 } = await import("./railroad-ebnf-EBAXGLYW-BtMmJel8.js");
		parsers.railroadEbnf = createRailroadEbnfServices2().RailroadEbnf.parser.LangiumParser;
	}, "railroadEbnf"),
	railroadAbnf: /* @__PURE__ */ __name(async () => {
		const { createRailroadAbnfServices: createRailroadAbnfServices2 } = await import("./railroad-abnf-AHOZXSZD-B3VSE4-l.js");
		parsers.railroadAbnf = createRailroadAbnfServices2().RailroadAbnf.parser.LangiumParser;
	}, "railroadAbnf"),
	railroadPeg: /* @__PURE__ */ __name(async () => {
		const { createRailroadPegServices: createRailroadPegServices2 } = await import("./railroad-peg-LSFZ7HO6-BtPpplLM.js");
		parsers.railroadPeg = createRailroadPegServices2().RailroadPeg.parser.LangiumParser;
	}, "railroadPeg"),
	treemap: /* @__PURE__ */ __name(async () => {
		const { createTreemapServices: createTreemapServices2 } = await import("./treemap-6X3UGDF4-BOKSpqXa.js");
		parsers.treemap = createTreemapServices2().Treemap.parser.LangiumParser;
	}, "treemap"),
	wardley: /* @__PURE__ */ __name(async () => {
		const { createWardleyServices: createWardleyServices2 } = await import("./wardley-OPB4EBWU-CHIdfdn_.js");
		parsers.wardley = createWardleyServices2().Wardley.parser.LangiumParser;
	}, "wardley"),
	cynefin: /* @__PURE__ */ __name(async () => {
		const { createCynefinServices: createCynefinServices2 } = await import("./cynefin-VYW2F7L2-eHiYqAPj.js");
		parsers.cynefin = createCynefinServices2().Cynefin.parser.LangiumParser;
	}, "cynefin")
};
async function parse(diagramType, text) {
	const initializer = initializers[diagramType];
	if (!initializer) throw new Error(`Unknown diagram type: ${diagramType}`);
	if (!parsers[diagramType]) await initializer();
	const result = parsers[diagramType].parse(text);
	if (result.lexerErrors.length > 0 || result.parserErrors.length > 0) throw new MermaidParseError(result);
	return result.value;
}
__name(parse, "parse");
var MermaidParseError = class extends Error {
	constructor(result) {
		const lexerErrors = result.lexerErrors.map((err) => {
			return `Lexer error on line ${err.line !== void 0 && !isNaN(err.line) ? err.line : "?"}, column ${err.column !== void 0 && !isNaN(err.column) ? err.column : "?"}: ${err.message}`;
		}).join("\n");
		const parserErrors = result.parserErrors.map((err) => {
			return `Parse error on line ${err.token.startLine !== void 0 && !isNaN(err.token.startLine) ? err.token.startLine : "?"}, column ${err.token.startColumn !== void 0 && !isNaN(err.token.startColumn) ? err.token.startColumn : "?"}: ${err.message}`;
		}).join("\n");
		super(`Parsing failed: ${lexerErrors} ${parserErrors}`);
		this.result = result;
	}
	static {
		__name(this, "MermaidParseError");
	}
};
//#endregion
export { parse as n, MermaidParseError as t };
