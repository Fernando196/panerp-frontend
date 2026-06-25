<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js'
import { formatMXN, formatFecha } from '~/utils/formatters'
import type { IReportePunto } from '~/types/reporte.type'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

interface Props {
  serie: IReportePunto[]
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.serie.map((p) => formatFecha(p.fecha)),
  datasets: [
    {
      label: 'Ventas',
      data: props.serie.map((p) => p.total),
      borderColor: '#e8a020',
      backgroundColor: 'rgba(232,160,32,0.12)',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#e8a020',
      tension: 0.4,
      fill: true,
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'line'>) => ` ${formatMXN(ctx.parsed.y ?? 0)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#94A3B8', font: { size: 11 }, maxTicksLimit: 10 },
    },
    y: {
      grid: { color: '#E2E8F0' },
      border: { display: false, dash: [4, 4] },
      ticks: {
        color: '#94A3B8',
        font: { size: 11 },
        callback: (v: string | number) => formatMXN(Number(v)),
      },
    },
  },
}
</script>

<template>
  <div class="bg-surface border-border flex h-72 flex-col rounded-xl border p-4 shadow-xs">
    <p class="text-text mb-4 text-[13.5px] font-semibold">Ventas en el periodo</p>
    <div class="min-h-0 flex-1">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
