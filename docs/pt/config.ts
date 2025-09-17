import { defineAdditionalConfig } from 'vitepress'
import { sidebar } from './sidebar'

export default defineAdditionalConfig({
  lang: 'pt-BR',
  description: 'RustFS - Alternativa ao MinIO, solução de armazenamento distribuído de alta performance',

  themeConfig: {
    nav: [
      { text: 'Início', link: 'https://rustfs.com' },
      { text: 'Documentação', link: '/pt/' },
      { text: 'Instalação', link: '/pt/installation/linux' },
      { text: 'MCP', link: '/pt/developer/mcp/' },
      { text: 'SDK', link: '/pt/sdk' },
      { text: 'Demo', link: 'https://play.rustfs.com' },
      { text: 'Comunidade', link: 'https://github.com/rustfs/rustfs/discussions' },
      { text: 'Sobre', link: '/pt/about' },
    ],

    sidebar: {
      '/pt/': sidebar,
    },

    editLink: {
      pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path',
      text: 'Editar esta página no GitHub'
    },

    footer: {
      message: 'Lançado sob a Licença Apache 2.0.',
      copyright: 'Copyright © 2025 RustFS'
    }
  }
})
