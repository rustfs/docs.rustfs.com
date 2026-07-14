import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { flexsearchPlugin } from "fumapress/plugins/flexsearch";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { sitemapPlugin } from "fumapress/plugins/sitemap";
import { takumiPlugin } from "fumapress/plugins/takumi";
import { createNotebookLayoutPage } from "fumapress/layouts/notebook";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import { docs } from "./.source/server";
import { Mermaid } from "./src/components/mermaid";
import { Tab, Tabs } from "./src/components/tabs";

const isDev = import.meta.env.DEV;

const siteDescription =
  "RustFS is an S3-compatible distributed object storage engine written in Rust.";

// Social icons (inline SVG so the bundle stays self-contained).
const TwitterIcon = (
  <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WeiboIcon = (
  <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.019.259 2.611-2.759 5.049-6.739 5.442zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.312-.359-.177-.586.138-.227.435-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.185.8-1.804-.111-3.668-2.161-4.143zm7.563-1.13c-.328-.101-.552-.169-.381-.602.37-.94.41-1.752.008-2.33-.757-1.083-2.824-1.024-5.195-.032 0 0-.744.326-.553-.263.365-1.176.31-2.16-.26-2.73-1.291-1.292-4.723.049-7.663 2.99C1.542 10.982 0 13.3 0 15.304c0 3.834 4.917 6.166 9.727 6.166 6.3 0 10.49-3.66 10.49-6.566 0-1.755-1.48-2.752-2.806-3.176zm2.678-8.622c-1.485-1.649-3.68-2.278-5.708-1.848-.469.099-.768.562-.669 1.03.099.47.562.77 1.03.67 1.441-.306 2.999.142 4.055 1.314 1.055 1.172 1.339 2.766.868 4.169-.151.451.094.939.545 1.089.449.151.938-.094 1.089-.545.663-1.976.264-4.223-1.223-5.879zm-2.271 2.045c-.724-.804-1.795-1.112-2.784-.902-.403.086-.66.482-.574.885.086.403.483.659.885.574.484-.103.998.045 1.354.44.355.394.439.943.28 1.409-.13.383.075.799.457.929.382.13.799-.075.929-.457.328-.961.156-2.09-.547-2.878z" />
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
          { text: "Installation", url: "/installation/linux" },
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
          {
            type: "icon" as const,
            label: "Weibo",
            icon: WeiboIcon,
            text: "Weibo",
            url: "https://weibo.com/rustfs",
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
        };
      },
    }),
  );
