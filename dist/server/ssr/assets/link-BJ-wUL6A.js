import { i as __toESM } from "./rolldown-runtime-B4lejLz5.js";
import { n as require_jsx_runtime } from "./react-BKYDRtZ1.js";
import { o as Link$1 } from "./dist-BzvQR7Um.js";
//#region node_modules/fumadocs-core/dist/link.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function Link({ ref, href = "#", external = !!(href.match(/^\w+:/) || href.startsWith("//")), prefetch, children, ...props }) {
	if (external) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		ref,
		href,
		rel: "noreferrer noopener",
		target: "_blank",
		...props,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
		ref,
		href,
		prefetch,
		...props,
		children
	});
}
//#endregion
export { Link as t };
