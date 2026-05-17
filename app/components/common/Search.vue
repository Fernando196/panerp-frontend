<script setup lang="ts">
  import type { Icons } from '~/types/icons.type'
  import MapIcon from '../common/MapIcon/MapIcon.vue'

  interface Props {
    id: number | string
    icon?: Icons
    placeholder: string
  }

  defineProps<Props>()
  const search = defineModel<string>()
</script>
<template>
  <div class="relative">
    <MapIcon
      :name="icon || 'search'"
      class="stroke-subtle absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
    />
    <input
      :id="'search-' + id"
      v-model="search"
      type="text"
      :placeholder="placeholder"
      class="focus:border-primary w-full rounded-xl border border-neutral-100 bg-neutral-50 py-2 pr-4 pl-9 text-sm text-neutral-900 transition-colors outline-none placeholder:text-neutral-400 focus:bg-white"
    />
  </div>
</template>
