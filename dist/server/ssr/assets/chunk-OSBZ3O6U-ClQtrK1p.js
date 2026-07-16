import { C as createDefaultSharedCoreModule, S as createDefaultCoreModule, a as CynefinGrammarGeneratedModule, i as CommonValueConverter, o as EmptyFileSystem, t as AbstractMermaidTokenBuilder, u as MermaidGeneratedSharedModule, w as inject, x as __name } from "./chunk-KEIR6QF5-286GemXP.js";
//#region node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-OSBZ3O6U.mjs
var CynefinTokenBuilder = class extends AbstractMermaidTokenBuilder {
	static {
		__name(this, "CynefinTokenBuilder");
	}
	constructor() {
		super(["cynefin-beta"]);
	}
};
var CynefinModule = { parser: {
	TokenBuilder: /* @__PURE__ */ __name(() => new CynefinTokenBuilder(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ __name(() => new CommonValueConverter(), "ValueConverter")
} };
function createCynefinServices(context = EmptyFileSystem) {
	const shared = inject(createDefaultSharedCoreModule(context), MermaidGeneratedSharedModule);
	const Cynefin = inject(createDefaultCoreModule({ shared }), CynefinGrammarGeneratedModule, CynefinModule);
	shared.ServiceRegistry.register(Cynefin);
	return {
		shared,
		Cynefin
	};
}
__name(createCynefinServices, "createCynefinServices");
//#endregion
export { createCynefinServices as n, CynefinModule as t };
