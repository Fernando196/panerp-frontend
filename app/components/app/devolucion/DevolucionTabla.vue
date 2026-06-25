<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next'
import type { IDevolucion } from '~/types/devolucion.type'
import { formatNumber, formatMXN, formatFecha } from '~/utils/formatters'

interface Props {
  items: IDevolucion[]
  loading: boolean
  hayFiltros: boolean
}

defineProps<Props>()
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
      <RotateCcw :size="24" class="text-muted" />
    </div>
    <div>
      <p class="text-text text-sm font-semibold">Sin devoluciones registradas</p>
      <p class="text-muted mt-1 text-xs">
        {{ hayFiltros ? 'Prueba con otros filtros' : 'Registra la primera devolución' }}
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
      <!-- Cliente + monto cobrado -->
      <div class="flex items-start gap-3">
        <div class="bg-muted-bg mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <RotateCcw :size="15" class="text-muted" />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <p class="text-text text-[13.5px] font-semibold leading-snug">
              {{ item.clienteNombre ?? 'Cliente' }}
            </p>
            <p class="text-success shrink-0 text-[13.5px] font-bold">
              {{ formatMXN(item.montoCobrado) }}
            </p>
          </div>
          <p class="text-muted mt-0.5 text-[11px]">{{ formatFecha(item.fecha) }}</p>
        </div>
      </div>

      <!-- Resumen de items -->
      <div class="border-border mt-3 flex flex-col gap-1 border-t pt-2.5">
        <div
          v-for="i in item.items"
          :key="i.productoId"
          class="flex items-center justify-between gap-2 text-[11.5px]"
        >
          <span class="text-subtle truncate">{{ i.productoNombre ?? 'Producto' }}</span>
          <span class="text-muted shrink-0">
            devuelto {{ formatNumber(i.cantidadDevuelta) }} de {{ formatNumber(i.cantidadEntregada) }}
          </span>
        </div>
      </div>
    </div>

    <p class="text-muted pb-2 text-center text-[11px]">
      {{ items.length }} devolución{{ items.length !== 1 ? 'es' : '' }}
    </p>
  </div>
</template>
