<script setup lang="ts">
import { Search, AlertTriangle, X, RefreshCcw, ChevronDown } from 'lucide-vue-next'

interface Props {
  categorias: string[]
  hayFiltros: boolean
  loading: boolean
}

defineProps<Props>()

const search = defineModel<string>('search', { default: '' })
const categoria = defineModel<string>('categoria', { default: '' })
const soloStockBajo = defineModel<boolean>('soloStockBajo', { default: false })

const emit = defineEmits<{
  clear: []
  refresh: []
}>()

const categoriasOpen = ref(false)
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <!-- Búsqueda -->
    <div class="relative min-w-48 flex-1">
      <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        v-model="search"
        type="text"
        placeholder="Buscar materia prima..."
        class="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-8 pr-3 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
      />
    </div>

    <!-- Categoría dropdown -->
    <div class="relative">
      <button
        class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[13px] text-slate-300 transition-colors hover:border-slate-600"
        :class="categoria ? 'border-primary/60 text-primary' : ''"
        @click="categoriasOpen = !categoriasOpen"
      >
        {{ categoria || 'Categoría' }}
        <ChevronDown
          :size="13"
          class="text-slate-500 transition-transform"
          :class="categoriasOpen ? 'rotate-180' : ''"
        />
      </button>

      <div
        v-if="categoriasOpen"
        class="absolute left-0 top-full z-20 mt-1 min-w-44 rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-lg"
        @mouseleave="categoriasOpen = false"
      >
        <button
          class="w-full px-3 py-1.5 text-left text-[13px] text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          @click="categoria = ''; categoriasOpen = false"
        >
          Todas
        </button>
        <button
          v-for="cat in categorias"
          :key="cat"
          class="w-full px-3 py-1.5 text-left text-[13px] transition-colors hover:bg-slate-800"
          :class="categoria === cat ? 'text-primary' : 'text-slate-300'"
          @click="categoria = cat; categoriasOpen = false"
        >
          {{ cat }}
        </button>
        <p v-if="!categorias.length" class="px-3 py-2 text-[12px] text-slate-600">
          Sin categorías
        </p>
      </div>
    </div>

    <!-- Toggle stock bajo -->
    <button
      class="flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors"
      :class="
        soloStockBajo
          ? 'border-warning/40 bg-warning/10 text-warning'
          : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200'
      "
      @click="soloStockBajo = !soloStockBajo"
    >
      <AlertTriangle :size="13" />
      Stock bajo
    </button>

    <!-- Limpiar filtros -->
    <button
      v-if="hayFiltros"
      class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] text-slate-500 transition-colors hover:text-slate-300"
      @click="emit('clear')"
    >
      <X :size="12" />
      Limpiar
    </button>

    <!-- Refrescar -->
    <button
      class="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-500 transition-colors hover:border-slate-600 hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
      :class="loading ? 'animate-spin' : ''"
      :disabled="loading"
      @click="emit('refresh')"
    >
      <RefreshCcw :size="14" />
    </button>
  </div>
</template>
