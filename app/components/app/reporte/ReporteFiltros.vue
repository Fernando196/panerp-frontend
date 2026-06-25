<script setup lang="ts">
const desde = defineModel<string>('desde', { default: '' })
const hasta = defineModel<string>('hasta', { default: '' })

const emit = defineEmits<{ aplicar: [] }>()
</script>

<template>
  <div class="flex flex-col gap-3 md:flex-row md:items-end md:gap-3">
    <div class="flex flex-col gap-1.5 md:flex-1">
      <label class="text-subtle text-[12px] font-medium">Desde</label>
      <input
        v-model="desde"
        type="date"
        class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary h-12 rounded-xl border px-3 text-[13px] outline-none transition-colors"
      />
    </div>

    <div class="flex flex-col gap-1.5 md:flex-1">
      <label class="text-subtle text-[12px] font-medium">Hasta</label>
      <input
        v-model="hasta"
        type="date"
        class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary h-12 rounded-xl border px-3 text-[13px] outline-none transition-colors"
      />
    </div>

    <button
      class="btn btn-primary h-12 w-full md:w-auto"
      @click="emit('aplicar')"
    >
      Aplicar
    </button>
  </div>
</template>
