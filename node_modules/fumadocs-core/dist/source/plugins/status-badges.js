import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/source/plugins/status-badges.tsx
/**
* Plugin to add status badges to pages in the sidebar.
*
* This reads the `status` field from page frontmatter and adds it to the page tree item.
* Define the `renderBadge` option to render it.
*
* @example
* ```tsx
* import { loader } from 'fumadocs-core/source';
* import { statusBadgesPlugin } from 'fumadocs-core/source/status-badges';
*
* export const source = loader({
*   plugins: [
*     statusBadgesPlugin({
*       renderBadge: (status) => <span>{status}</span>,
*     }),
*   ],
*   // ...
* });
* ```
*
* Then in your frontmatter:
* ```yaml
* ---
* title: My Page
* status: new
* ---
* ```
*/
function statusBadgesPlugin(options = {}) {
	const { renderBadge = (status) => /* @__PURE__ */ jsx("span", {
		"data-status": status,
		children: status
	}) } = options;
	return {
		name: "fumadocs:status-badges",
		transformPageTree: { file(node, filePath) {
			if (!filePath) return node;
			const file = this.storage.read(filePath);
			if (file?.format === "page" && "status" in file.data && typeof file.data.status === "string") {
				const status = file.data.status;
				node.name = /* @__PURE__ */ jsxs(Fragment, { children: [node.name, renderBadge(status)] });
				node.status = status;
			}
			return node;
		} }
	};
}
//#endregion
export { statusBadgesPlugin };
