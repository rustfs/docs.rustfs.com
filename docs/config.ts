import { defineAdditionalConfig } from 'vitepress';
import { enSidebar } from './en/sidebar';

export default defineAdditionalConfig({
  lang: 'en-US',
  description: 'RustFS - MinIO alternative, high-performance distributed storage',

  themeConfig: {
    nav: [
      { text: 'Home', link: 'https://rustfs.com' },
      { text: 'Installation', link: '/en/installation/mode' },
      { text: 'SDK', link: '/en/sdk' },
      { text: 'Demo', link: 'https://play.rustfs.com' },
      { text: 'Community', link: 'https://github.com/rustfs/rustfs/discussions' },
      { text: 'About', link: '/en/about' },
    ],

    sidebar: {
      '/': enSidebar,
    },

    editLink: {
      pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the Apache License 2.0.',
      copyright: 'Copyright © 2025 RustFS',
    },
  },
});
