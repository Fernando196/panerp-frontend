<script setup lang="ts">
  import {
    Package,
    RefreshCcw,
    ArrowDownToLine,
    SlidersHorizontal,
    Pencil,
    Trash2,
  } from 'lucide-vue-next'
  import type { IMateriaPrima } from '~/types/inventario.type'
  import { formatNumber, formatMXN, formatFecha } from '~/utils/formatters'

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

  function stockColor(item: IMateriaPrima): string {
    const pct = stockPct(item)
    if (pct <= 25) return 'bg-error'
    if (pct <= 75) return 'bg-warning'
    return 'bg-success'
  }

  function esBajoStock(item: IMateriaPrima): boolean {
    return Number(item.stockActual) <= Number(item.stockMinimo)
  }
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-800">
    <!-- Estado de carga -->
    <div v-if="loading" class="flex items-center justify-center py-16 text-slate-500">
      <RefreshCcw :size="20" class="mr-2 animate-spin" />
      Cargando inventario...
    </div>

    <!-- Estado vacío -->
    <div
      v-else-if="!items.length"
      class="flex flex-col items-center justify-center gap-2 py-16 text-center"
    >
      <Package :size="32" class="text-slate-700" />
      <p class="text-[14px] font-medium text-slate-500">Sin materias primas</p>
      <p class="text-[13px] text-slate-600">
        {{ hayFiltros ? 'Prueba con otros filtros' : 'Agrega la primera materia prima' }}
      </p>
    </div>

    <!-- Tabla -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-slate-800 bg-slate-900/50">
            <th
              class="px-4 py-3 text-[11.5px] font-semibold tracking-wider text-slate-500 uppercase"
            >
              Nombre
            </th>
            <th
              class="px-4 py-3 text-[11.5px] font-semibold tracking-wider text-slate-500 uppercase"
            >
              Categoría
            </th>
            <th
              class="px-4 py-3 text-[11.5px] font-semibold tracking-wider text-slate-500 uppercase"
            >
              Stock
            </th>
            <th
              class="px-4 py-3 text-[11.5px] font-semibold tracking-wider text-slate-500 uppercase"
            >
              Costo / u
            </th>
            <th
              class="hidden px-4 py-3 text-[11.5px] font-semibold tracking-wider text-slate-500 uppercase md:table-cell"
            >
              Ult. compra
            </th>
            <th
              class="px-4 py-3 text-right text-[11.5px] font-semibold tracking-wider text-slate-500 uppercase"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          <tr v-for="item in items" :key="item.id" class="transition-colors hover:bg-slate-800/30">
            <!-- Nombre -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800"
                >
                  <Package :size="14" class="text-slate-400" />
                </div>
                <div>
                  <p class="text-[13px] font-medium text-white">{{ item.nombre }}</p>
                  <p v-if="item.lugarCompra" class="text-[11.5px] text-slate-500">
                    {{ item.lugarCompra }}
                  </p>
                </div>
              </div>
            </td>

            <!-- Categoría -->
            <td class="px-4 py-3">
              <span
                v-if="item.categoria"
                class="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11.5px] text-slate-300"
              >
                {{ item.categoria }}
              </span>
              <span v-else class="text-[13px] text-slate-600">—</span>
            </td>

            <!-- Stock con barra de progreso -->
            <td class="px-4 py-3">
              <div class="flex min-w-28 flex-col gap-1">
                <div class="flex items-baseline justify-between gap-1">
                  <span class="text-[13px] font-medium text-white">
                    {{ formatNumber(item.stockActual) }}
                    <span class="text-[11.5px] font-normal text-slate-400">{{
                      item.unidadPrincipal
                    }}</span>
                  </span>
                  <span
                    class="text-[11px] font-medium"
                    :class="esBajoStock(item) ? 'text-warning' : 'text-slate-500'"
                  >
                    mín {{ formatNumber(item.stockMinimo) }}
                  </span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="stockColor(item)"
                    :style="{ width: `${stockPct(item)}%` }"
                  />
                </div>
              </div>
            </td>

            <!-- Costo -->
            <td class="px-4 py-3">
              <span class="text-[13px] text-slate-300">{{ formatMXN(item.costoPorUnidad) }}</span>
            </td>

            <!-- Última compra -->
            <td class="hidden px-4 py-3 md:table-cell">
              <span class="text-[13px] text-slate-400">{{
                formatFecha(item.fechaUltimaCompra)
              }}</span>
            </td>

            <!-- Acciones -->
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-1">
                <button
                  class="hover:bg-success/10 hover:text-success flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors"
                  title="Registrar entrada"
                  @click="emit('entrada', item)"
                >
                  <ArrowDownToLine :size="14" />
                </button>

                <button
                  class="hover:bg-info/10 hover:text-info flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors"
                  title="Ajustar stock"
                  @click="emit('ajuste', item)"
                >
                  <SlidersHorizontal :size="14" />
                </button>

                <button
                  class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-700 hover:text-white"
                  title="Editar"
                  @click="emit('editar', item)"
                >
                  <Pencil :size="14" />
                </button>

                <button
                  class="hover:bg-error/10 hover:text-error flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors"
                  title="Eliminar"
                  @click="emit('eliminar', item)"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <p v-if="items.length" class="text-right text-[12px] text-slate-600">
    {{ items.length }} registro{{ items.length !== 1 ? 's' : '' }}
  </p>
</template>
