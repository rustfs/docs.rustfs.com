<script setup>

defineProps({
  title: {
    type: String,
    required: true
  },
  sidebar: {
    type: Array,
    required: true
  }
})
</script>
<template>
  <div class="home-components container mx-auto flex flex-col gap-8 py-12">
    <h1 class="text-2xl! lg:text-4xl! leading-none font-bold! tracking-tight! dark:text-slate-300 text-slate-900 mt-10! mb-8! sm:mt-14! sm:mb-10!">{{ title }} </h1>

    <div class="grid grid-cols-4 gap-6 items-stretch justify-items-start">
      <template v-for="group in sidebar" :key="group.text" class="flex w-full">
        <NavCard :group="group" class="w-full" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: calc(var(--vp-layout-max-width) - 64px);
  pointer-events: none;
}

.container>.title,
.container>.content {
  pointer-events: none;
}

.container :deep(*) {
  pointer-events: auto;
}
</style>
