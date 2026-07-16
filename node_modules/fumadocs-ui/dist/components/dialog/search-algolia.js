"use client";
import { useI18n } from "../../contexts/i18n.js";
import { SearchDialog, SearchDialogClose, SearchDialogContent, SearchDialogFooter, SearchDialogHeader, SearchDialogIcon, SearchDialogInput, SearchDialogList, SearchDialogOverlay, TagsList, TagsListItem } from "./search.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { useDocsSearch } from "fumadocs-core/search/client";
import { algoliaClient } from "fumadocs-core/search/client/algolia";
//#region src/components/dialog/search-algolia.tsx
function AlgoliaSearchDialog({ searchOptions, tags = [], defaultTag, showAlgolia = false, allowClear = false, links = [], footer, ...props }) {
	const [tag, setTag] = useState(defaultTag);
	const { locale } = useI18n();
	const { search, setSearch, query } = useDocsSearch({ client: algoliaClient({
		tag,
		locale,
		...searchOptions
	}) });
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
	const label = showAlgolia && /* @__PURE__ */ jsx(AlgoliaTitle, {});
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
			/* @__PURE__ */ jsxs(SearchDialogFooter, { children: [tags.length > 0 ? /* @__PURE__ */ jsxs(TagsList, {
				tag,
				onTagChange: setTag,
				allowClear,
				children: [tags.map((tag) => /* @__PURE__ */ jsx(TagsListItem, {
					value: tag.value,
					children: tag.name
				}, tag.value)), label]
			}) : label, footer] })
		]
	});
}
function AlgoliaTitle() {
	return /* @__PURE__ */ jsx("a", {
		href: "https://algolia.com",
		rel: "noreferrer noopener",
		className: "ms-auto text-xs text-fd-muted-foreground",
		children: "Search powered by Algolia"
	});
}
//#endregion
export { AlgoliaSearchDialog as default };
