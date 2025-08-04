import { defineAdditionalConfig } from 'vitepress'
import { ruSidebar } from './sidebar'

export default defineAdditionalConfig({
  lang: 'ru-RU',
  description: 'RustFS - Альтернатива MinIO, высокопроизводительное распределенное хранилище',

  themeConfig: {
    nav: [
      { text: 'Главная', link: 'https://rustfs.com' },
      { text: 'Установка', link: '/ru/installation/mode' },
      { text: 'SDK', link: '/ru/sdk' },
      { text: 'Демо', link: 'https://play.rustfs.com' },
      { text: 'Сообщество', link: 'https://github.com/rustfs/rustfs/discussions' },
      { text: 'О проекте', link: '/ru/about' },
    ],

    sidebar: {
      '/ru/': ruSidebar,
    },

    editLink: {
      pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path',
      text: 'Редактировать эту страницу на GitHub'
    },

    footer: {
      message: 'Опубликовано под лицензией Apache 2.0.',
      copyright: 'Copyright © 2025 RustFS'
    }
  }
})