import { defineAdditionalConfig } from 'vitepress'
import { sidebar } from './sidebar'

export default defineAdditionalConfig({
  lang: 'ko-KR',
  description: 'RustFS - MinIO 대안, 고성능 분산 스토리지',

  themeConfig: {
    nav: [
      { text: '홈', link: 'https://rustfs.com' },
      { text: '설치', link: '/ko/installation/mode' },
      { text: 'SDK', link: '/ko/sdk' },
      { text: '데모', link: 'https://play.rustfs.com' },
      { text: '커뮤니티', link: 'https://github.com/rustfs/rustfs/discussions' },
      { text: '소개', link: '/ko/about' },
    ],

    sidebar: {
      '/ko/': sidebar,
    },

    editLink: {
      pattern: 'https://github.com/rustfs/docs.rustfs.com/edit/main/docs/:path',
      text: 'GitHub에서 이 페이지 편집'
    },

    footer: {
      message: 'Apache License 2.0 하에 출시되었습니다.',
      copyright: 'Copyright © 2025 RustFS'
    }
  }
})
