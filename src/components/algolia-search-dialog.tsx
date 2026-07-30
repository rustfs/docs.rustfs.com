"use client";

import { liteClient } from "algoliasearch/lite";
import { useDocsSearch } from "fumadocs-core/search/client";
import { algoliaClient } from "fumadocs-core/search/client/algolia";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";

const appId = "L2SE8QG99N";
const apiKey = "899b269f93d789660d143876eff8678a";
const indexName = "docs_rustfs_com_l2se8qg99n_articles";
const algolia = liteClient(appId, apiKey);

export default function RustFSAlgoliaSearchDialog(props: SharedProps) {
  const { locale = "en" } = useI18n();
  const { search, setSearch, query } = useDocsSearch({
    client: algoliaClient({
      client: algolia,
      indexName,
      locale,
      tag: locale,
    }),
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
        <SearchDialogFooter>
          <a
            href="https://www.algolia.com"
            rel="noreferrer noopener"
            className="ms-auto text-xs text-fd-muted-foreground"
          >
            Search powered by Algolia
          </a>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
