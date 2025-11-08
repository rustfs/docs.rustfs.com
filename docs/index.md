---
layout: page
sidebar: false
---

<script setup>
import { onMounted } from 'vue';
onMounted(() => {
  window && window.addEventListener('DOMContentLoaded', () => {
    window.location.href = '/installation/';
  });
});
</script>
