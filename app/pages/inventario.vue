<script setup lang="ts">
import { Plus, AlertTriangle, X } from 'lucide-vue-next'
import { useInventarioStore } from '~/store/inventario.store'
import { useAuthStore } from '~/store/auth.store'

const store = useInventarioStore()
const auth = useAuthStore()

const { search, categoria, soloStockBajo, hayFiltros, clearFiltros } = useInventarioFiltros()
const { errorMsg, handleCreate, handleEdit, handleEntrada, handleAjuste, handleDelete } =
  useInventarioAcciones()

await store.fetch()
</script>

<template>
  <div class="w-full space-y-5 p-5 pb-10 md:p-7">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-white">Inventario</h1>
        <p class="mt-0.5 text-[13px] text-slate-500">Materias primas y suministros</p>
      </div>
      <button class="btn btn-primary btn-sm inline-flex items-center gap-1.5" @click="handleCreate">
        <Plus :size="13" />
        Nueva materia prima
      </button>
    </div>

    <!-- KPIs -->
    <InventarioKpis
      :total-items="store.items.length"
      :stock-bajo-count="store.stockBajoCount"
      :valor-total="store.valorTotal"
    />

    <!-- Error global -->
    <div
      v-if="errorMsg"
      class="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-[13px] text-error"
    >
      <AlertTriangle :size="14" />
      {{ errorMsg }}
      <button class="ml-auto" @click="errorMsg = ''">
        <X :size="13" />
      </button>
    </div>

    <!-- Filtros -->
    <InventarioFiltros
      v-model:search="search"
      v-model:categoria="categoria"
      v-model:solo-stock-bajo="soloStockBajo"
      :categorias="store.categorias"
      :hay-filtros="hayFiltros"
      :loading="store.loading"
      @clear="clearFiltros"
      @refresh="store.fetch()"
    />

    <!-- Tabla -->
    <InventarioTabla
      :items="store.items"
      :loading="store.loading"
      :hay-filtros="hayFiltros"
      :is-admin="auth.isAdmin"
      @entrada="handleEntrada"
      @ajuste="handleAjuste"
      @editar="handleEdit"
      @eliminar="handleDelete"
    />
  </div>
</template>
