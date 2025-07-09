import { defineAdditionalConfig } from 'vitepress'
import { zhSidebar } from './sidebar'

export default defineAdditionalConfig({
  lang: 'zh-Hans',
  description: 'RustFS - MinIO 国产化替代方案, 高性能分布式存储',

  themeConfig: {
    nav: [
      { text: '首页', link: 'https://rustfs.com' },
      { text: '安装', link: '/zh/installation/mode' },
      { text: 'SDK', link: '/zh/sdk' },
      { text: '演示', link: 'https://play.rustfs.com' },
      { text: '社区', link: 'https://github.com/rustfs/rustfs/discussions' },
      { text: '关于', link: '/zh/about' },
    ],

    sidebar: {
      '/zh/': zhSidebar,
    },

    editLink: {
      pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    footer: {
      message: 'Released under the Apache License 2.0.',
      copyright: 'Copyright © 2025 RustFS'
    }
  }
})
