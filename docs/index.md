---
layout: page
sidebar: false
---

<script setup>
import { onMounted } from 'vue';
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.location.href = '/installation/';
  }
});
</script>
