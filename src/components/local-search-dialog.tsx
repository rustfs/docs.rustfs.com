"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import { useState } from "react";
import { localSearchClient } from "../lib/local-search.mjs";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogFooter,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";

const errorLabels = {
  en: { error: "Search could not load.", retry: "Try again" },
  zh: { error: "搜索加载失败。", retry: "重试" },
  de: { error: "Die Suche konnte nicht geladen werden.", retry: "Erneut versuchen" },
  fr: { error: "Impossible de charger la recherche.", retry: "Réessayer" },
  ja: { error: "検索を読み込めませんでした。", retry: "再試行" },
};

export default function LocalSearchDialog(props: SharedProps) {
  const { locale = "en" } = useI18n();
  const [attempt, setAttempt] = useState(0);
  const labels = errorLabels[locale as keyof typeof errorLabels] ?? errorLabels.en;
  const { search, setSearch, query } = useDocsSearch({
    client: localSearchClient({
      locale,
      baseUrl: import.meta.env.BASE_URL,
      attempt,
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
        <SearchDialogList items={!query.error && query.data !== "empty" ? query.data : null} />
        {query.error && (
          <SearchDialogFooter>
            <div role="alert" className="flex items-center gap-2 text-sm">
              {labels.error}
              <button
                type="button"
                className="underline disabled:opacity-50"
                disabled={query.isLoading}
                onClick={() => setAttempt((value) => value + 1)}
              >
                {labels.retry}
              </button>
            </div>
          </SearchDialogFooter>
        )}
      </SearchDialogContent>
    </SearchDialog>
  );
}
