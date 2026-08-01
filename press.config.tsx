import { defineConfig } from "fumapress";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { sitemapPlugin } from "fumapress/plugins/sitemap";
import { takumiPlugin } from "fumapress/plugins/takumi";
import { createNotebookLayoutPage } from "fumapress/layouts/notebook";
import { createRootLayout } from "fumapress/layouts/root";
import { zhCN } from "@fumapress/language/zh-cn";
import { defineI18n } from "fumadocs-core/i18n";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import { docs } from "./.source/server";
import AlgoliaSearchDialog from "./src/components/algolia-search-dialog";
import { BrandLogo } from "./src/components/brand-logo";
import { Mermaid } from "./src/components/mermaid";
import { Tab, Tabs } from "./src/components/tabs";
import { ArrowRight } from "lucide-react";
import { algoliaIndexPlugin } from "./src/plugins/algolia-index";

const isDev = import.meta.env.DEV;

const siteDescription =
  "RustFS is an S3-compatible distributed object storage engine written in Rust.";

type Language = "en" | "zh" | "de" | "fr" | "ja";
const languages: Language[] = ["en", "zh", "de", "fr", "ja"];

function isLanguage(value: string | undefined): value is Language {
  return languages.includes(value as Language);
}

const i18n = defineI18n({
  languages,
  defaultLanguage: "en",
  parser: "dir",
  hideLocale: "never",
  fallbackLanguage: "en",
});

const translations = i18n
  .translations()
  .preset("zh", zhCN())
  .add({
    en: { displayName: "English" },
    zh: { displayName: "简体中文" },
    de: {
      displayName: "Deutsch",
      "Blog(blog)": "Blog",
      "All Tags(blog tags page)": "Alle Tags",
    },
    fr: {
      displayName: "Français",
      "Blog(blog)": "Blog",
      "All Tags(blog tags page)": "Tous les tags",
    },
    ja: {
      displayName: "日本語",
      "Blog(blog)": "ブログ",
      "All Tags(blog tags page)": "すべてのタグ",
    },
  });

// Social icons (inline SVG so the bundle stays self-contained).
const TwitterIcon = (
  <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const layoutLabels = {
  en: {
    home: "Home",
    docs: "Docs",
    installation: "Installation",
    demo: "Demo",
    community: "Community",
    blog: "Blog",
    license: "Released under the Apache License 2.0.",
    copyright: "Copyright © 2025 RustFS",
  },
  zh: {
    home: "首页",
    docs: "文档",
    installation: "安装",
    demo: "演示",
    community: "社区",
    blog: "博客",
    license: "根据 Apache License 2.0 发布。",
    copyright: "版权所有 © 2025 RustFS",
  },
  de: {
    home: "Startseite",
    docs: "Dokumentation",
    installation: "Installation",
    demo: "Demo",
    community: "Community",
    blog: "Blog",
    license: "Veröffentlicht unter der Apache License 2.0.",
    copyright: "Copyright © 2025 RustFS",
  },
  fr: {
    home: "Accueil",
    docs: "Documentation",
    installation: "Installation",
    demo: "Démo",
    community: "Communauté",
    blog: "Blog",
    license: "Publié sous la licence Apache 2.0.",
    copyright: "Copyright © 2025 RustFS",
  },
  ja: {
    home: "ホーム",
    docs: "ドキュメント",
    installation: "インストール",
    demo: "デモ",
    community: "コミュニティ",
    blog: "ブログ",
    license: "Apache License 2.0 の下で公開されています。",
    copyright: "Copyright © 2025 RustFS",
  },
} as const;

function createSidebarFooter(locale: keyof typeof layoutLabels) {
  const labels = layoutLabels[locale];

  return (
    <div className="flex flex-col gap-0.5 px-2 py-3 text-xs text-fd-muted-foreground">
      <p>{labels.license}</p>
      <p>{labels.copyright}</p>
    </div>
  );
}

export default defineConfig({
  content: docs.toFumadocsSource(),
  translations,
  loaderOptions: {
    plugins: [lucideIconsPlugin()],
  },
  site: {
    name: "RustFS Documentation",
    baseUrl: isDev ? "http://localhost:3000" : "https://docs.rustfs.com",
    git: {
      user: "rustfs",
      repo: "docs.rustfs.com",
      branch: "main",
    },
  },
  mode: "static",
  meta: {
    root() {
      return (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
            rel="stylesheet"
          />

          {/* Favicons & PWA manifest */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <script src="/language-redirect.js" />

          {/* SEO / crawler hints */}
          <meta name="author" content="RustFS" />
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta name="bingbot" content="index, follow" />
          <meta name="yandexbot" content="index, follow" />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@rustfs" />
          <meta name="twitter:creator" content="@rustfs" />

          {/* Analytics — only loaded in production builds. */}
          {!isDev && (
            <>
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-TWW7WMTWL9"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-TWW7WMTWL9');`,
                }}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?968e7103a8e28fb30f7d69e42b7c82bc";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();`,
                }}
              />
            </>
          )}
        </>
      );
    },
    // Per-page <meta name="description"> (VitePress emitted this from frontmatter).
    page(page) {
      const pathname = page.slugs.join("/");
      const locale: Language = isLanguage(page.locale) ? page.locale : "en";
      const localizedUrl = (language: Language) =>
        `https://docs.rustfs.com/${language}${pathname ? `/${pathname}` : ""}`;

      return (
        <>
          <meta
            name="description"
            content={page.data.description ?? siteDescription}
          />
          <link rel="canonical" href={localizedUrl(locale)} />
          <link rel="alternate" hrefLang="x-default" href={localizedUrl("en")} />
          {languages.map((language) => (
            <link
              key={language}
              rel="alternate"
              hrefLang={language}
              href={localizedUrl(language)}
            />
          ))}
        </>
      );
    },
  },
})
  .plugins(algoliaIndexPlugin(), llmsPlugin(), takumiPlugin(), sitemapPlugin())
  .layouts({
    root: createRootLayout({
      providerProps: {
        search: { SearchDialog: AlgoliaSearchDialog },
      },
    }),
    // Use the Notebook layout: a full-width top navbar (main links + search +
    // GitHub + theme) with the page tree in the sidebar — like the FumaPress docs.
    page: createNotebookLayoutPage(),
    // Shared navbar / links across all Fumadocs layouts.
    defaultProps({ lang }) {
      const locale: Language = isLanguage(lang) ? lang : "en";
      const docsUrl = `/${locale}`;
      const labels = layoutLabels[locale];

      // Built as a const (not an inline literal) so the extra `sidebar` field —
      // which lives on DocsLayoutProps, not BaseLayoutProps — is accepted and
      // deep-merged into the docs layout at runtime.
      const props = {
        nav: {
          title: (
            <img
              src="/images/logo.svg"
              alt="RustFS"
              width={96}
              height={24}
              style={{ height: 24, width: "auto" }}
            />
          ),
          url: "https://rustfs.com",
        },
        githubUrl: "https://github.com/rustfs/rustfs",
        links: [
          { text: labels.home, url: "https://rustfs.com", external: true },
          { text: labels.docs, url: docsUrl },
          { text: labels.installation, url: `${docsUrl}/installation` },
          { text: "MCP", url: `${docsUrl}/developer/mcp` },
          { text: "SDK", url: `${docsUrl}/developer/sdk` },
          { text: labels.demo, url: "https://play.rustfs.com", external: true },
          {
            text: labels.community,
            url: "https://github.com/rustfs/rustfs/discussions",
            external: true,
          },
          { text: labels.blog, url: "https://rustfs.com/blog", external: true },
          {
            type: "icon" as const,
            label: "Twitter",
            icon: TwitterIcon,
            text: "Twitter",
            url: "https://twitter.com/rustfsofficial",
            external: true,
          },
        ],
        sidebar: {
          footer: createSidebarFooter(locale),
        },
      };
      return props;
    },
  })
  .adapters(
    fumadocsMdx({
      // Preserve Fumadocs' default components + relative-link resolver, and
      // register the Mermaid renderer used by ```mermaid code blocks.
      async getMdxComponents(page) {
        const sourcePath = page.path.replace(/^(en|zh|de|fr|ja)\//, "");
        const RelativeLink = createRelativeLink(await this.getLoader(), {
          ...page,
          path: sourcePath,
        });
        const localePrefix = page.locale ? `/${page.locale}` : "";

        return {
          ...defaultMdxComponents,
          a: ({ href, ...props }) => {
            const localizedHref =
              localePrefix && href?.startsWith("/") && !href.startsWith(`${localePrefix}/`)
                ? `${localePrefix}${href}`
                : href;

            return <RelativeLink href={localizedHref} {...props} />;
          },
          Mermaid,
          Tab,
          Tabs,
          BrandLogo,
          ArrowRight,
        };
      },
    }),
  );
