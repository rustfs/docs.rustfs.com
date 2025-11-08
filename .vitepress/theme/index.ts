// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import { default as DefaultTheme } from 'vitepress/theme'
import { h } from 'vue'
import './style.css'
import './tailwind.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
