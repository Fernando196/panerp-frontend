<script setup lang="ts">
  import type { Icons } from '~/types/icons.type'
  import MapIcon from '../MapIcon/MapIcon.vue'

  interface Props {
    title: string
    icon?: Icons
    message?: string
    cancelText?: string
    confirmText?: string
  }

  defineProps<Props>()
  defineEmits(['close'])

  const { close } = useModal()
</script>
<template>
  <div class="relative flex max-h-[90vh] w-auto flex-col rounded-2xl bg-white">
    <header class="flex shrink-0 items-center justify-between rounded-t-2xl bg-white p-5 font-bold">
      <h2 class="text-[16px] font-semibold">{{ title }}</h2>
      <button class="h-6 w-6 cursor-pointer" @click="$emit('close')">
        <MapIcon name="close" class="fill-muted h-4 w-4" />
      </button>
    </header>

    <main class="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
      <span v-if="message" class="mt-4 text-sm text-neutral-500">{{ message }}</span>
    </main>
    <footer
      class="bg-subtle-bg flex w-full shrink-0 justify-end gap-3 rounded-b-2xl border-t border-gray-200 px-5.5 py-3.5"
    >
      <button class="btn" @click="close(false)">
        {{ cancelText ?? 'Cancelar' }}
      </button>
      <button class="btn btn-primary" @click="close(true)">
        {{ confirmText ?? 'Confirmar' }}
      </button>
    </footer>
  </div>
</template>
