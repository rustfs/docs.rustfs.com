import { C as createDefaultSharedCoreModule, S as createDefaultCoreModule, h as RailroadEbnfGrammarGeneratedModule, n as AbstractMermaidValueConverter, o as EmptyFileSystem, t as AbstractMermaidTokenBuilder, u as MermaidGeneratedSharedModule, w as inject, x as __name } from "./chunk-KEIR6QF5-286GemXP.js";
//#region node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-U6XO7XAA.mjs
var RailroadEbnfTokenBuilder = class extends AbstractMermaidTokenBuilder {
	static {
		__name(this, "RailroadEbnfTokenBuilder");
	}
	constructor() {
		super(["railroad-ebnf-beta"]);
	}
};
var decodeEscapedString = /* @__PURE__ */ __name((input) => {
	const content = input.slice(1, -1);
	let value = "";
	for (let index = 0; index < content.length; index++) {
		const character = content[index];
		if (character === "\\" && index + 1 < content.length) {
			index++;
			const escaped = content[index];
			switch (escaped) {
				case "n":
					value += "\n";
					break;
				case "r":
					value += "\r";
					break;
				case "t":
					value += "	";
					break;
				default: value += escaped;
			}
			continue;
		}
		value += character;
	}
	return value;
}, "decodeEscapedString");
var RailroadEbnfValueConverter = class extends AbstractMermaidValueConverter {
	static {
		__name(this, "RailroadEbnfValueConverter");
	}
	runConverter(rule, input, cstNode) {
		const value = super.runConverter(rule, input, cstNode);
		if (rule.name === "TITLE" && typeof value === "string") {
			const trimmedValue = value.trim();
			if (trimmedValue.startsWith("\"") && trimmedValue.endsWith("\"") || trimmedValue.startsWith("'") && trimmedValue.endsWith("'")) return decodeEscapedString(trimmedValue);
		}
		return value;
	}
	runCustomConverter(rule, input, _cstNode) {
		if (rule.name === "EBNF_STRING") return decodeEscapedString(input);
		if (rule.name === "EBNF_SPECIAL_SEQUENCE") return input.slice(1, -1).trim();
	}
};
var RailroadEbnfModule = { parser: {
	TokenBuilder: /* @__PURE__ */ __name(() => new RailroadEbnfTokenBuilder(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ __name(() => new RailroadEbnfValueConverter(), "ValueConverter")
} };
function createRailroadEbnfServices(context = EmptyFileSystem) {
	const shared = inject(createDefaultSharedCoreModule(context), MermaidGeneratedSharedModule);
	const RailroadEbnf = inject(createDefaultCoreModule({ shared }), RailroadEbnfGrammarGeneratedModule, RailroadEbnfModule);
	shared.ServiceRegistry.register(RailroadEbnf);
	return {
		shared,
		RailroadEbnf
	};
}
__name(createRailroadEbnfServices, "createRailroadEbnfServices");
//#endregion
export { createRailroadEbnfServices as n, RailroadEbnfModule as t };
