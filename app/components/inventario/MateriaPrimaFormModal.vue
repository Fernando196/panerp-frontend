<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { IMateriaPrima, ICreateMateriaPrima } from '~/types/inventario.type'

interface Props {
  item?: IMateriaPrima
  categorias?: string[]
}

const props = defineProps<Props>()
const { close } = useModal()

const isEdit = computed(() => !!props.item?.id)

const form = reactive<ICreateMateriaPrima>({
  nombre: props.item?.nombre ?? '',
  categoria: props.item?.categoria ?? '',
  lugarCompra: props.item?.lugarCompra ?? '',
  unidadPrincipal: props.item?.unidadPrincipal ?? '',
  costoPorUnidad: props.item?.costoPorUnidad ?? 0,
  stockActual: props.item?.stockActual ?? 0,
  stockMinimo: props.item?.stockMinimo ?? 0,
  fechaCaducidad: props.item?.fechaCaducidad ?? '',
})

const isValid = computed(() => !!form.nombre.trim() && !!form.unidadPrincipal.trim())

function onSave() {
  if (!isValid.value) return
  const payload: ICreateMateriaPrima = {
    nombre: form.nombre.trim(),
    unidadPrincipal: form.unidadPrincipal.trim(),
    costoPorUnidad: Number(form.costoPorUnidad),
    stockActual: Number(form.stockActual),
    stockMinimo: Number(form.stockMinimo),
  }
  if (form.categoria?.trim()) payload.categoria = form.categoria.trim()
  if (form.lugarCompra?.trim()) payload.lugarCompra = form.lugarCompra.trim()
  if (form.fechaCaducidad) payload.fechaCaducidad = form.fechaCaducidad
  close(payload)
}
</script>

<template>
  <div
    class="bg-surface border-border relative flex max-h-[90vh] w-[min(520px,92vw)] flex-col rounded-2xl border shadow-lg"
  >
    <!-- Header -->
    <div class="border-border flex shrink-0 items-center justify-between border-b px-5 py-4">
      <h2 class="text-text text-[15px] font-semibold">
        {{ isEdit ? 'Editar materia prima' : 'Nueva materia prima' }}
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
            placeholder="Ej. Harina de trigo"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Categoría -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Categoría</label>
          <input
            v-model="form.categoria"
            type="text"
            list="categorias-list"
            placeholder="Ej. Harinas"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
          <datalist id="categorias-list">
            <option v-for="cat in categorias" :key="cat" :value="cat" />
          </datalist>
        </div>

        <!-- Lugar de compra -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Lugar de compra</label>
          <input
            v-model="form.lugarCompra"
            type="text"
            placeholder="Ej. Bodega Aurrerá"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Unidad principal -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Unidad <span class="text-error">*</span>
          </label>
          <input
            v-model="form.unidadPrincipal"
            type="text"
            placeholder="kg, L, pza"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Costo por unidad -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Costo por unidad ($)</label>
          <input
            v-model="form.costoPorUnidad"
            type="number"
            min="0"
            step="0.01"
            inputmode="decimal"
            placeholder="0.00"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Stock inicial (solo creación) -->
        <div v-if="!isEdit" class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Stock inicial</label>
          <input
            v-model="form.stockActual"
            type="number"
            min="0"
            step="0.01"
            inputmode="decimal"
            placeholder="0"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Stock mínimo -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Stock mínimo</label>
          <input
            v-model="form.stockMinimo"
            type="number"
            min="0"
            step="0.01"
            inputmode="decimal"
            placeholder="0"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Fecha de caducidad -->
        <div class="flex flex-col gap-1.5" :class="isEdit ? 'col-span-2' : ''">
          <label class="text-subtle text-[12px] font-medium">Fecha de caducidad</label>
          <input
            v-model="form.fechaCaducidad"
            type="date"
            class="border-border bg-subtle-bg text-text focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
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
        {{ isEdit ? 'Guardar cambios' : 'Crear materia prima' }}
      </button>
    </div>
  </div>
</template>
