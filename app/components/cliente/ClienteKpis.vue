<script setup lang="ts">
import { Users, UserCheck, Wallet } from 'lucide-vue-next'
import { formatMXN } from '~/utils/formatters'

interface Props {
  totalClientes: number
  activosCount: number
  saldoPendienteTotal: number
}

const props = defineProps<Props>()

const kpis = computed(() => [
  {
    label: 'Clientes',
    value: String(props.totalClientes),
    icon: Users,
    color: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    label: 'Activos',
    value: String(props.activosCount),
    icon: UserCheck,
    color: 'text-success',
    iconBg: 'bg-success/10',
  },
  {
    label: 'Saldo pendiente',
    value: formatMXN(props.saldoPendienteTotal),
    icon: Wallet,
    color: props.saldoPendienteTotal > 0 ? 'text-warning' : 'text-text',
    iconBg: props.saldoPendienteTotal > 0 ? 'bg-warning/10' : 'bg-muted-bg',
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
