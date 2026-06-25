<script setup lang="ts">
import { Search, X, RefreshCcw } from 'lucide-vue-next'

interface Props {
  loading: boolean
}

defineProps<Props>()

const search = defineModel<string>('search', { default: '' })

const emit = defineEmits<{ refresh: [] }>()
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Búsqueda -->
    <div class="relative flex-1">
      <Search :size="14" class="text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por cliente..."
        class="border-border bg-surface text-text placeholder-muted focus:border-primary w-full rounded-xl border py-2.5 pl-9 pr-8 text-[13px] outline-none transition-colors"
      />
      <button
        v-if="search"
        class="text-muted hover:text-text absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
        @click="search = ''"
      >
        <X :size="14" />
      </button>
    </div>

    <!-- Refresh -->
    <button
      class="border-border bg-surface text-muted hover:text-text flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-50"
      :disabled="loading"
      @click="emit('refresh')"
    >
      <RefreshCcw :size="13" :class="loading ? 'animate-spin' : ''" />
    </button>
  </div>
</template>
