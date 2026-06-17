<script setup lang="ts">
import { Users, Phone, MapPin, Pencil, Trash2 } from 'lucide-vue-next'
import type { ICliente } from '~/types/cliente.type'
import { formatMXN } from '~/utils/formatters'

interface Props {
  items: ICliente[]
  loading: boolean
  hayFiltros: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  editar: [item: ICliente]
  eliminar: [item: ICliente]
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
      <Users :size="24" class="text-muted" />
    </div>
    <div>
      <p class="text-text text-sm font-semibold">Sin clientes</p>
      <p class="text-muted mt-1 text-xs">
        {{ hayFiltros ? 'Prueba con otros filtros' : 'Agrega el primer cliente' }}
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
      <!-- Nombre + saldo -->
      <div class="flex items-start gap-3">
        <!-- Ícono con dot de status -->
        <div class="relative mt-0.5 shrink-0">
          <div class="bg-muted-bg flex h-9 w-9 items-center justify-center rounded-xl">
            <Users :size="15" class="text-muted" />
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
              <p
                class="text-[13px] font-bold"
                :class="Number(item.saldoPendiente) > 0 ? 'text-warning' : 'text-success'"
              >
                {{ formatMXN(item.saldoPendiente) }}
              </p>
            </div>
          </div>

          <div class="mt-1 flex flex-wrap items-center gap-1.5">
            <span
              v-if="item.tipoCliente"
              class="border-border text-subtle rounded-full border px-2 py-0.5 text-[10px]"
            >
              {{ item.tipoCliente }}
            </span>
            <span
              class="rounded-full border px-2 py-0.5 text-[10px]"
              :class="
                item.activo
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-border text-muted'
              "
            >
              {{ item.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </div>

          <div class="mt-1.5 flex flex-col gap-0.5">
            <span v-if="item.telefono" class="text-muted flex items-center gap-1 text-[10.5px]">
              <Phone :size="11" />
              {{ item.telefono }}
            </span>
            <span v-if="item.direccion" class="text-muted flex items-center gap-1 text-[10.5px]">
              <MapPin :size="11" />
              {{ item.direccion }}
            </span>
          </div>
        </div>
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
      {{ items.length }} cliente{{ items.length !== 1 ? 's' : '' }}
    </p>
  </div>
</template>
