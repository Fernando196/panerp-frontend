<script setup lang="ts">
import { Truck, Banknote, Clock } from 'lucide-vue-next'
import { formatMXN } from '~/utils/formatters'

interface Props {
  entregasHoy: number
  montoHoy: number
  pendientesCount: number
}

const props = defineProps<Props>()

const kpis = computed(() => [
  {
    label: 'Entregas hoy',
    value: String(props.entregasHoy),
    icon: Truck,
    color: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    label: 'Monto hoy',
    value: formatMXN(props.montoHoy),
    icon: Banknote,
    color: 'text-text',
    iconBg: 'bg-muted-bg',
  },
  {
    label: 'Pendientes',
    value: String(props.pendientesCount),
    icon: Clock,
    color: props.pendientesCount > 0 ? 'text-warning' : 'text-success',
    iconBg: props.pendientesCount > 0 ? 'bg-warning/10' : 'bg-success/10',
  },
])
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
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
