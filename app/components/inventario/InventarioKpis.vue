<script setup lang="ts">
  import { Package, AlertTriangle, DollarSign } from 'lucide-vue-next'
  import { formatMXN } from '~/utils/formatters'

  interface Props {
    totalItems: number
    stockBajoCount: number
    valorTotal: number
  }

  const kpis: { label: string; icon: Component; description: string; total: number }[] = [
    {
      label: 'Total',
      icon: Package,
      description: 'Materias primas',
      total: 0,
    },
    {
      label: 'Stock Bajo',
      icon: AlertTriangle,
      description: 'requieren reposición',
      total: 0,
    },
    {
      label: 'Valor estandar',
      icon: DollarSign,
      description: 'en inventario',
      total: 0,
    },
  ]

  defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <div
      v-for="kpi in kpis"
      class="bg-subtle-bg border-border flex items-center rounded-sm border px-3 py-1 shadow-sm"
    >
      <component class="text-primary" :is="kpi.icon" />
      <div class="ml-3 flex flex-1 flex-col">
        <span class="flex text-base font-bold"> {{ kpi.label }}</span>
        <span class="text-subtle flex text-xs"> {{ kpi.description }}</span>
      </div>
      <div class="flex items-center px-4 text-base font-bold">
        <span>{{ formatMXN(kpi.total) }}</span>
      </div>
    </div>
  </div>
</template>
