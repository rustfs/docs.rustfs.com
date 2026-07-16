import { i as __toESM } from "./rolldown-runtime-B4lejLz5.js";
import { o as registerClientReference } from "./rsc-tIp9KJt5.js";
import { t as require_react_react_server } from "./react.react-server-D_zJcm3W.js";
import { d as renderRootMeta, o as getPressContext } from "./shared-BTqrmQgS.js";
import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
import assetsManifest from "../__vite_rsc_assets_manifest.js";
((React, deps, RemoveDuplicateServerCss, precedence) => {
	return function Resources() {
		return React.createElement(React.Fragment, null, [...deps.css.map((href) => React.createElement("link", {
			key: "css:" + href,
			rel: "stylesheet",
			...precedence ? { precedence } : {},
			href,
			"data-rsc-css-href": href
		})), RemoveDuplicateServerCss && React.createElement(RemoveDuplicateServerCss, { key: "remove-duplicate-css" })]);
	};
})((/* @__PURE__ */ __toESM(require_react_react_server())).default, assetsManifest.serverResources["node_modules/fumapress/dist/layouts/root.js"], void 0, "vite-rsc/importer-resources");
//#endregion
//#region node_modules/fumapress/dist/components/provider.js
var PressProvider = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"PressProvider\"");
}), "79245c25971e", "PressProvider");
//#endregion
//#region node_modules/fumadocs-ui/dist/.translations/keys.js
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var keys_default = [
	"Back to Home(404 not found page)",
	"Choose a language(language switcher)",
	"Choose a language(language switcher)(aria-label)",
	"Close Banner(banner)(aria-label)",
	"Close Search(search dialog)(aria-label)",
	"Collapse Sidebar(sidebar)(aria-label)",
	"Copied Text(code block)(aria-label)",
	"Copy Anchor Link(heading anchor)(aria-label)",
	"Copy Link(accordion)(aria-label)",
	"Copy Markdown(page actions)",
	"Copy Text(code block)(aria-label)",
	"Dark(theme switcher)(aria-label)",
	"Default(type table)",
	"Edit on GitHub(edit page)",
	"Last updated on(page footer)",
	"Light(theme switcher)(aria-label)",
	"Next Page(pagination)",
	"No Headings(table of contents)",
	"No results found(search dialog)",
	"On this page(table of contents)",
	"Open Search(search trigger)(aria-label)",
	"Open Sidebar(sidebar)(aria-label)",
	"Open in ChatGPT(page actions)",
	"Open in Claude(page actions)",
	"Open in Cursor(page actions)",
	"Open in GitHub(page actions)",
	"Open in Scira AI(page actions)",
	"Open(page actions)",
	"Page Not Found(404 not found page)",
	"Parameters(type table)",
	"Previous Page(pagination)",
	"Prop(type table)",
	"Read {url}, I want to ask questions about it.(page actions)",
	"Returns(type table)",
	"Search(search dialog)",
	"Search(search trigger)",
	"System(theme switcher)(aria-label)",
	"Table of Contents(inline table of contents)",
	"The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)",
	"Toggle Menu(home layout header)(aria-label)",
	"Toggle Theme(theme switcher)(aria-label)",
	"Type(type table)",
	"View as Markdown(page actions)",
	"displayName"
];
//#endregion
//#region node_modules/fumadocs-ui/dist/i18n.js
function uiTranslations() {
	return { keys: keys_default };
}
function i18nProvider(translations, lang) {
	const t = translations.extend(uiTranslations());
	if ("config" in t) {
		const { defaultLanguage, languages } = t.config;
		const locale = lang ?? defaultLanguage;
		return {
			locale: lang,
			translations: t.get(locale) ?? t.get(defaultLanguage),
			locales: languages.map((code) => ({
				locale: code,
				name: t.get(code).displayName ?? "English"
			}))
		};
	}
	return { translations: t.get() };
}
//#endregion
//#region node_modules/fumapress/dist/layouts/root.js
var styleTag = /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("link", {
	rel: "stylesheet",
	href: "/assets/app-C-ng-_Eq.css"
});
function createRootLayout(options) {
	return async function({ lang, children }) {
		const ctx = getPressContext();
		const hooks = ctx.data["core:provider"];
		let providerProps = {
			...options?.providerProps,
			children
		};
		if (ctx.translationsConfig && "config" in ctx.translationsConfig) providerProps.i18n ??= i18nProvider(ctx.translationsConfig.extend(uiTranslations()), lang);
		else if (ctx.translationsConfig) providerProps.i18n ??= i18nProvider(ctx.translationsConfig.extend(uiTranslations()));
		if (hooks) for (const hook of hooks) providerProps = await hook(providerProps);
		return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)("html", {
			lang: lang ?? "en",
			suppressHydrationWarning: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)("head", { children: [styleTag, renderRootMeta(ctx)] }), /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("body", {
				"data-version": "1.0",
				className: "flex flex-col min-h-screen",
				children: /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(PressProvider, { ...providerProps })
			})]
		});
	};
}
//#endregion
export { createRootLayout };
