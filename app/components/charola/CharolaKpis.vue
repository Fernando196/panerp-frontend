<script setup lang="ts">
import { Grid3X3, CheckCircle2, ArrowRightLeft } from 'lucide-vue-next'

interface Props {
  totalItems: number
  disponiblesCount: number
  enClienteCount: number
}

const props = defineProps<Props>()

const kpis = computed(() => [
  {
    label: 'Charolas',
    value: String(props.totalItems),
    icon: Grid3X3,
    color: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    label: 'Disponibles',
    value: String(props.disponiblesCount),
    icon: CheckCircle2,
    color: 'text-success',
    iconBg: 'bg-success/10',
  },
  {
    label: 'En cliente',
    value: String(props.enClienteCount),
    icon: ArrowRightLeft,
    color: 'text-info',
    iconBg: 'bg-info/10',
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
