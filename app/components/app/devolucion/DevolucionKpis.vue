<script setup lang="ts">
import { RotateCcw, Banknote, Truck } from 'lucide-vue-next'
import { formatMXN } from '~/utils/formatters'

interface Props {
  devolucionesHoy: number
  montoCobradoHoy: number
  entregasPendientes: number
}

const props = defineProps<Props>()

const kpis = computed(() => [
  {
    label: 'Devoluciones hoy',
    value: String(props.devolucionesHoy),
    icon: RotateCcw,
    color: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    label: 'Cobrado hoy',
    value: formatMXN(props.montoCobradoHoy),
    icon: Banknote,
    color: 'text-success',
    iconBg: 'bg-success/10',
  },
  {
    label: 'Entregas pendientes',
    value: String(props.entregasPendientes),
    icon: Truck,
    color: props.entregasPendientes > 0 ? 'text-warning' : 'text-text',
    iconBg: props.entregasPendientes > 0 ? 'bg-warning/10' : 'bg-muted-bg',
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
