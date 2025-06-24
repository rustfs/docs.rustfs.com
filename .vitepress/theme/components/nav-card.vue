<template>
  <template v-if="group.home">
    <div class="rounded shadow bg-neutral-100 dark:bg-neutral-800 p-6 flex flex-col">
      <h4 class="mt-0! py-0 font-bold!">{{ group.text }}</h4>
      <ul class="flex-1 my-4! ml-3! space-y-2">
        <li v-for="item in displayItems" :key="item.text" class="list-disc">
          <a :href="item.link" class="text-gray-700! dark:text-gray-300! hover:text-blue-600! hover:underline">
            {{ item.text }}
          </a>
        </li>
      </ul>
      <div v-if="hasMore" class="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <a :href="group.items[0].link" class="dark:text-gray-300 text-blue-600! hover:text-blue-800 text-sm font-medium">
          {{ viewMoreLabel }} ({{ group.items.length }})
        </a>
      </div>
    </div>
  </template>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  group: {
    type: Object,
    required: true
  },
  viewMoreLabel: {
    type: String,
    default: 'View more'
  }
})

const displayItems = computed(() => {
  return props.group.items?.slice(0, 5) || []
})

const hasMore = computed(() => {
  return props.group.items?.length > 5
})
</script>
