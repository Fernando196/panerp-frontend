<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js'
import { formatMXN } from '~/utils/formatters'
import type { IReporteProductoTop } from '~/types/reporte.type'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

interface Props {
  productos: IReporteProductoTop[]
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.productos.map((p) => p.nombre),
  datasets: [
    {
      label: 'Monto vendido',
      data: props.productos.map((p) => p.monto),
      backgroundColor: '#e8a020',
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'bar'>) => ` ${formatMXN(ctx.parsed.x ?? 0)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: '#E2E8F0' },
      border: { display: false, dash: [4, 4] },
      ticks: {
        color: '#94A3B8',
        font: { size: 11 },
        callback: (v: string | number) => formatMXN(Number(v)),
      },
    },
    y: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#94A3B8', font: { size: 11 } },
    },
  },
}
</script>

<template>
  <div class="bg-surface border-border flex h-72 flex-col rounded-xl border p-4 shadow-xs">
    <p class="text-text mb-4 text-[13.5px] font-semibold">Productos más vendidos</p>
    <div v-if="productos.length" class="min-h-0 flex-1">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="flex flex-1 items-center justify-center">
      <p class="text-muted text-[13px]">Sin datos en este periodo</p>
    </div>
  </div>
</template>
