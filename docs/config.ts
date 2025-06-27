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
      { text: 'Demo', link: 'https://play.rustfs.com' },
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

     head: [
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-TWW7WMTWL9' }
    ],

    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-TWW7WMTWL9');`
    ],
    
    ['script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?968e7103a8e28fb30f7d69e42b7c82bc";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
    `]
  ],


    


    footer: {
      message: 'Released under the Apache License 2.0.',
      copyright: 'Copyright © 2025 RustFS'
    }
  }
})



 
