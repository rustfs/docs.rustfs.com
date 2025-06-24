import { defineAdditionalConfig } from 'vitepress'
import { enSidebar } from './en/sidebar'

export default defineAdditionalConfig({
  lang: 'en-US',
  description: 'Vite & Vue powered static site generator.',

  themeConfig: {
    nav: [
      { text: 'Home', link: 'https://rustfs.com' },
      { text: 'Installation', link: '/en/installation/mode' },
      { text: 'SDK', link: '/en/sdk' },
      { text: 'Demo', link: 'https://play.rustfs.com:7001' },
      { text: 'Community', link: 'https://github.com/rustfs/rustfs/discussions' },
      { text: 'About', link: '/en/about' },
    ],

    sidebar: {
      '/en/': enSidebar,
    },

    editLink: {
      pattern: 'https://github.com/rustfs/rustfs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the Apache License 2.0.',
      copyright: 'Copyright © 2025 RustFS'
    }
  }
})
