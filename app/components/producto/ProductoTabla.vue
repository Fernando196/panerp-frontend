<script setup lang="ts">
import { ShoppingBag, BookOpen, Pencil, Trash2 } from 'lucide-vue-next'
import type { IProducto } from '~/types/producto.type'
import { formatMXN } from '~/utils/formatters'

interface Props {
  items: IProducto[]
  loading: boolean
  hayFiltros: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  editar: [item: IProducto]
  eliminar: [item: IProducto]
}>()
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
      <ShoppingBag :size="24" class="text-muted" />
    </div>
    <div>
      <p class="text-text text-sm font-semibold">Sin productos</p>
      <p class="text-muted mt-1 text-xs">
        {{ hayFiltros ? 'Prueba con otros filtros' : 'Agrega el primer producto' }}
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
      <!-- Nombre + precio -->
      <div class="flex items-start gap-3">
        <!-- Ícono con dot de status -->
        <div class="relative mt-0.5 shrink-0">
          <div class="bg-muted-bg flex h-9 w-9 items-center justify-center rounded-xl">
            <ShoppingBag :size="15" class="text-muted" />
          </div>
          <span
            class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white"
            :class="item.activo ? 'bg-success' : 'bg-muted'"
          />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <p class="text-text text-[13.5px] font-semibold leading-snug">{{ item.nombre }}</p>
            <div class="shrink-0 text-right">
              <p class="text-text text-[13px] font-bold">
                {{ formatMXN(item.precioVenta) }}
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
            <span v-if="item.costoEstimado" class="text-muted text-[10.5px]">
              Costo: {{ formatMXN(item.costoEstimado) }}
            </span>
            <span class="text-muted text-[10.5px]">/{{ item.unidad }}</span>
          </div>
        </div>
      </div>

      <!-- Badges de receta y estado -->
      <div class="mt-3.5 flex items-center justify-between">
        <span
          v-if="item.recetaNombre"
          class="border-info/50 bg-info/10 text-info flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px]"
        >
          <BookOpen :size="10" />
          {{ item.recetaNombre }}
        </span>
        <span v-else class="text-muted text-[10.5px]">Sin receta vinculada</span>

        <span
          class="text-[10.5px] font-medium"
          :class="item.activo ? 'text-success' : 'text-muted'"
        >
          {{ item.activo ? 'Activo' : 'Inactivo' }}
        </span>
      </div>

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
      {{ items.length }} producto{{ items.length !== 1 ? 's' : '' }}
    </p>
  </div>
</template>
