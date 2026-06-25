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
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

interface Props {
  labels: string[]
  data: number[]
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Ingresos',
      data: props.data,
      borderColor: '#007b6c',
      backgroundColor: 'rgba(0,123,108,0.08)',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#4F46E5',
      tension: 0.4,
      fill: true,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: { parsed: { y: number } }) =>
          ` $${ctx.parsed.y.toLocaleString('es-MX')} MXN`,
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
        callback: (v: string | number) => `$${Number(v).toLocaleString('es-MX')}`,
      },
    },
  },
}
</script>

<template>
  <div class="flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
    <p class="mb-4 text-sm font-semibold text-neutral-900">Ingresos — últimos 30 días</p>
    <div class="min-h-0 flex-1">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
