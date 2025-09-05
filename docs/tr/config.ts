import { defineAdditionalConfig } from 'vitepress'
import { sidebar } from './sidebar'

export default defineAdditionalConfig({
  lang: 'tr-TR',
  description: 'RustFS - MinIO alternatifi, yüksek performanslı dağıtık depolama çözümü',

  themeConfig: {
    nav: [
      { text: 'Ana Sayfa', link: 'https://rustfs.com' },
      { text: 'Dokümantasyon', link: '/tr/' },
      { text: 'Kurulum', link: '/tr/installation/linux' },
      { text: 'MCP', link: '/tr/developer/mcp/' },
      { text: 'SDK', link: '/tr/sdk' },
      { text: 'Demo', link: 'https://play.rustfs.com' },
      { text: 'Topluluk', link: 'https://github.com/rustfs/rustfs/discussions' },
      { text: 'Hakkında', link: '/tr/about' },
    ],

    sidebar: {
      '/tr/': sidebar,
    },

    editLink: {
      pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path',
      text: 'Bu sayfayı GitHub\'da düzenle'
    },

    footer: {
      message: 'Apache License 2.0 altında yayınlanmıştır.',
      copyright: 'Copyright © 2025 RustFS'
    }
  }
})
