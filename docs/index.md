---
layout: page
sidebar: false
---

<script setup>
import { onMounted } from 'vue';
import { withBase } from 'vitepress';

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.location.href = withBase('/installation/');
  }
});
</script>
