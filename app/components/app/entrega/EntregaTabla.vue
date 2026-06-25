<script setup lang="ts">
import { Truck, XCircle } from 'lucide-vue-next'
import type { IEntrega, EstadoEntrega } from '~/types/entrega.type'
import { formatNumber, formatMXN, formatFecha } from '~/utils/formatters'

interface Props {
  items: IEntrega[]
  loading: boolean
  hayFiltros: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  cancelar: [item: IEntrega]
}>()

const estadoConfig: Record<EstadoEntrega, { label: string; dot: string; badge: string }> = {
  pendiente: { label: 'Pendiente', dot: 'bg-warning', badge: 'bg-warning/10 text-warning' },
  entregada: { label: 'Entregada', dot: 'bg-success', badge: 'bg-success/10 text-success' },
  parcial: { label: 'Parcial', dot: 'bg-info', badge: 'bg-info/10 text-info' },
  cancelada: { label: 'Cancelada', dot: 'bg-error', badge: 'bg-error/10 text-error' },
}

function resumenItems(item: IEntrega): string[] {
  return item.items
    .slice(0, 3)
    .map((i) => `${i.productoNombre ?? 'Producto'} x${formatNumber(i.cantidadEntregada)}`)
}

function puedeCancelar(item: IEntrega): boolean {
  return item.estado === 'pendiente' || item.estado === 'parcial'
}
</script>

<template>
  <!-- Skeletons de carga -->
  <div v-if="loading" class="flex flex-col gap-2.5">
    <div
      v-for="n in 4"
      :key="n"
      class="bg-surface border-border h-28 animate-pulse rounded-xl border"
    />
  </div>

  <!-- Estado vacío -->
  <div v-else-if="!items.length" class="flex flex-col items-center gap-3 py-16 text-center">
    <div class="bg-muted-bg flex h-14 w-14 items-center justify-center rounded-2xl">
      <Truck :size="24" class="text-muted" />
    </div>
    <div>
      <p class="text-text text-sm font-semibold">Sin entregas registradas</p>
      <p class="text-muted mt-1 text-xs">
        {{ hayFiltros ? 'Prueba con otros filtros' : 'Registra la primera entrega' }}
      </p>
    </div>
  </div>

  <!-- Cards -->
  <div v-else class="flex flex-col gap-2.5">
    <div
      v-for="item in items"
      :key="item.id"
      class="bg-surface border-border rounded-xl border p-4 shadow-xs"
    >
      <!-- Cliente + monto -->
      <div class="flex items-start gap-3">
        <!-- Ícono con dot de status -->
        <div class="relative mt-0.5 shrink-0">
          <div class="bg-muted-bg flex h-9 w-9 items-center justify-center rounded-xl">
            <Truck :size="15" class="text-muted" />
          </div>
          <span
            class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white"
            :class="estadoConfig[item.estado].dot"
          />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <p class="text-text text-[13.5px] font-semibold leading-snug">
              {{ item.clienteNombre ?? 'Cliente' }}
            </p>
            <p class="text-text shrink-0 text-[13px] font-bold">{{ formatMXN(item.montoTotal) }}</p>
          </div>

          <div class="mt-1 flex flex-wrap items-center gap-1.5">
            <span class="text-muted text-[10.5px]">{{ formatFecha(item.fecha) }}</span>
            <span class="text-muted text-[10.5px]">·</span>
            <span class="text-muted text-[10.5px]">
              {{ item.items.length }} producto{{ item.items.length !== 1 ? 's' : '' }}
            </span>
            <span
              class="rounded-full px-2 py-0.5 text-[10px] font-medium"
              :class="estadoConfig[item.estado].badge"
            >
              {{ estadoConfig[item.estado].label }}
            </span>
          </div>
        </div>
      </div>

      <!-- Resumen de items -->
      <div v-if="item.items.length" class="bg-muted-bg mt-3 flex flex-col gap-1 rounded-lg px-3 py-2">
        <p v-for="(linea, idx) in resumenItems(item)" :key="idx" class="text-subtle text-[11.5px]">
          {{ linea }}
        </p>
        <p v-if="item.items.length > 3" class="text-muted text-[10.5px]">
          +{{ item.items.length - 3 }} más
        </p>
      </div>

      <!-- Acciones -->
      <div v-if="puedeCancelar(item)" class="border-border mt-3 flex items-center border-t pt-2.5">
        <button
          class="text-error/80 hover:bg-error/10 hover:text-error flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors"
          @click="emit('cancelar', item)"
        >
          <XCircle :size="14" />
          Cancelar
        </button>
      </div>
    </div>

    <p class="text-muted pb-2 text-center text-[11px]">
      {{ items.length }} entrega{{ items.length !== 1 ? 's' : '' }}
    </p>
  </div>
</template>
