<script setup lang="ts">
import { Factory, CheckCircle, XCircle } from 'lucide-vue-next'
import type { IProduccion, EstadoProduccion } from '~/types/produccion.type'
import { formatNumber, formatMXN, formatFecha } from '~/utils/formatters'

interface Props {
  items: IProduccion[]
  loading: boolean
  hayFiltros: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  completar: [item: IProduccion]
  cancelar: [item: IProduccion]
}>()

const estadoConfig: Record<EstadoProduccion, { label: string; badge: string }> = {
  planificada: { label: 'Planificada', badge: 'border-border text-subtle bg-muted-bg' },
  en_proceso: { label: 'En proceso', badge: 'border-info/50 text-info bg-info/10' },
  completada: { label: 'Completada', badge: 'border-success/50 text-success bg-success/10' },
  cancelada: { label: 'Cancelada', badge: 'border-error/50 text-error bg-error/10' },
}

function puedeAccionar(item: IProduccion): boolean {
  return item.estado === 'planificada' || item.estado === 'en_proceso'
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
      <Factory :size="24" class="text-muted" />
    </div>
    <div>
      <p class="text-text text-sm font-semibold">Sin producciones registradas</p>
      <p class="text-muted mt-1 text-xs">
        {{ hayFiltros ? 'Prueba con otros filtros' : 'Registra la primera corrida de producción' }}
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
      <div class="flex items-start gap-3">
        <div class="bg-muted-bg mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <Factory :size="15" class="text-muted" />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <p class="text-text text-[13.5px] font-semibold leading-snug">
              {{ item.recetaNombre ?? 'Receta eliminada' }}
            </p>
            <div class="shrink-0 text-right">
              <p class="text-text text-[13px] font-bold">{{ formatMXN(item.costoTotal) }}</p>
            </div>
          </div>

          <div class="mt-1 flex flex-wrap items-center gap-1.5">
            <span class="text-muted text-[10.5px]">{{ formatFecha(item.fecha) }}</span>
            <span class="text-muted text-[10.5px]">·</span>
            <span class="text-muted text-[10.5px]">
              {{ formatNumber(item.cantidadProducida) }} {{ item.unidad }}
            </span>
          </div>
        </div>
      </div>

      <!-- Badge de estado -->
      <div class="mt-3 flex items-center justify-between">
        <span
          class="rounded-full border px-2.5 py-1 text-[10.5px] font-medium"
          :class="estadoConfig[item.estado].badge"
        >
          {{ estadoConfig[item.estado].label }}
        </span>
      </div>

      <!-- Acciones -->
      <div v-if="puedeAccionar(item)" class="border-border mt-3 flex items-center justify-end gap-2 border-t pt-2.5">
        <button
          class="text-success/80 hover:bg-success/10 hover:text-success flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors"
          @click="emit('completar', item)"
        >
          <CheckCircle :size="14" />
          Completar
        </button>
        <button
          class="text-error/80 hover:bg-error/10 hover:text-error flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors"
          @click="emit('cancelar', item)"
        >
          <XCircle :size="14" />
          Cancelar
        </button>
      </div>
    </div>

    <p class="text-muted pb-2 text-center text-[11px]">
      {{ items.length }} producci{{ items.length !== 1 ? 'ones' : 'ón' }}
    </p>
  </div>
</template>
