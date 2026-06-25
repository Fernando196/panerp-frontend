<script setup lang="ts">
import { BookOpen, Pencil, Trash2 } from 'lucide-vue-next'
import type { IReceta } from '~/types/receta.type'
import { formatMXN } from '~/utils/formatters'

interface Props {
  items: IReceta[]
  loading: boolean
  hayFiltros: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  editar: [item: IReceta]
  eliminar: [item: IReceta]
}>()

function resumenIngredientes(item: IReceta): string {
  const total = item.ingredientes.length
  if (!total) return 'Sin ingredientes'
  const nombres = item.ingredientes.slice(0, 3).map((i) => i.materiaPrimaNombre ?? '—')
  const restantes = total - nombres.length
  return restantes > 0 ? `${nombres.join(', ')} +${restantes} más` : nombres.join(', ')
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
      <BookOpen :size="24" class="text-muted" />
    </div>
    <div>
      <p class="text-text text-sm font-semibold">Sin recetas registradas</p>
      <p class="text-muted mt-1 text-xs">
        {{ hayFiltros ? 'Prueba con otros filtros' : 'Agrega la primera receta' }}
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
      <!-- Nombre + costo estimado -->
      <div class="flex items-start gap-3">
        <div class="bg-muted-bg mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <BookOpen :size="15" class="text-muted" />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <p class="text-text text-[13.5px] font-semibold leading-snug">{{ item.nombre }}</p>
            <p class="text-text shrink-0 text-[13px] font-bold">
              {{ formatMXN(item.costoEstimado) }}
            </p>
          </div>

          <p class="text-muted mt-0.5 text-[11.5px]">
            Rinde {{ item.rendimiento }} {{ item.unidadRendimiento }}
          </p>

          <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              v-if="item.productoNombre"
              class="border-border text-subtle rounded-full border px-2 py-0.5 text-[10px]"
            >
              {{ item.productoNombre }}
            </span>
          </div>
        </div>
      </div>

      <!-- Resumen de ingredientes -->
      <p class="text-muted mt-3 text-[11px] leading-snug">
        {{ resumenIngredientes(item) }}
      </p>

      <!-- Acciones -->
      <div class="border-border mt-3 flex items-center border-t pt-2.5">
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
      {{ items.length }} receta{{ items.length !== 1 ? 's' : '' }}
    </p>
  </div>
</template>
