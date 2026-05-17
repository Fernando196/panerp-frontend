<script setup lang="ts">
  import MapIcon from '../MapIcon/MapIcon.vue'

  interface Props {
    title: string
  }

  defineProps<Props>()
  defineEmits(['close'])
</script>
<template>
  <div class="relative flex max-h-[90vh] w-auto flex-col rounded-2xl bg-white">
    <header class="flex shrink-0 items-center justify-between rounded-t-2xl bg-white p-5 font-bold">
      <h2 class="text-[16px] font-semibold">{{ title }}</h2>
      <button class="h-4 w-4 cursor-pointer" @click="$emit('close')">
        <MapIcon name="close" class="fill-muted" />
      </button>
    </header>
    <main class="min-h-0 flex-1 overflow-y-auto px-5">
      <slot />
    </main>
    <footer
      class="bg-subtle-bg w-full shrink-0 gap-3 rounded-b-2xl border-t border-gray-200 px-5.5 py-3.5"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>
