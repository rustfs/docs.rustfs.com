import { defineAdditionalConfig } from 'vitepress'
import { esSidebar } from './sidebar'

export default defineAdditionalConfig({
  lang: 'es-ES',
  description: 'RustFS - Alternativa a MinIO, almacenamiento distribuido de alto rendimiento',

  themeConfig: {
    nav: [
      { text: 'Inicio', link: 'https://rustfs.com' },
      { text: 'Instalación', link: '/es/installation/mode' },
      { text: 'SDK', link: '/es/sdk' },
      { text: 'Demo', link: 'https://play.rustfs.com' },
      { text: 'Comunidad', link: 'https://github.com/rustfs/rustfs/discussions' },
      { text: 'Acerca de', link: '/es/about' },
    ],

    sidebar: {
      '/es/': esSidebar,
    },

    editLink: {
      pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path',
      text: 'Editar esta página en GitHub'
    },

    footer: {
      message: 'Publicado bajo la Licencia Apache 2.0.',
      copyright: 'Copyright © 2025 RustFS'
    }
  }
})