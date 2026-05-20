<script setup lang="ts">
import { Package, AlertTriangle, DollarSign } from 'lucide-vue-next'
import { formatMXN } from '~/utils/formatters'

interface Props {
  totalItems: number
  stockBajoCount: number
  valorTotal: number
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <div class="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-[11.5px] font-medium uppercase tracking-wider text-slate-500">Total</p>
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
          <Package :size="14" class="text-primary" />
        </div>
      </div>
      <p class="text-2xl font-bold text-white">{{ totalItems }}</p>
      <p class="mt-1 text-[12px] text-slate-500">materias primas</p>
    </div>

    <div class="rounded-xl border border-warning/20 bg-slate-900 p-4">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-[11.5px] font-medium uppercase tracking-wider text-slate-500">Stock bajo</p>
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10 ring-1 ring-warning/20">
          <AlertTriangle :size="14" class="text-warning" />
        </div>
      </div>
      <p class="text-2xl font-bold" :class="stockBajoCount > 0 ? 'text-warning' : 'text-white'">
        {{ stockBajoCount }}
      </p>
      <p class="mt-1 text-[12px] text-slate-500">requieren reposición</p>
    </div>

    <div class="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-[11.5px] font-medium uppercase tracking-wider text-slate-500">Valor est.</p>
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10 ring-1 ring-success/20">
          <DollarSign :size="14" class="text-success" />
        </div>
      </div>
      <p class="text-2xl font-bold text-white">{{ formatMXN(valorTotal) }}</p>
      <p class="mt-1 text-[12px] text-slate-500">en inventario</p>
    </div>
  </div>
</template>
