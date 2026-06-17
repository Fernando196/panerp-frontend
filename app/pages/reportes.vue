<script setup lang="ts">
import { useReporteStore } from '~/store/reporte.store'
import PageHeader from '~/components/ui/PageHeader.vue'

const store = useReporteStore()
const { desde, hasta, aplicar } = useReporteFiltros()

await store.fetch({ desde: desde.value, hasta: hasta.value })
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4 pb-28 md:px-7 md:py-6">
    <PageHeader title="Reportes" subtitle="Ventas y desempeño" />

    <ReporteFiltros v-model:desde="desde" v-model:hasta="hasta" @aplicar="aplicar" />

    <template v-if="store.loading">
      <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div v-for="i in 4" :key="i" class="bg-muted-bg h-20 animate-pulse rounded-xl" />
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="bg-muted-bg h-72 animate-pulse rounded-xl" />
        <div class="bg-muted-bg h-72 animate-pulse rounded-xl" />
      </div>
    </template>

    <template v-else>
      <ReporteKpis :resumen="store.resumen" />

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <VentasLineChart :serie="store.resumen?.serieVentas ?? []" />
        <TopProductosChart :productos="store.resumen?.topProductos ?? []" />
      </div>
    </template>
  </div>
</template>
