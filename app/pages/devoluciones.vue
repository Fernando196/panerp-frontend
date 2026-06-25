<script setup lang="ts">
  import { Plus } from 'lucide-vue-next'
  import { useDevolucionStore } from '~/store/devolucion.store'
  import { useEntregaStore } from '~/store/entrega.store'
  import PageHeader from '~/components/ui/PageHeader.vue'

  const store = useDevolucionStore()
  const entregaStore = useEntregaStore()

  const { search, hayFiltros } = useDevolucionFiltros()
  const { handleCreate } = useDevolucionAcciones()

  await Promise.all([store.fetch(), entregaStore.fetch()])
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 pb-28 md:px-7 md:py-6">
    <PageHeader title="Devoluciones" subtitle="Cierre de consignación y cobro">
      <template #right>
        <button
          class="btn btn-primary btn-sm hidden items-center gap-1.5 md:inline-flex"
          @click="handleCreate"
        >
          <Plus :size="13" />
          Nueva devolución
        </button>
      </template>
    </PageHeader>

    <DevolucionKpis
      :devoluciones-hoy="store.hoy.length"
      :monto-cobrado-hoy="store.montoCobradoHoy"
      :entregas-pendientes="entregaStore.pendientes.length"
    />

    <DevolucionFiltros v-model:search="search" :loading="store.loading" @refresh="store.fetch()" />

    <DevolucionTabla :items="store.items" :loading="store.loading" :hay-filtros="hayFiltros" />
  </div>

  <!-- FAB móvil -->
  <button
    class="bg-primary hover:bg-primary-dark fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-95 md:hidden"
    @click="handleCreate"
  >
    <Plus :size="22" />
  </button>
</template>
