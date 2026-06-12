<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useInventarioStore } from '~/store/inventario.store'
import PageHeader from '~/components/ui/PageHeader.vue'

const store = useInventarioStore()

const { search, categoria, soloStockBajo, hayFiltros, clearFiltros } = useInventarioFiltros()
const { handleCreate, handleEdit, handleEntrada, handleAjuste, handleDelete } =
  useInventarioAcciones()

await store.fetch()
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 pb-28 md:px-7 md:py-6">
    <PageHeader title="Inventario" subtitle="Materias primas y suministros">
      <template #right>
        <button
          class="btn btn-primary btn-sm hidden items-center gap-1.5 md:inline-flex"
          @click="handleCreate"
        >
          <Plus :size="13" />
          Nueva MP
        </button>
      </template>
    </PageHeader>

    <InventarioKpis
      :total-items="store.items.length"
      :stock-bajo-count="store.stockBajoCount"
      :valor-total="store.valorTotal"
    />

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

    <InventarioTabla
      :items="store.items"
      :loading="store.loading"
      :hay-filtros="hayFiltros"
      @entrada="handleEntrada"
      @ajuste="handleAjuste"
      @editar="handleEdit"
      @eliminar="handleDelete"
    />
  </div>

  <!-- FAB móvil -->
  <button
    class="bg-primary hover:bg-primary-dark fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-95 md:hidden"
    @click="handleCreate"
  >
    <Plus :size="22" />
  </button>
</template>
