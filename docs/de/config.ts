import { defineAdditionalConfig } from 'vitepress'
import { sidebar } from './sidebar'

export default defineAdditionalConfig({
  lang: 'de-DE',
  description: 'RustFS - MinIO-Alternative, hochleistungs verteilte Speicherlösung',

  themeConfig: {
    nav: [
      { text: 'Startseite', link: 'https://rustfs.com' },
      { text: 'Installation', link: '/de/installation/mode' },
      { text: 'SDK', link: '/de/sdk' },
      { text: 'Demo', link: 'https://play.rustfs.com' },
      { text: 'Community', link: 'https://github.com/rustfs/rustfs/discussions' },
      { text: 'Über uns', link: '/de/about' },
    ],

    sidebar: {
      '/de/': sidebar,
    },

    editLink: {
      pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path',
      text: 'Diese Seite auf GitHub bearbeiten'
    },

    footer: {
      message: 'Veröffentlicht unter der Apache License 2.0.',
      copyright: 'Copyright © 2025 RustFS'
    }
  }
})
