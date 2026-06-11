<script setup lang="ts">
  import { Plus, AlertTriangle, X } from 'lucide-vue-next'
  import { useInventarioStore } from '~/store/inventario.store'
  import { useAuthStore } from '~/store/auth.store'
  import PageHeader from '~/components/ui/PageHeader.vue'

  const store = useInventarioStore()
  const auth = useAuthStore()

  const { search, categoria, soloStockBajo, hayFiltros, clearFiltros } = useInventarioFiltros()
  const { errorMsg, handleCreate, handleEdit, handleEntrada, handleAjuste, handleDelete } =
    useInventarioAcciones()

  await store.fetch()
</script>

<template>
  <div class="w-full px-5 py-4 md:p-7">
    <PageHeader title="Inventario" subtitle="Materias primas y suministros">
      <template #right>
        <button
          class="btn btn-primary btn-sm inline-flex items-center gap-1.5"
          @click="handleCreate"
        >
          <Plus :size="13" />
          Nueva MP
        </button>
      </template>
    </PageHeader>

    <!-- KPIs -->
    <InventarioKpis
      class="mt-3"
      :total-items="store.items.length"
      :stock-bajo-count="store.stockBajoCount"
      :valor-total="store.valorTotal"
    />

    <!-- Error global -->
    <!-- <div
      v-if="errorMsg"
      class="border-error/30 bg-error/10 text-error flex items-center gap-2 rounded-lg border px-4 py-3 text-[13px]"
    >
      <AlertTriangle :size="14" />
      {{ errorMsg }}
      <button class="ml-auto" @click="errorMsg = ''">
        <X :size="13" />
      </button>
    </div> -->

    <!-- Filtros -->
    <!-- <InventarioFiltros
      v-model:search="search"
      v-model:categoria="categoria"
      v-model:solo-stock-bajo="soloStockBajo"
      :categorias="store.categorias"
      :hay-filtros="hayFiltros"
      :loading="store.loading"
      @clear="clearFiltros"
      @refresh="store.fetch()"
    /> -->

    <!-- Tabla -->
    <!-- <InventarioTabla
      :items="store.items"
      :loading="store.loading"
      :hay-filtros="hayFiltros"
      @entrada="handleEntrada"
      @ajuste="handleAjuste"
      @editar="handleEdit"
      @eliminar="handleDelete"
    /> -->
  </div>
</template>
