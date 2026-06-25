<script setup lang="ts">
  import { Plus } from 'lucide-vue-next'
  import { useClienteStore } from '~/store/cliente.store'

  const store = useClienteStore()

  const { search, conSaldo, hayFiltros, itemsFiltrados, clearFiltros } = useClienteFiltros()
  const { handleCreate, handleEdit, handleDelete } = useClienteAcciones()

  await store.fetch()
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 pb-28 md:px-7 md:py-6">
    <PageHeader title="Clientes" subtitle="Consignación y saldos">
      <template #right>
        <button
          class="btn btn-primary btn-sm hidden items-center gap-1.5 md:inline-flex"
          @click="handleCreate"
        >
          <Plus :size="13" />
          Nuevo cliente
        </button>
      </template>
    </PageHeader>

    <ClienteKpis
      :total-clientes="store.items.length"
      :activos-count="store.activos.length"
      :saldo-pendiente-total="store.saldoPendienteTotal"
    />

    <ClienteFiltros
      v-model:search="search"
      v-model:con-saldo="conSaldo"
      :hay-filtros="hayFiltros"
      :loading="store.loading"
      @clear="clearFiltros"
      @refresh="store.fetch()"
    />

    <ClienteTabla
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
