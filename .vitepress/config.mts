import { defineConfig, HeadConfig, resolveSiteDataByRoute } from 'vitepress';
import {
  groupIconMdPlugin
} from 'vitepress-plugin-group-icons';

const prod = !!process.env.VITEPRESS_PROD

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'RustFS Documentation',
  description: 'RustFS is an S3-compatible distributed object storage engine written in Rust.',
  lang: 'en-US',
  ignoreDeadLinks: true,
  lastUpdated: true,
  cleanUrls: false,
  metaChunk: true,
  themeConfig: {
    siteTitle: false,
    logo: { src: '/images/logo.svg', height: 24 },
    logoLink: { link: 'https://rustfs.com', target: '_blank' },
    editLink: { pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/rustfs/rustfs' },
      { icon: 'twitter', link: 'https://twitter.com/rustfsofficial' },
      { icon: 'weibo', link: 'https://weibo.com/rustfs' },
    ],
    search: {
      provider: 'local',
    },
  },
  head: [
    ['meta', { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'author', content: 'RustFS' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'googlebot', content: 'index, follow' }],
    ['meta', { name: 'bingbot', content: 'index, follow' }],
    ['meta', { name: 'yandexbot', content: 'index, follow' }],
    ['meta', { key: 'twitter:site', name: 'twitter:site', content: '@rustfs' }],
    ['meta', { key: 'twitter:creator', name: 'twitter:creator', content: '@rustfs' }],
    ['meta', { key: 'og:type', property: 'og:type', content: 'article' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    // alternate links
    ['link', { rel: 'alternate', hreflang: 'x-default', href: 'https://docs.rustfs.com' }],
    ['link', { rel: 'alternate', hreflang: 'en-US', href: 'https://docs.rustfs.com' }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: 'https://docs.rustfs.com.cn' }],
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-TWW7WMTWL9' }],

    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-TWW7WMTWL9');`,
    ],

    [
      'script',
      {},
      `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?968e7103a8e28fb30f7d69e42b7c82bc";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
    `,
    ],
  ],
  srcDir: 'docs',
  sitemap: {
    hostname: 'https://docs.rustfs.com',
  },
  markdown: {
    math: true,
    codeTransformers: [
      // We use `[!!code` in demo to prevent transformation, here we revert it back.
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, '[!code')
        }
      }
    ],
    config(md) {
      // TODO: remove when https://github.com/vuejs/vitepress/issues/4431 is fixed
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const codeCopyButtonTitle = 'Copy'
        return fence(tokens, idx, options, env, self).replace(
          '<button title="Copy Code" class="copy"></button>',
          `<button title="${codeCopyButtonTitle}" class="copy"></button>`
        )
      }
      md.use(groupIconMdPlugin)
    }
  },
  transformPageData: prod
    ? (pageData, ctx) => {
      const site = resolveSiteDataByRoute(
        ctx.siteConfig.site,
        pageData.relativePath
      )
      const title = `${pageData.title || site.title} | ${pageData.description || site.description}`
        ; ((pageData.frontmatter.head ??= []) as HeadConfig[]).push(
          ['meta', { property: 'og:locale', content: site.lang }],
          ['meta', { property: 'og:title', content: title }]
        )
    }
    : undefined
});
