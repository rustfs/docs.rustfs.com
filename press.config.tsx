import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { flexsearchPlugin } from "fumapress/plugins/flexsearch";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { sitemapPlugin } from "fumapress/plugins/sitemap";
import { takumiPlugin } from "fumapress/plugins/takumi";
import { createNotebookLayoutPage } from "fumapress/layouts/notebook";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import { docs } from "./.source/server";
import { BrandLogo } from "./src/components/brand-logo";
import { Mermaid } from "./src/components/mermaid";
import { Tab, Tabs } from "./src/components/tabs";
import { ArrowRight } from "lucide-react";

const isDev = import.meta.env.DEV;

const siteDescription =
  "RustFS is an S3-compatible distributed object storage engine written in Rust.";

// Social icons (inline SVG so the bundle stays self-contained).
const TwitterIcon = (
  <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Sidebar footer: license + copyright (parity with the previous VitePress footer).
const SidebarFooter = (
  <div className="flex flex-col gap-0.5 px-2 py-3 text-xs text-fd-muted-foreground">
    <p>Released under the Apache License 2.0.</p>
    <p>Copyright © 2025 RustFS</p>
  </div>
);

export default defineConfig({
  content: docs.toFumadocsSource(),
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

          {/* Locale alternates */}
          <link
            rel="alternate"
            hrefLang="x-default"
            href="https://docs.rustfs.com"
          />
          <link
            rel="alternate"
            hrefLang="en-US"
            href="https://docs.rustfs.com"
          />
          <link
            rel="alternate"
            hrefLang="zh-CN"
            href="https://docs.rustfs.com.cn"
          />

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
      return (
        <meta
          name="description"
          content={page.data.description ?? siteDescription}
        />
      );
    },
  },
})
  .plugins(flexsearchPlugin(), llmsPlugin(), takumiPlugin(), sitemapPlugin())
  .layouts({
    // Use the Notebook layout: a full-width top navbar (main links + search +
    // GitHub + theme) with the page tree in the sidebar — like the FumaPress docs.
    page: createNotebookLayoutPage(),
    // Shared navbar / links across all Fumadocs layouts.
    defaultProps() {
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
          { text: "Home", url: "https://rustfs.com", external: true },
          { text: "Docs", url: "/" },
          { text: "Installation", url: "/installation" },
          { text: "MCP", url: "/developer/mcp" },
          { text: "SDK", url: "/developer/sdk" },
          { text: "Demo", url: "https://play.rustfs.com", external: true },
          {
            text: "Community",
            url: "https://github.com/rustfs/rustfs/discussions",
            external: true,
          },
          { text: "Blog", url: "https://rustfs.dev", external: true },
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
          footer: SidebarFooter,
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
        return {
          ...defaultMdxComponents,
          a: createRelativeLink(await this.getLoader(), page),
          Mermaid,
          Tab,
          Tabs,
          BrandLogo,
          ArrowRight,
        };
      },
    }),
  );
