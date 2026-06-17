<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useEntregaStore } from '~/store/entrega.store'
import PageHeader from '~/components/ui/PageHeader.vue'

const store = useEntregaStore()

const { search, estado, hayFiltros, clearFiltros } = useEntregaFiltros()
const { handleCreate, handleCancelar } = useEntregaAcciones()

await store.fetch()
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 pb-28 md:px-7 md:py-6">
    <PageHeader title="Entregas" subtitle="Consignación a clientes">
      <template #right>
        <button
          class="btn btn-primary btn-sm hidden items-center gap-1.5 md:inline-flex"
          @click="handleCreate"
        >
          <Plus :size="13" />
          Nueva entrega
        </button>
      </template>
    </PageHeader>

    <EntregaKpis
      :entregas-hoy="store.hoy.length"
      :monto-hoy="store.montoHoy"
      :pendientes-count="store.pendientes.length"
    />

    <EntregaFiltros
      v-model:search="search"
      v-model:estado="estado"
      :hay-filtros="hayFiltros"
      :loading="store.loading"
      @clear="clearFiltros"
      @refresh="store.fetch()"
    />

    <EntregaTabla
      :items="store.items"
      :loading="store.loading"
      :hay-filtros="hayFiltros"
      @cancelar="handleCancelar"
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
