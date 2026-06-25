<script setup lang="ts">
import { DollarSign, TrendingUp, Truck, Users } from 'lucide-vue-next'
import { formatMXN } from '~/utils/formatters'
import type { IReporteResumen } from '~/types/reporte.type'

interface Props {
  resumen: IReporteResumen | null
}

const props = defineProps<Props>()

const kpis = computed(() => {
  const entregasPendientes = props.resumen?.entregasPendientes ?? 0

  return [
    {
      label: 'Ventas hoy',
      value: props.resumen ? formatMXN(props.resumen.ventasHoy) : '—',
      icon: DollarSign,
      color: 'text-primary',
      iconBg: 'bg-primary/10',
    },
    {
      label: 'Ventas del mes',
      value: props.resumen ? formatMXN(props.resumen.ventasMes) : '—',
      icon: TrendingUp,
      color: 'text-text',
      iconBg: 'bg-muted-bg',
    },
    {
      label: 'Entregas pendientes',
      value: props.resumen ? String(entregasPendientes) : '—',
      icon: Truck,
      color: entregasPendientes > 0 ? 'text-warning' : 'text-success',
      iconBg: entregasPendientes > 0 ? 'bg-warning/10' : 'bg-success/10',
    },
    {
      label: 'Saldo clientes',
      value: props.resumen ? formatMXN(props.resumen.saldoClientesPendiente) : '—',
      icon: Users,
      color: 'text-text',
      iconBg: 'bg-muted-bg',
    },
  ]
})
</script>

<template>
  <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
    <div
      v-for="kpi in kpis"
      :key="kpi.label"
      class="bg-surface border-border flex flex-col gap-2 rounded-xl border p-3 shadow-xs"
    >
      <div class="flex items-center justify-between">
        <span class="text-subtle text-[10.5px] font-medium uppercase tracking-wide">{{ kpi.label }}</span>
        <div :class="[kpi.iconBg, 'flex h-5 w-5 items-center justify-center rounded-md']">
          <component :is="kpi.icon" :size="11" :class="kpi.color" />
        </div>
      </div>
      <span class="text-text truncate text-[15px] font-bold leading-none">{{ kpi.value }}</span>
    </div>
  </div>
</template>
