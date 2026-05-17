<script setup lang="ts">
  interface Props {
    title: string
    subtitle?: string
  }
  defineProps<Props>()
</script>

<template>
  <div class="flex items-center justify-between rounded-t-md border border-b-0 border-gray-200 bg-white px-4 py-3">
    <div class="flex flex-col">
      <h2 class="text-lg font-semibold text-neutral-900">{{ title }}</h2>
      <p v-if="subtitle" class="text-sm text-neutral-400">{{ subtitle }}</p>
    </div>
    <div class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
