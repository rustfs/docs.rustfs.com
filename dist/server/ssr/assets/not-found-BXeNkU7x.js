import { i as __toESM } from "./rolldown-runtime-B4lejLz5.js";
import { n as require_jsx_runtime } from "./react-BKYDRtZ1.js";
import { a as cn, r as buttonVariants, t as createLucideIcon } from "./createLucideIcon-XapafaKb.js";
import { r as useTranslations } from "./dist-BzvQR7Um.js";
import { t as Link } from "./link-BJ-wUL6A.js";
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var House = createLucideIcon("house", [["path", {
	d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
	key: "5wwlr5"
}], ["path", {
	d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
	key: "r6nss1"
}]]);
//#endregion
//#region node_modules/fumadocs-ui/dist/layouts/home/not-found.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
/**
* the default not found page content, please make your own if you want to customize it.
*/
function DefaultNotFound() {
	const t = useTranslations({ note: "404 not found page" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col px-8 justify-center flex-1 text-center items-center gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-6xl font-bold text-fd-muted-foreground",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-semibold",
				children: t("Page Not Found")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-fd-muted-foreground max-w-md",
				children: t("The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				href: "/",
				className: cn(buttonVariants({
					className: "mt-4 gap-1.5",
					variant: "primary"
				})),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-4" }), t("Back to Home")]
			})
		]
	});
}
//#endregion
//#region \0virtual:vite-rsc/client-references/group/facade:node_modules/fumadocs-ui/dist/layouts/home/not-found.js
var export_1015cf8d22ee = { DefaultNotFound };
//#endregion
export { export_1015cf8d22ee };
