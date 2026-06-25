<script setup lang="ts">
import { Search, X, RefreshCcw } from 'lucide-vue-next'

interface Props {
  categorias: string[]
  hayFiltros: boolean
  loading: boolean
}

defineProps<Props>()

const search = defineModel<string>('search', { default: '' })
const categoria = defineModel<string>('categoria', { default: '' })
const soloActivos = defineModel<boolean>('soloActivos', { default: false })

const emit = defineEmits<{ clear: []; refresh: [] }>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Búsqueda -->
    <div class="relative">
      <Search :size="14" class="text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        v-model="search"
        type="text"
        placeholder="Buscar producto..."
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

    <!-- Chips de filtro -->
    <div
      class="flex items-center gap-2 overflow-x-auto pb-0.5"
      style="scrollbar-width: none; -ms-overflow-style: none"
    >
      <!-- Solo activos toggle -->
      <button
        class="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors"
        :class="
          soloActivos
            ? 'border-success/50 bg-success/10 text-success'
            : 'border-border bg-surface text-subtle hover:border-border-strong'
        "
        @click="soloActivos = !soloActivos"
      >
        <span
          class="h-1.5 w-1.5 rounded-full"
          :class="soloActivos ? 'bg-success' : 'bg-muted'"
        />
        Solo activos
      </button>

      <div v-if="categorias.length" class="border-border h-4 shrink-0 border-l" />

      <!-- Categorías -->
      <button
        v-for="cat in categorias"
        :key="cat"
        class="shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors"
        :class="
          categoria === cat
            ? 'border-primary/50 bg-primary/10 text-primary'
            : 'border-border bg-surface text-subtle hover:border-border-strong'
        "
        @click="categoria = categoria === cat ? '' : cat"
      >
        {{ cat }}
      </button>

      <!-- Limpiar -->
      <button
        v-if="hayFiltros"
        class="text-muted hover:text-text flex shrink-0 items-center gap-1 rounded-full px-2 py-1.5 text-[11px] transition-colors"
        @click="emit('clear')"
      >
        <X :size="11" />
        Limpiar
      </button>

      <!-- Refresh -->
      <button
        class="border-border bg-surface text-muted hover:text-text ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-50"
        :disabled="loading"
        @click="emit('refresh')"
      >
        <RefreshCcw :size="13" :class="loading ? 'animate-spin' : ''" />
      </button>
    </div>
  </div>
</template>
