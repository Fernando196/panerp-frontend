<script setup lang="ts">
import { X, Plus } from 'lucide-vue-next'
import type { IReceta, ICreateReceta } from '~/types/receta.type'
import { useInventarioStore } from '~/store/inventario.store'
import { useProductoStore } from '~/store/producto.store'

interface Props {
  item?: IReceta
}

const props = defineProps<Props>()
const { close } = useModal()

const inventarioStore = useInventarioStore()
const productoStore = useProductoStore()

if (!inventarioStore.items.length) await inventarioStore.fetch()
if (!productoStore.items.length) await productoStore.fetch()

const isEdit = computed(() => !!props.item?.id)

interface IngredienteRow {
  materiaPrimaId: string
  cantidad: number
  unidad: string
}

function nuevaFila(): IngredienteRow {
  return { materiaPrimaId: '', cantidad: 0, unidad: '' }
}

const form = reactive({
  nombre: props.item?.nombre ?? '',
  productoId: props.item?.productoId ?? '',
  rendimiento: props.item?.rendimiento ?? 0,
  unidadRendimiento: props.item?.unidadRendimiento ?? '',
  notas: props.item?.notas ?? '',
})

const ingredientes = reactive<IngredienteRow[]>(
  props.item?.ingredientes?.length
    ? props.item.ingredientes.map((i) => ({
        materiaPrimaId: i.materiaPrimaId,
        cantidad: i.cantidad,
        unidad: i.unidad,
      }))
    : [nuevaFila()],
)

function addIngrediente() {
  ingredientes.push(nuevaFila())
}

function removeIngrediente(index: number) {
  ingredientes.splice(index, 1)
}

function onMateriaPrimaChange(row: IngredienteRow) {
  const mp = inventarioStore.items.find((x) => x.id === row.materiaPrimaId)
  if (mp) row.unidad = mp.unidadPrincipal
}

const ingredientesValidos = computed(() =>
  ingredientes.filter((i) => !!i.materiaPrimaId && Number(i.cantidad) > 0),
)

const isValid = computed(
  () =>
    !!form.nombre.trim() &&
    Number(form.rendimiento) > 0 &&
    !!form.unidadRendimiento.trim() &&
    ingredientesValidos.value.length > 0,
)

function onSave() {
  if (!isValid.value) return
  const payload: ICreateReceta = {
    nombre: form.nombre.trim(),
    rendimiento: Number(form.rendimiento),
    unidadRendimiento: form.unidadRendimiento.trim(),
    ingredientes: ingredientesValidos.value.map((i) => ({
      materiaPrimaId: i.materiaPrimaId,
      cantidad: Number(i.cantidad),
      unidad: i.unidad.trim(),
    })),
  }
  if (form.productoId) payload.productoId = form.productoId
  if (form.notas.trim()) payload.notas = form.notas.trim()
  close(payload)
}
</script>

<template>
  <div
    class="bg-surface border-border relative flex max-h-[90vh] w-[min(560px,92vw)] flex-col rounded-2xl border shadow-lg"
  >
    <!-- Header -->
    <div class="border-border flex shrink-0 items-center justify-between border-b px-5 py-4">
      <h2 class="text-text text-[15px] font-semibold">
        {{ isEdit ? 'Editar receta' : 'Nueva receta' }}
      </h2>
      <button
        class="text-muted hover:bg-muted-bg hover:text-text flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
        @click="close(false)"
      >
        <X :size="15" />
      </button>
    </div>

    <!-- Body -->
    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
      <div class="grid grid-cols-2 gap-x-4 gap-y-4">
        <!-- Nombre -->
        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Nombre <span class="text-error">*</span>
          </label>
          <input
            v-model="form.nombre"
            type="text"
            placeholder="Ej. Pan de muerto"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Rendimiento -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Rendimiento <span class="text-error">*</span>
          </label>
          <input
            v-model="form.rendimiento"
            type="number"
            min="0"
            step="0.01"
            inputmode="decimal"
            placeholder="0"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Unidad de rendimiento -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Unidad <span class="text-error">*</span>
          </label>
          <input
            v-model="form.unidadRendimiento"
            type="text"
            placeholder="pza, kg"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Producto vinculado -->
        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Producto vinculado</label>
          <select
            v-model="form.productoId"
            class="border-border bg-subtle-bg text-text focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          >
            <option value="">Sin producto</option>
            <option v-for="prod in productoStore.items" :key="prod.id" :value="prod.id">
              {{ prod.nombre }}
            </option>
          </select>
        </div>

        <!-- Ingredientes -->
        <div class="col-span-2 flex flex-col gap-2">
          <label class="text-subtle text-[12px] font-medium">
            Ingredientes <span class="text-error">*</span>
          </label>

          <div
            v-for="(row, index) in ingredientes"
            :key="index"
            class="border-border bg-subtle-bg flex flex-col gap-2 rounded-xl border p-3"
          >
            <div class="flex items-center gap-2">
              <select
                v-model="row.materiaPrimaId"
                class="border-border bg-surface text-text focus:border-primary min-w-0 flex-1 rounded-lg border px-2.5 py-2 text-[12.5px] outline-none transition-colors"
                @change="onMateriaPrimaChange(row)"
              >
                <option value="" disabled>Selecciona materia prima</option>
                <option v-for="mp in inventarioStore.items" :key="mp.id" :value="mp.id">
                  {{ mp.nombre }}
                </option>
              </select>
              <button
                class="text-muted hover:bg-error/10 hover:text-error flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                title="Eliminar ingrediente"
                @click="removeIngrediente(index)"
              >
                <X :size="14" />
              </button>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model="row.cantidad"
                type="number"
                min="0"
                step="0.01"
                inputmode="decimal"
                placeholder="Cantidad"
                class="border-border bg-surface text-text placeholder-muted focus:border-primary min-w-0 flex-1 rounded-lg border px-2.5 py-2 text-[12.5px] outline-none transition-colors"
              />
              <input
                v-model="row.unidad"
                type="text"
                placeholder="Unidad"
                class="border-border bg-surface text-text placeholder-muted focus:border-primary min-w-0 flex-1 rounded-lg border px-2.5 py-2 text-[12.5px] outline-none transition-colors"
              />
            </div>
          </div>

          <button
            class="border-border text-subtle hover:border-border-strong hover:text-text flex items-center justify-center gap-1.5 rounded-xl border border-dashed py-2.5 text-[12.5px] font-medium transition-colors"
            @click="addIngrediente"
          >
            <Plus :size="13" />
            Agregar ingrediente
          </button>
        </div>

        <!-- Notas -->
        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Notas</label>
          <textarea
            v-model="form.notas"
            rows="3"
            placeholder="Notas adicionales (opcional)"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary resize-none rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
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
        {{ isEdit ? 'Guardar cambios' : 'Crear receta' }}
      </button>
    </div>
  </div>
</template>
