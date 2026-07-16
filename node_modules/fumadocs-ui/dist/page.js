"use client";
import { cn } from "./utils/cn.js";
import { useIsDocsLayout } from "./layouts/docs/client.js";
import { Breadcrumb } from "./layouts/docs/page/slots/breadcrumb.js";
import { DocsBody, DocsDescription, DocsTitle, EditOnGitHub, PageLastUpdate, page_exports } from "./layouts/docs/page/index.js";
import { page_exports as page_exports$1 } from "./layouts/notebook/page/index.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/page.tsx
/**
* For separate MDX page
*/
function withArticle(props) {
	return /* @__PURE__ */ jsx("main", {
		...props,
		className: cn("w-full max-w-[1400px] mx-auto px-4 py-12", props.className),
		children: /* @__PURE__ */ jsx("article", {
			className: "prose",
			children: props.children
		})
	});
}
function DocsPage({ lastUpdate, editOnGithub, children, ...props }) {
	const { DocsPage, EditOnGitHub, PageLastUpdate } = useIsDocsLayout() ? page_exports : page_exports$1;
	return /* @__PURE__ */ jsxs(DocsPage, {
		...props,
		children: [children, /* @__PURE__ */ jsxs("div", {
			className: "flex flex-row flex-wrap items-center justify-between gap-4 empty:hidden",
			children: [editOnGithub && /* @__PURE__ */ jsx(EditOnGitHub, { href: `https://github.com/${editOnGithub.owner}/${editOnGithub.repo}/blob/${editOnGithub.sha}/${editOnGithub.path.startsWith("/") ? editOnGithub.path.slice(1) : editOnGithub.path}` }), lastUpdate && /* @__PURE__ */ jsx(PageLastUpdate, { date: new Date(lastUpdate) })]
		})]
	});
}
//#endregion
export { DocsBody, DocsDescription, DocsPage, DocsTitle, EditOnGitHub, Breadcrumb as PageBreadcrumb, PageLastUpdate, withArticle };
