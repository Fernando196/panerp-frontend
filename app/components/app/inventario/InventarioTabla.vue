<script setup lang="ts">
import { Package, ArrowDownToLine, SlidersHorizontal, Pencil, Trash2 } from 'lucide-vue-next'
import type { IMateriaPrima } from '~/types/inventario.type'
import { formatNumber, formatMXN } from '~/utils/formatters'

interface Props {
  items: IMateriaPrima[]
  loading: boolean
  hayFiltros: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  entrada: [item: IMateriaPrima]
  ajuste: [item: IMateriaPrima]
  editar: [item: IMateriaPrima]
  eliminar: [item: IMateriaPrima]
}>()

function stockPct(item: IMateriaPrima): number {
  const min = Number(item.stockMinimo)
  if (!min) return 100
  return Math.min(100, Math.round((Number(item.stockActual) / min) * 100))
}

function stockStatus(item: IMateriaPrima): 'ok' | 'low' | 'empty' {
  const actual = Number(item.stockActual)
  const min = Number(item.stockMinimo)
  if (actual <= 0) return 'empty'
  if (actual <= min) return 'low'
  return 'ok'
}

const statusConfig = {
  ok: { bar: 'bg-success', dot: 'bg-success', label: 'OK', labelClass: 'text-success' },
  low: { bar: 'bg-warning', dot: 'bg-warning', label: 'Stock bajo', labelClass: 'text-warning' },
  empty: { bar: 'bg-error', dot: 'bg-error', label: 'Sin stock', labelClass: 'text-error' },
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
      <Package :size="24" class="text-muted" />
    </div>
    <div>
      <p class="text-text text-sm font-semibold">Sin materias primas</p>
      <p class="text-muted mt-1 text-xs">
        {{ hayFiltros ? 'Prueba con otros filtros' : 'Agrega la primera materia prima' }}
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
      <!-- Nombre + stock actual -->
      <div class="flex items-start gap-3">
        <!-- Ícono con dot de status -->
        <div class="relative mt-0.5 shrink-0">
          <div class="bg-muted-bg flex h-9 w-9 items-center justify-center rounded-xl">
            <Package :size="15" class="text-muted" />
          </div>
          <span
            class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white"
            :class="statusConfig[stockStatus(item)].dot"
          />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <p class="text-text text-[13.5px] font-semibold leading-snug">{{ item.nombre }}</p>
            <div class="shrink-0 text-right">
              <p class="text-text text-[13px] font-bold">
                {{ formatNumber(item.stockActual) }}
                <span class="text-muted text-[11px] font-normal">{{ item.unidadPrincipal }}</span>
              </p>
            </div>
          </div>

          <div class="mt-1 flex flex-wrap items-center gap-1.5">
            <span
              v-if="item.categoria"
              class="border-border text-subtle rounded-full border px-2 py-0.5 text-[10px]"
            >
              {{ item.categoria }}
            </span>
            <span class="text-muted text-[10.5px]">
              {{ formatMXN(item.costoPorUnidad) }}/{{ item.unidadPrincipal }}
            </span>
          </div>
        </div>
      </div>

      <!-- Barra de stock -->
      <div class="mt-3.5">
        <div class="mb-1.5 flex items-center justify-between">
          <span class="text-muted text-[10.5px]">
            Mín {{ formatNumber(item.stockMinimo) }} {{ item.unidadPrincipal }}
          </span>
          <span
            class="text-[10.5px] font-medium"
            :class="statusConfig[stockStatus(item)].labelClass"
          >
            {{ statusConfig[stockStatus(item)].label }}
          </span>
        </div>
        <div class="bg-muted-bg h-1.5 w-full overflow-hidden rounded-full">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="statusConfig[stockStatus(item)].bar"
            :style="{ width: `${stockPct(item)}%` }"
          />
        </div>
      </div>

      <!-- Acciones -->
      <div class="border-border mt-3 flex items-center border-t pt-2.5">
        <button
          class="text-success/70 flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-success/10 hover:text-success"
          title="Registrar entrada"
          @click="emit('entrada', item)"
        >
          <ArrowDownToLine :size="15" />
        </button>
        <button
          class="text-info/70 flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-info/10 hover:text-info"
          title="Ajustar stock"
          @click="emit('ajuste', item)"
        >
          <SlidersHorizontal :size="15" />
        </button>

        <div class="ml-auto flex items-center gap-0.5">
          <button
            class="text-muted flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted-bg hover:text-text"
            title="Editar"
            @click="emit('editar', item)"
          >
            <Pencil :size="15" />
          </button>
          <button
            class="text-muted flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-error/10 hover:text-error"
            title="Eliminar"
            @click="emit('eliminar', item)"
          >
            <Trash2 :size="15" />
          </button>
        </div>
      </div>
    </div>

    <p class="text-muted pb-2 text-center text-[11px]">
      {{ items.length }} materia{{ items.length !== 1 ? 's primas' : ' prima' }}
    </p>
  </div>
</template>
