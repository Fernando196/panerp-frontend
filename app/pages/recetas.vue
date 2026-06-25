<script setup lang="ts">
  import { Plus } from 'lucide-vue-next'
  import { useRecetaStore } from '~/store/receta.store'
  import PageHeader from '~/components/ui/PageHeader.vue'

  const store = useRecetaStore()

  const { search, hayFiltros, clearFiltros } = useRecetaFiltros()
  const { handleCreate, handleEdit, handleDelete } = useRecetaAcciones()

  await store.fetch()

  const vinculadasCount = computed(() => store.items.filter((x) => !!x.productoId).length)
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 pb-28 md:px-7 md:py-6">
    <PageHeader title="Recetas" subtitle="Fórmulas de producción">
      <template #right>
        <button
          class="btn btn-primary btn-sm hidden items-center gap-1.5 md:inline-flex"
          @click="handleCreate"
        >
          <Plus :size="13" />
          Nueva receta
        </button>
      </template>
    </PageHeader>

    <RecetaKpis
      :total-recetas="store.items.length"
      :costo-promedio="store.costoPromedio"
      :vinculadas-count="vinculadasCount"
    />

    <RecetaFiltros
      v-model:search="search"
      :hay-filtros="hayFiltros"
      :loading="store.loading"
      @clear="clearFiltros"
      @refresh="store.fetch()"
    />

    <RecetaTabla
      :items="store.items"
      :loading="store.loading"
      :hay-filtros="hayFiltros"
      @editar="handleEdit"
      @eliminar="handleDelete"
    />
  </div>

  <!-- FAB móvil -->
  <button
    class="bg-primary hover:bg-primary-dark fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-95 md:hidden"
    @click="handleCreate"
  >
    <Plus :size="22" />
  </button>
</template>
