import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RustFS",
  description: "RustFS is a high-performance distributed object storage software built using Rust",
  themeConfig: {
    siteTitle: false,
    logo: { src: '/images/logo.svg', height: 24 },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/rustfs/rustfs' },
      { icon: 'twitter', link: 'https://twitter.com/rustfs' },
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
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    }
  },
  srcDir: 'docs',
  locales: {
    root: { label: 'English', link: '/en/', lang: 'en', dir: 'en' },
    zh: { label: '简体中文', link: '/zh/', lang: 'zh', dir: 'zh' },
  },
  sitemap: {
    hostname: 'https://docs.rustfs.com'
  }
})
