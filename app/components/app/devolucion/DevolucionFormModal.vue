<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useEntregaStore } from '~/store/entrega.store'
import type { ICreateDevolucion } from '~/types/devolucion.type'
import { formatMXN, formatFecha } from '~/utils/formatters'

const { close } = useModal()
const entregaStore = useEntregaStore()

if (!entregaStore.items.length) await entregaStore.fetch()

const entregaId = ref('')

interface ItemDevuelto {
  productoId: string
  productoNombre: string | null
  cantidadEntregada: number
  precioUnitario: number
  cantidadDevuelta: number
}

const itemsForm = ref<ItemDevuelto[]>([])

const entregaSeleccionada = computed(() =>
  entregaStore.pendientes.find((e) => e.id === entregaId.value),
)

watch(entregaSeleccionada, (entrega) => {
  itemsForm.value = entrega
    ? entrega.items.map((i) => ({
        productoId: i.productoId,
        productoNombre: i.productoNombre,
        cantidadEntregada: i.cantidadEntregada,
        precioUnitario: i.precioUnitario,
        cantidadDevuelta: 0,
      }))
    : []
})

function vendido(item: ItemDevuelto): number {
  return Math.max(0, item.cantidadEntregada - Number(item.cantidadDevuelta || 0))
}

function importeVendido(item: ItemDevuelto): number {
  return vendido(item) * item.precioUnitario
}

const montoACobrar = computed(() =>
  itemsForm.value.reduce((sum, item) => sum + importeVendido(item), 0),
)

const isValid = computed(() => !!entregaId.value && itemsForm.value.length > 0)

function onSave() {
  if (!isValid.value) return
  const payload: ICreateDevolucion = {
    entregaId: entregaId.value,
    items: itemsForm.value.map((i) => ({
      productoId: i.productoId,
      cantidadDevuelta: Number(i.cantidadDevuelta || 0),
    })),
  }
  close(payload)
}
</script>

<template>
  <div
    class="bg-surface border-border relative flex max-h-[90vh] w-[min(520px,92vw)] flex-col rounded-2xl border shadow-lg"
  >
    <!-- Header -->
    <div class="border-border flex shrink-0 items-center justify-between border-b px-5 py-4">
      <h2 class="text-text text-[15px] font-semibold">Nueva devolución</h2>
      <button
        class="text-muted hover:bg-muted-bg hover:text-text flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
        @click="close(false)"
      >
        <X :size="15" />
      </button>
    </div>

    <!-- Body -->
    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
      <div class="flex flex-col gap-4">
        <!-- Entrega -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Entrega pendiente <span class="text-error">*</span>
          </label>
          <select
            v-model="entregaId"
            class="border-border bg-subtle-bg text-text focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          >
            <option value="" disabled>Selecciona una entrega</option>
            <option v-for="entrega in entregaStore.pendientes" :key="entrega.id" :value="entrega.id">
              {{ entrega.clienteNombre ?? 'Cliente' }} — {{ formatFecha(entrega.fecha) }}
            </option>
          </select>
        </div>

        <!-- Items de la entrega -->
        <div v-if="itemsForm.length" class="flex flex-col gap-2.5">
          <div
            v-for="item in itemsForm"
            :key="item.productoId"
            class="border-border bg-subtle-bg flex flex-col gap-2 rounded-xl border p-3"
          >
            <div class="flex items-center justify-between gap-2">
              <p class="text-text text-[12.5px] font-semibold leading-snug">
                {{ item.productoNombre ?? 'Producto' }}
              </p>
              <span class="text-muted shrink-0 text-[11px]">
                Entregado: {{ item.cantidadEntregada }}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex flex-1 flex-col gap-1">
                <label class="text-subtle text-[11px] font-medium">Devuelto</label>
                <input
                  v-model.number="item.cantidadDevuelta"
                  type="number"
                  min="0"
                  :max="item.cantidadEntregada"
                  inputmode="decimal"
                  class="border-border bg-surface text-text placeholder-muted focus:border-primary h-10 rounded-lg border px-3 text-[13px] outline-none transition-colors"
                />
              </div>

              <div class="shrink-0 text-right">
                <p class="text-muted text-[11px]">Vendido: {{ vendido(item) }}</p>
                <p class="text-text text-[12.5px] font-semibold">{{ formatMXN(importeVendido(item)) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Monto a cobrar -->
        <div
          v-if="itemsForm.length"
          class="border-border bg-success/10 flex items-center justify-between rounded-xl border px-4 py-3"
        >
          <span class="text-text text-[13px] font-semibold">Monto a cobrar</span>
          <span class="text-success text-[16px] font-bold">{{ formatMXN(montoACobrar) }}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-border flex shrink-0 items-center justify-end gap-2 border-t px-5 py-3.5">
      <button
        class="border-border text-subtle hover:border-border-strong hover:text-text rounded-xl border px-4 py-2 text-[13px] font-medium transition-colors"
        @click="close(false)"
      >
        Cancelar
      </button>
      <button
        class="bg-primary hover:bg-primary-dark rounded-xl px-4 py-2 text-[13px] font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!isValid"
        @click="onSave"
      >
        Registrar devolución
      </button>
    </div>
  </div>
</template>
