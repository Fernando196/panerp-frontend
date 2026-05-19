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
    class="relative flex max-h-[90vh] w-[min(520px,92vw)] flex-col rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
  >
    <!-- Header -->
    <div class="flex shrink-0 items-center justify-between border-b border-slate-800 px-5 py-4">
      <h2 class="text-[15px] font-semibold text-white">
        {{ isEdit ? 'Editar materia prima' : 'Nueva materia prima' }}
      </h2>
      <button
        class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
        @click="close(false)"
      >
        <X :size="15" />
      </button>
    </div>

    <!-- Body -->
    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
      <div class="grid grid-cols-2 gap-x-4 gap-y-3.5">
        <!-- Nombre -->
        <div class="col-span-2 flex flex-col gap-1">
          <label class="text-[12px] font-medium text-slate-400">Nombre <span class="text-error">*</span></label>
          <input
            v-model="form.nombre"
            type="text"
            placeholder="Ej. Harina de trigo"
            class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
          />
        </div>

        <!-- Categoría -->
        <div class="flex flex-col gap-1">
          <label class="text-[12px] font-medium text-slate-400">Categoría</label>
          <input
            v-model="form.categoria"
            type="text"
            list="categorias-list"
            placeholder="Ej. Harinas"
            class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
          />
          <datalist id="categorias-list">
            <option v-for="cat in categorias" :key="cat" :value="cat" />
          </datalist>
        </div>

        <!-- Lugar de compra -->
        <div class="flex flex-col gap-1">
          <label class="text-[12px] font-medium text-slate-400">Lugar de compra</label>
          <input
            v-model="form.lugarCompra"
            type="text"
            placeholder="Ej. Bodega Aurrerá"
            class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
          />
        </div>

        <!-- Unidad principal -->
        <div class="flex flex-col gap-1">
          <label class="text-[12px] font-medium text-slate-400">Unidad principal <span class="text-error">*</span></label>
          <input
            v-model="form.unidadPrincipal"
            type="text"
            placeholder="Ej. kg, L, pza"
            class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
          />
        </div>

        <!-- Costo por unidad -->
        <div class="flex flex-col gap-1">
          <label class="text-[12px] font-medium text-slate-400">Costo por unidad ($)</label>
          <input
            v-model="form.costoPorUnidad"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
          />
        </div>

        <!-- Stock inicial (solo en creación) -->
        <div v-if="!isEdit" class="flex flex-col gap-1">
          <label class="text-[12px] font-medium text-slate-400">Stock inicial</label>
          <input
            v-model="form.stockActual"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
          />
        </div>

        <!-- Stock mínimo -->
        <div class="flex flex-col gap-1">
          <label class="text-[12px] font-medium text-slate-400">Stock mínimo</label>
          <input
            v-model="form.stockMinimo"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
          />
        </div>

        <!-- Fecha de caducidad -->
        <div class="flex flex-col gap-1" :class="isEdit ? 'col-span-2' : ''">
          <label class="text-[12px] font-medium text-slate-400">Fecha de caducidad</label>
          <input
            v-model="form.fechaCaducidad"
            type="date"
            class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex shrink-0 items-center justify-end gap-2 border-t border-slate-800 px-5 py-3.5">
      <button
        class="rounded-lg border border-slate-700 px-4 py-2 text-[13px] font-medium text-slate-400 transition-colors hover:border-slate-600 hover:text-white"
        @click="close(false)"
      >
        Cancelar
      </button>
      <button
        class="rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!isValid"
        @click="onSave"
      >
        {{ isEdit ? 'Guardar cambios' : 'Crear materia prima' }}
      </button>
    </div>
  </div>
</template>
