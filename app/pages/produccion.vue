<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useProduccionStore } from '~/store/produccion.store'
import PageHeader from '~/components/ui/PageHeader.vue'

const store = useProduccionStore()

const { search, estado, hayFiltros, clearFiltros } = useProduccionFiltros()
const { handleCreate, handleCompletar, handleCancelar } = useProduccionAcciones()

await store.fetch()
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 pb-28 md:px-7 md:py-6">
    <PageHeader title="Producción" subtitle="Registro de corridas de producción">
      <template #right>
        <button
          class="btn btn-primary btn-sm hidden items-center gap-1.5 md:inline-flex"
          @click="handleCreate"
        >
          <Plus :size="13" />
          Nueva producción
        </button>
      </template>
    </PageHeader>

    <ProduccionKpis
      :producciones-hoy="store.hoy.length"
      :cantidad-hoy="store.cantidadHoy"
      :costo-hoy="store.costoHoy"
    />

    <ProduccionFiltros
      v-model:search="search"
      v-model:estado="estado"
      :hay-filtros="hayFiltros"
      :loading="store.loading"
      @clear="clearFiltros"
      @refresh="store.fetch()"
    />

    <ProduccionTabla
      :items="store.items"
      :loading="store.loading"
      :hay-filtros="hayFiltros"
      @completar="handleCompletar"
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
