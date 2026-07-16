import { i as __toESM } from "./rolldown-runtime-B4lejLz5.js";
import { o as registerClientReference } from "./rsc-tIp9KJt5.js";
import { t as require_react_react_server } from "./react.react-server-D_zJcm3W.js";
import { a as getLastModifiedDate, c as mergeLayoutConfigs, f as renderToc, i as getGitHubFileUrl, l as renderBody, n as baseLayoutProps, o as getPressContext, r as createTransformChildren, u as renderPageMeta } from "./shared-BTqrmQgS.js";
import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
import { t as getLayoutTabs } from "./shared-CFt3wofn.js";
//#region node_modules/fumadocs-ui/dist/layouts/docs/client.js
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var LayoutBody = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"LayoutBody\"");
}), "c1a625c0fb46", "LayoutBody");
//#endregion
//#region node_modules/fumadocs-ui/dist/layouts/docs/index.js
var import_react_react_server = /* @__PURE__ */ __toESM(require_react_react_server(), 1);
function DocsLayout({ tree, sidebar: { tabs: _tabs, tabMode: _tabMode, ...sidebarProps } = {}, tabs: layoutTabs = _tabs, tabMode = _tabMode, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(LayoutBody, {
		tree,
		tabs: (0, import_react_react_server.useMemo)(() => {
			if (Array.isArray(layoutTabs)) return layoutTabs;
			if (typeof layoutTabs === "object") return getLayoutTabs(tree, layoutTabs);
			if (layoutTabs !== false) return getLayoutTabs(tree);
			return [];
		}, [tree, layoutTabs]),
		tabMode,
		sidebar: sidebarProps,
		...props,
		children
	});
}
//#endregion
//#region node_modules/fumadocs-ui/dist/layouts/docs/page/index.js
/**
* Add typography styles
*/
var DocsBody = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"DocsBody\"");
}), "40036365f8f4", "DocsBody");
var DocsDescription = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"DocsDescription\"");
}), "40036365f8f4", "DocsDescription");
var DocsPage = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"DocsPage\"");
}), "40036365f8f4", "DocsPage");
var DocsTitle = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"DocsTitle\"");
}), "40036365f8f4", "DocsTitle");
var MarkdownCopyButton = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"MarkdownCopyButton\"");
}), "40036365f8f4", "MarkdownCopyButton");
var PageLastUpdate = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"PageLastUpdate\"");
}), "40036365f8f4", "PageLastUpdate");
var ViewOptionsPopover = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"ViewOptionsPopover\"");
}), "40036365f8f4", "ViewOptionsPopover");
//#endregion
//#region node_modules/fumapress/dist/layouts/docs.js
function createDocsLayoutPage({ render, renderBody: renderDocsBody, inherit: { layoutProps: inheritLayoutProps = true } = {} } = {}) {
	const TDocsLayout = createTransformChildren(DocsLayout);
	const TDocsPage = createTransformChildren(DocsPage);
	return async function Layout({ lang, page }) {
		const ctx = getPressContext();
		const { getLoader, layouts, data: { "core:docs-layout": layoutData } } = ctx;
		const source = await getLoader();
		const inherited = inheritLayoutProps ? await layouts.defaultProps?.call(ctx, { lang }) : void 0;
		const _raw = await render?.call(ctx, page);
		const layoutProps = mergeLayoutConfigs(baseLayoutProps(ctx), inherited, _raw?.layoutProps);
		layoutProps.tree ??= source.getPageTree(lang);
		let result = {
			..._raw,
			lastModified: _raw?.lastModified ?? await getLastModifiedDate(ctx, page),
			pageProps: {
				..._raw?.pageProps,
				toc: _raw?.pageProps?.toc ?? await renderToc(ctx, page)
			},
			body: _raw?.body ?? await renderBody(ctx, page, "[Fumapress] Please specify the `render` option in createDocsLayoutPage()"),
			layoutProps
		};
		if (layoutData?.renderers) {
			const renderCtx = { page };
			for (const r of layoutData.renderers) result = await r.call(renderCtx, result);
		}
		let dynamicDocsBody = (props) => /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(DocsBody, { ...props });
		if (renderDocsBody) dynamicDocsBody = (props) => renderDocsBody.call(ctx, {
			lang,
			page,
			props,
			default: dynamicDocsBody
		});
		return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)(TDocsLayout, {
			props: result.layoutProps,
			children: [renderPageMeta(page, ctx), /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)(TDocsPage, {
				props: result.pageProps,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(DocsTitle, { children: page.data.title }),
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(DocsDescription, {
						className: "mb-0",
						children: page.data.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)("div", {
						className: "flex flex-row gap-2 items-center border-b pt-2 pb-6",
						children: [result.markdownUrl && /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(MarkdownCopyButton, { markdownUrl: result.markdownUrl }), /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(ViewOptionsPopover, {
							markdownUrl: result.markdownUrl,
							githubUrl: page.absolutePath ? getGitHubFileUrl(ctx, page.absolutePath) : void 0
						})]
					}),
					dynamicDocsBody({ children: result.body }),
					result.lastModified && /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(PageLastUpdate, { date: result.lastModified })
				]
			})]
		});
	};
}
//#endregion
export { createDocsLayoutPage };
