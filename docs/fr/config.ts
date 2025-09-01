import { defineAdditionalConfig } from 'vitepress'
import { sidebar } from './sidebar'

export default defineAdditionalConfig({
  lang: 'fr-FR',
  description: 'RustFS - Alternative à MinIO, stockage distribué haute performance',

  themeConfig: {
    nav: [
      { text: 'Accueil', link: 'https://rustfs.com' },
      { text: 'Installation', link: '/fr/installation/mode' },
      { text: 'SDK', link: '/fr/sdk' },
      { text: 'Démo', link: 'https://play.rustfs.com' },
      { text: 'Communauté', link: 'https://github.com/rustfs/rustfs/discussions' },
      { text: 'À propos', link: '/fr/about' },
    ],

    sidebar: {
      '/fr/': sidebar,
    },

    editLink: {
      pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path',
      text: 'Modifier cette page sur GitHub'
    },

    footer: {
      message: 'Publié sous la licence Apache 2.0.',
      copyright: 'Copyright © 2025 RustFS'
    }
  }
})
