<script setup lang="ts">
import { Factory, Scale, Coins } from 'lucide-vue-next'
import { formatMXN, formatNumber } from '~/utils/formatters'

interface Props {
  produccionesHoy: number
  cantidadHoy: number
  costoHoy: number
}

const props = defineProps<Props>()

const kpis = computed(() => [
  {
    label: 'Producciones hoy',
    value: String(props.produccionesHoy),
    icon: Factory,
    color: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    label: 'Cantidad hoy',
    value: formatNumber(props.cantidadHoy),
    icon: Scale,
    color: 'text-info',
    iconBg: 'bg-info/10',
  },
  {
    label: 'Costo hoy',
    value: formatMXN(props.costoHoy),
    icon: Coins,
    color: 'text-text',
    iconBg: 'bg-muted-bg',
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
