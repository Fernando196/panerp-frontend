<script setup lang="ts">
  import { Doughnut } from 'vue-chartjs'
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

  ChartJS.register(ArcElement, Tooltip, Legend)

  interface Props {
    pending: number
    inProcess: number
    ready: number
    canceled: number
  }

  const props = defineProps<Props>()

  const chartData = computed(() => ({
    labels: ['Pendiente', 'En proceso', 'Listo', 'Cancelado'],
    datasets: [
      {
        data: [props.pending, props.inProcess, props.ready, props.canceled],
        backgroundColor: ['#F59E0B', '#06B6D4', '#10B981', '#F43F5E'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  }))

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#334155',
          font: { size: 12 },
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 3,
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: { label: string; parsed: number }) => `  ${ctx.label}: ${ctx.parsed}`,
        },
      },
    },
  }

  const total = computed(() => props.pending + props.inProcess + props.ready + props.canceled)
</script>

<template>
  <div class="flex flex-col rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
    <p class="mb-1 text-sm font-semibold text-neutral-900">Estado de pedidos</p>
    <p class="mb-4 text-xs text-neutral-400">{{ total }} pedidos en total</p>
    <div class="relative" style="height: 200px">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
