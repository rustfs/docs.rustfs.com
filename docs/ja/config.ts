import { defineAdditionalConfig } from 'vitepress'
import { jaSidebar } from './sidebar'

export default defineAdditionalConfig({
  lang: 'ja-JP',
  description: 'RustFS - MinIOの代替ソリューション、高性能分散ストレージ',

  themeConfig: {
    nav: [
      { text: 'ホーム', link: 'https://rustfs.com' },
      { text: 'インストール', link: '/ja/installation/mode' },
      { text: 'SDK', link: '/ja/sdk' },
      { text: 'デモ', link: 'https://play.rustfs.com' },
      { text: 'コミュニティ', link: 'https://github.com/rustfs/rustfs/discussions' },
      { text: '概要', link: '/ja/about' },
    ],

    sidebar: {
      '/ja/': jaSidebar,
    },

    editLink: {
      pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path',
      text: 'GitHubでこのページを編集'
    },

    footer: {
      message: 'Apache License 2.0の下でリリースされています。',
      copyright: 'Copyright © 2025 RustFS'
    }
  }
})