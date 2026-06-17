<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useCharolaStore } from '~/store/charola.store'
import PageHeader from '~/components/ui/PageHeader.vue'

const store = useCharolaStore()

const { search, estado, hayFiltros, clearFiltros } = useCharolaFiltros()
const { handleCreate, handleEdit, handleDelete, handleAsignar, handleLiberar } =
  useCharolaAcciones()

await store.fetch()
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 pb-28 md:px-7 md:py-6">
    <PageHeader title="Charolas" subtitle="Control de charolas en consignación">
      <template #right>
        <button
          class="btn btn-primary btn-sm hidden items-center gap-1.5 md:inline-flex"
          @click="handleCreate"
        >
          <Plus :size="13" />
          Nueva charola
        </button>
      </template>
    </PageHeader>

    <CharolaKpis
      :total-items="store.items.length"
      :disponibles-count="store.disponibles.length"
      :en-cliente-count="store.enCliente.length"
    />

    <CharolaFiltros
      v-model:search="search"
      v-model:estado="estado"
      :hay-filtros="hayFiltros"
      :loading="store.loading"
      @clear="clearFiltros"
      @refresh="store.fetch()"
    />

    <CharolaTabla
      :items="store.items"
      :loading="store.loading"
      :hay-filtros="hayFiltros"
      @asignar="handleAsignar"
      @liberar="handleLiberar"
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