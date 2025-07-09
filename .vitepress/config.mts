import { defineConfig, HeadConfig, resolveSiteDataByRoute } from 'vitepress';
import {
  groupIconMdPlugin
} from 'vitepress-plugin-group-icons';

const prod = !!process.env.VITEPRESS_PROD

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'RustFS',
  description: 'RustFS is a high-performance distributed object storage software built using Rust',
  rewrites: {
    'en/:rest*': ':rest*'
  },
  lastUpdated: true,
  cleanUrls: true,
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
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },
  },
  head: [
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
  locales: {
    root: { label: 'English' },
    zh: { label: '简体中文' },
  },
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
        const { localeIndex = 'root' } = env
        const codeCopyButtonTitle = (() => {
          switch (localeIndex) {
            case 'es':
              return 'Copiar código'
            case 'fa':
              return 'کپی کد'
            case 'ko':
              return '코드 복사'
            case 'pt':
              return 'Copiar código'
            case 'ru':
              return 'Скопировать код'
            case 'zh':
              return '复制代码'
            default:
              return 'Copy code'
          }
        })()
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
