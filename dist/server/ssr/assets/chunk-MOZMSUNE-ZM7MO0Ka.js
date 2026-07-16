import { C as createDefaultSharedCoreModule, S as createDefaultCoreModule, n as AbstractMermaidValueConverter, o as EmptyFileSystem, r as ArchitectureGrammarGeneratedModule, t as AbstractMermaidTokenBuilder, u as MermaidGeneratedSharedModule, w as inject, x as __name } from "./chunk-KEIR6QF5-286GemXP.js";
//#region node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-MOZMSUNE.mjs
var ArchitectureTokenBuilder = class extends AbstractMermaidTokenBuilder {
	static {
		__name(this, "ArchitectureTokenBuilder");
	}
	constructor() {
		super(["architecture"]);
	}
};
var ArchitectureValueConverter = class extends AbstractMermaidValueConverter {
	static {
		__name(this, "ArchitectureValueConverter");
	}
	runCustomConverter(rule, input, _cstNode) {
		if (rule.name === "ARCH_ICON") return input.replace(/[()]/g, "").trim();
		else if (rule.name === "ARCH_TEXT_ICON") return input.replace(/["()]/g, "");
		else if (rule.name === "ARCH_TITLE") {
			let result = input.replace(/^\[|]$/g, "").trim();
			if (result.startsWith("\"") && result.endsWith("\"") || result.startsWith("'") && result.endsWith("'")) {
				result = result.slice(1, -1);
				result = result.replace(/\\"/g, "\"").replace(/\\'/g, "'");
			}
			return result.trim();
		}
	}
};
var ArchitectureModule = { parser: {
	TokenBuilder: /* @__PURE__ */ __name(() => new ArchitectureTokenBuilder(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ __name(() => new ArchitectureValueConverter(), "ValueConverter")
} };
function createArchitectureServices(context = EmptyFileSystem) {
	const shared = inject(createDefaultSharedCoreModule(context), MermaidGeneratedSharedModule);
	const Architecture = inject(createDefaultCoreModule({ shared }), ArchitectureGrammarGeneratedModule, ArchitectureModule);
	shared.ServiceRegistry.register(Architecture);
	return {
		shared,
		Architecture
	};
}
__name(createArchitectureServices, "createArchitectureServices");
//#endregion
export { createArchitectureServices as n, ArchitectureModule as t };
