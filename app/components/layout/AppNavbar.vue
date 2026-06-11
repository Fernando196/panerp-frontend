<script setup lang="ts">
  import { Menu, Wheat } from 'lucide-vue-next'
  import { BAKERY_NAME } from '~/const/app.const'

  const emits = defineEmits(['onClickMenu'])
  const appName = BAKERY_NAME
</script>
<template>
  <div class="border-b-border flex justify-between border-b px-5 py-4">
    <div class="flex items-center gap-2">
      <button
        class="mr-3 text-slate-400 transition-colors hover:text-white"
        @click="emits('onClickMenu')"
      >
        <Menu :size="20" />
      </button>
      <Wheat :size="15" class="text-primary" />
      <span>{{ appName }}</span>
    </div>
  </div>
</template>
