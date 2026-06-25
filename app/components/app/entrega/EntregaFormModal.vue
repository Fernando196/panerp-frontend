<script setup lang="ts">
import { X, Plus, Trash2 } from 'lucide-vue-next'
import { useClienteStore } from '~/store/cliente.store'
import { useProductoStore } from '~/store/producto.store'
import { useCharolaStore } from '~/store/charola.store'
import type { ICreateEntrega, ICreateEntregaItem } from '~/types/entrega.type'
import { formatMXN } from '~/utils/formatters'

const { close } = useModal()

const clienteStore = useClienteStore()
const productoStore = useProductoStore()
const charolaStore = useCharolaStore()

if (!clienteStore.items.length) await clienteStore.fetch()
if (!productoStore.items.length) await productoStore.fetch()
if (!charolaStore.items.length) await charolaStore.fetch()

interface ItemRow {
  productoId: string
  cantidadEntregada: number
  precioUnitario: number
}

function nuevaFila(): ItemRow {
  return { productoId: '', cantidadEntregada: 1, precioUnitario: 0 }
}

const clienteId = ref('')
const filas = ref<ItemRow[]>([nuevaFila()])
const charolaIds = ref<string[]>([])
const notas = ref('')

function agregarFila() {
  filas.value.push(nuevaFila())
}

function eliminarFila(idx: number) {
  filas.value.splice(idx, 1)
}

function onProductoChange(fila: ItemRow) {
  const producto = productoStore.items.find((p) => p.id === fila.productoId)
  if (producto) fila.precioUnitario = Number(producto.precioVenta)
}

function toggleCharola(id: string) {
  const idx = charolaIds.value.indexOf(id)
  if (idx === -1) charolaIds.value.push(id)
  else charolaIds.value.splice(idx, 1)
}

const filasValidas = computed(() =>
  filas.value.filter(
    (f) => f.productoId && Number(f.cantidadEntregada) > 0 && Number(f.precioUnitario) >= 0,
  ),
)

const total = computed(() =>
  filasValidas.value.reduce(
    (sum, f) => sum + Number(f.cantidadEntregada) * Number(f.precioUnitario),
    0,
  ),
)

const isValid = computed(() => !!clienteId.value && filasValidas.value.length > 0)

function onSave() {
  if (!isValid.value) return
  const items: ICreateEntregaItem[] = filasValidas.value.map((f) => ({
    productoId: f.productoId,
    cantidadEntregada: Number(f.cantidadEntregada),
    precioUnitario: Number(f.precioUnitario),
  }))
  const payload: ICreateEntrega = {
    clienteId: clienteId.value,
    items,
  }
  if (charolaIds.value.length) payload.charolaIds = [...charolaIds.value]
  if (notas.value.trim()) payload.notas = notas.value.trim()
  close(payload)
}
</script>

<template>
  <div
    class="bg-surface border-border relative flex max-h-[90vh] w-[min(560px,92vw)] flex-col rounded-2xl border shadow-lg"
  >
    <!-- Header -->
    <div class="border-border flex shrink-0 items-center justify-between border-b px-5 py-4">
      <h2 class="text-text text-[15px] font-semibold">Nueva entrega</h2>
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
        <!-- Cliente -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Cliente <span class="text-error">*</span>
          </label>
          <select
            v-model="clienteId"
            class="border-border bg-subtle-bg text-text focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          >
            <option value="" disabled>Selecciona un cliente</option>
            <option v-for="c in clienteStore.items" :key="c.id" :value="c.id">
              {{ c.nombre }}
            </option>
          </select>
        </div>

        <!-- Productos a entregar -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="text-subtle text-[12px] font-medium">
              Productos a entregar <span class="text-error">*</span>
            </label>
            <button
              class="text-primary flex items-center gap-1 text-[11.5px] font-medium"
              @click="agregarFila"
            >
              <Plus :size="13" />
              Agregar producto
            </button>
          </div>

          <div class="flex flex-col gap-2.5">
            <div
              v-for="(fila, idx) in filas"
              :key="idx"
              class="bg-muted-bg border-border flex flex-col gap-2 rounded-xl border p-3"
            >
              <div class="flex items-center gap-2">
                <select
                  v-model="fila.productoId"
                  class="border-border bg-surface text-text focus:border-primary min-w-0 flex-1 rounded-lg border px-2.5 py-2 text-[12.5px] outline-none transition-colors"
                  @change="onProductoChange(fila)"
                >
                  <option value="" disabled>Selecciona producto</option>
                  <option v-for="p in productoStore.items" :key="p.id" :value="p.id">
                    {{ p.nombre }}
                  </option>
                </select>
                <button
                  class="text-muted hover:bg-error/10 hover:text-error flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                  :disabled="filas.length === 1"
                  :class="filas.length === 1 ? 'opacity-40' : ''"
                  @click="eliminarFila(idx)"
                >
                  <Trash2 :size="14" />
                </button>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div class="flex flex-col gap-1">
                  <label class="text-muted text-[10.5px] font-medium">Cantidad</label>
                  <input
                    v-model="fila.cantidadEntregada"
                    type="number"
                    min="0"
                    step="1"
                    inputmode="decimal"
                    placeholder="0"
                    class="border-border bg-surface text-text placeholder-muted focus:border-primary rounded-lg border px-2.5 py-2 text-[12.5px] outline-none transition-colors"
                  />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-muted text-[10.5px] font-medium">Precio unitario ($)</label>
                  <input
                    v-model="fila.precioUnitario"
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    placeholder="0.00"
                    class="border-border bg-surface text-text placeholder-muted focus:border-primary rounded-lg border px-2.5 py-2 text-[12.5px] outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charolas -->
        <div v-if="charolaStore.disponibles.length" class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Charolas <span class="text-muted font-normal">opcional</span>
          </label>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="ch in charolaStore.disponibles"
              :key="ch.id"
              type="button"
              class="shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors"
              :class="
                charolaIds.includes(ch.id)
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border bg-surface text-subtle hover:border-border-strong'
              "
              @click="toggleCharola(ch.id)"
            >
              {{ ch.codigo }}
            </button>
          </div>
        </div>

        <!-- Notas -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Notas <span class="text-muted font-normal">opcional</span>
          </label>
          <textarea
            v-model="notas"
            rows="2"
            placeholder="Observaciones de la entrega..."
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary resize-none rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Total -->
        <div class="bg-muted-bg border-border flex items-center justify-between rounded-xl border px-4 py-3">
          <span class="text-subtle text-[12px] font-medium">Total</span>
          <span class="text-text text-[16px] font-bold">{{ formatMXN(total) }}</span>
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
        Crear entrega
      </button>
    </div>
  </div>
</template>
