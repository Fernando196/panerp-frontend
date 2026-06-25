<script setup lang="ts">
  import { Plus } from 'lucide-vue-next'
  import { useProductoStore } from '~/store/producto.store'
  import PageHeader from '~/components/ui/PageHeader.vue'

  const store = useProductoStore()

  const { search, categoria, soloActivos, hayFiltros, clearFiltros } = useProductoFiltros()
  const { handleCreate, handleEdit, handleDelete } = useProductoAcciones()

  const itemsFiltrados = computed(() =>
    soloActivos.value ? store.items.filter((x) => x.activo) : store.items
  )

  await store.fetch()
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 pb-28 md:px-7 md:py-6">
    <PageHeader title="Productos" subtitle="Catálogo de productos terminados">
      <template #right>
        <button
          class="btn btn-primary btn-sm hidden items-center gap-1.5 md:inline-flex"
          @click="handleCreate"
        >
          <Plus :size="13" />
          Nuevo producto
        </button>
      </template>
    </PageHeader>

    <ProductoKpis
      :total-items="store.items.length"
      :activos-count="store.activos.length"
      :precio-promedio="store.precioPromedio"
    />

    <ProductoFiltros
      v-model:search="search"
      v-model:categoria="categoria"
      v-model:solo-activos="soloActivos"
      :categorias="store.categorias"
      :hay-filtros="hayFiltros"
      :loading="store.loading"
      @clear="clearFiltros"
      @refresh="store.fetch()"
    />

    <ProductoTabla
      :items="itemsFiltrados"
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
