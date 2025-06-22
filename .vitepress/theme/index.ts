// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import { default as DefaultTheme, default as VPNavBarSearch } from 'vitepress/theme'
import { h } from 'vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('SearchBox', VPNavBarSearch)
  }
} satisfies Theme
