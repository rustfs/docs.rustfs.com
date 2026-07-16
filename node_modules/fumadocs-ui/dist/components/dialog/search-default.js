"use client";
import { useI18n } from "../../contexts/i18n.js";
import { SearchDialog, SearchDialogClose, SearchDialogContent, SearchDialogFooter, SearchDialogHeader, SearchDialogIcon, SearchDialogInput, SearchDialogList, SearchDialogOverlay, TagsList, TagsListItem } from "./search.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { use, useMemo, useState } from "react";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { useDocsSearch } from "fumadocs-core/search/client";
import { fetchClient } from "fumadocs-core/search/client/fetch";
//#region src/components/dialog/search-default.tsx
let STATIC;
function DefaultSearchDialog({ type, defaultTag, tags = [], api, delayMs, allowClear = false, links = [], footer, ...props }) {
	const { locale } = useI18n();
	const [tag, setTag] = useState(defaultTag);
	let client;
	if (type === "static") client = use(STATIC ??= import("fumadocs-core/search/client/orama-static")).oramaStaticClient({
		from: api,
		locale,
		tag
	});
	else client = fetchClient({
		api,
		locale,
		tag
	});
	const { search, setSearch, query } = useDocsSearch({
		client,
		delayMs
	});
	const defaultItems = useMemo(() => {
		if (links.length === 0) return null;
		return links.map(([name, link]) => ({
			type: "page",
			id: name,
			content: name,
			url: link
		}));
	}, [links]);
	useOnChange(defaultTag, (v) => {
		setTag(v);
	});
	return /* @__PURE__ */ jsxs(SearchDialog, {
		search,
		onSearchChange: setSearch,
		isLoading: query.isLoading,
		...props,
		children: [
			/* @__PURE__ */ jsx(SearchDialogOverlay, {}),
			/* @__PURE__ */ jsxs(SearchDialogContent, { children: [/* @__PURE__ */ jsxs(SearchDialogHeader, { children: [
				/* @__PURE__ */ jsx(SearchDialogIcon, {}),
				/* @__PURE__ */ jsx(SearchDialogInput, {}),
				/* @__PURE__ */ jsx(SearchDialogClose, {})
			] }), /* @__PURE__ */ jsx(SearchDialogList, { items: query.data !== "empty" ? query.data : defaultItems })] }),
			/* @__PURE__ */ jsxs(SearchDialogFooter, { children: [tags.length > 0 && /* @__PURE__ */ jsx(TagsList, {
				tag,
				onTagChange: setTag,
				allowClear,
				children: tags.map((tag) => /* @__PURE__ */ jsx(TagsListItem, {
					value: tag.value,
					children: tag.name
				}, tag.value))
			}), footer] })
		]
	});
}
//#endregion
export { DefaultSearchDialog as default };
