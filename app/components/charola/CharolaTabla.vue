<script setup lang="ts">
import { Grid3X3, ArrowRightLeft, Undo2, Pencil, Trash2 } from 'lucide-vue-next'
import type { ICharola, EstadoCharola } from '~/types/charola.type'

interface Props {
  items: ICharola[]
  loading: boolean
  hayFiltros: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  asignar: [item: ICharola]
  liberar: [item: ICharola]
  editar: [item: ICharola]
  eliminar: [item: ICharola]
}>()

const estadoConfig: Record<EstadoCharola, { label: string; badge: string; dot: string }> = {
  disponible: { label: 'Disponible', badge: 'bg-success/10 text-success', dot: 'bg-success' },
  en_cliente: { label: 'En cliente', badge: 'bg-info/10 text-info', dot: 'bg-info' },
  en_transito: { label: 'En tránsito', badge: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  perdida: { label: 'Perdida', badge: 'bg-error/10 text-error', dot: 'bg-error' },
}
</script>

<template>
  <!-- Skeletons de carga -->
  <div v-if="loading" class="flex flex-col gap-2.5">
    <div
      v-for="n in 4"
      :key="n"
      class="bg-surface border-border h-24 animate-pulse rounded-xl border"
    />
  </div>

  <!-- Estado vacío -->
  <div v-else-if="!items.length" class="flex flex-col items-center gap-3 py-16 text-center">
    <div class="bg-muted-bg flex h-14 w-14 items-center justify-center rounded-2xl">
      <Grid3X3 :size="24" class="text-muted" />
    </div>
    <div>
      <p class="text-text text-sm font-semibold">Sin charolas registradas</p>
      <p class="text-muted mt-1 text-xs">
        {{ hayFiltros ? 'Prueba con otros filtros' : 'Agrega la primera charola' }}
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
        <!-- Ícono con dot de status -->
        <div class="relative mt-0.5 shrink-0">
          <div class="bg-muted-bg flex h-9 w-9 items-center justify-center rounded-xl">
            <Grid3X3 :size="15" class="text-muted" />
          </div>
          <span
            class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white"
            :class="estadoConfig[item.estado].dot"
          />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <p class="text-text text-[13.5px] font-semibold leading-snug">{{ item.codigo }}</p>
            <span
              class="shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium"
              :class="estadoConfig[item.estado].badge"
            >
              {{ estadoConfig[item.estado].label }}
            </span>
          </div>

          <p v-if="item.estado === 'en_cliente' && item.clienteNombre" class="text-muted mt-1 text-[11.5px]">
            {{ item.clienteNombre }}
          </p>
          <p v-else-if="item.notas" class="text-muted mt-1 truncate text-[11.5px]">
            {{ item.notas }}
          </p>
        </div>
      </div>

      <!-- Acciones -->
      <div class="border-border mt-3 flex items-center border-t pt-2.5">
        <button
          v-if="item.estado === 'disponible'"
          class="text-info/70 flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-info/10 hover:text-info"
          title="Asignar"
          @click="emit('asignar', item)"
        >
          <ArrowRightLeft :size="15" />
        </button>
        <button
          v-else-if="item.estado === 'en_cliente'"
          class="text-success/70 flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-success/10 hover:text-success"
          title="Liberar"
          @click="emit('liberar', item)"
        >
          <Undo2 :size="15" />
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
      {{ items.length }} charola{{ items.length !== 1 ? 's' : '' }}
    </p>
  </div>
</template>
