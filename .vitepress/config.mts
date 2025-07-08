import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'RustFS',
  description: 'RustFS is a high-performance distributed object storage software built using Rust',
  themeConfig: {
    siteTitle: false,
    logo: { src: '/images/logo.svg', height: 24 },
    logoLink: { link: 'https://rustfs.com', target: '_blank' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/rustfs/rustfs' },
      { icon: 'twitter', link: 'https://twitter.com/rustfsofficial' },
      { icon: 'weibo', link: 'https://weibo.com/rustfs' },
    ],
    editLink: {
        pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path'
      },
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
    root: { label: 'English', link: '/en/', lang: 'en', dir: 'en' },
    zh: { label: '简体中文', link: '/zh/', lang: 'zh', dir: 'zh' },
  },
  sitemap: {
    hostname: 'https://docs.rustfs.com',
  },
});
