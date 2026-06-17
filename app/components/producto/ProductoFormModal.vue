<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { IProducto, ICreateProducto } from '~/types/producto.type'
import { useRecetaStore } from '~/store/receta.store'

interface Props {
  item?: IProducto
  categorias?: string[]
}

const props = defineProps<Props>()
const { close } = useModal()
const recetaStore = useRecetaStore()

const isEdit = computed(() => !!props.item?.id)

const form = reactive<ICreateProducto>({
  nombre: props.item?.nombre ?? '',
  categoria: props.item?.categoria ?? '',
  unidad: props.item?.unidad ?? '',
  precioVenta: props.item?.precioVenta ?? 0,
  costoEstimado: props.item?.costoEstimado ?? 0,
  recetaId: props.item?.recetaId ?? '',
})

const isValid = computed(
  () => !!form.nombre.trim() && !!form.unidad.trim() && Number(form.precioVenta) > 0,
)

onMounted(async () => {
  if (!recetaStore.items.length) await recetaStore.fetch()
})

function onSave() {
  if (!isValid.value) return
  const payload: ICreateProducto = {
    nombre: form.nombre.trim(),
    unidad: form.unidad.trim(),
    precioVenta: Number(form.precioVenta),
  }
  if (form.categoria?.trim()) payload.categoria = form.categoria.trim()
  if (form.costoEstimado) payload.costoEstimado = Number(form.costoEstimado)
  if (form.recetaId) payload.recetaId = form.recetaId
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
        {{ isEdit ? 'Editar producto' : 'Nuevo producto' }}
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
            placeholder="Ej. Concha de vainilla"
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
            placeholder="Ej. Pan dulce"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
          <datalist id="categorias-list">
            <option v-for="cat in categorias" :key="cat" :value="cat" />
          </datalist>
        </div>

        <!-- Unidad -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Unidad <span class="text-error">*</span>
          </label>
          <input
            v-model="form.unidad"
            type="text"
            placeholder="pza, kg"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Precio de venta -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Precio de venta ($) <span class="text-error">*</span>
          </label>
          <input
            v-model="form.precioVenta"
            type="number"
            min="0"
            step="0.01"
            inputmode="decimal"
            placeholder="0.00"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Costo estimado -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Costo estimado ($)</label>
          <input
            v-model="form.costoEstimado"
            type="number"
            min="0"
            step="0.01"
            inputmode="decimal"
            placeholder="0.00"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Receta vinculada -->
        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Receta vinculada</label>
          <select
            v-model="form.recetaId"
            class="border-border bg-subtle-bg text-text focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          >
            <option value="">Sin receta</option>
            <option v-for="receta in recetaStore.items" :key="receta.id" :value="receta.id">
              {{ receta.nombre }}
            </option>
          </select>
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
        {{ isEdit ? 'Guardar cambios' : 'Crear producto' }}
      </button>
    </div>
  </div>
</template>
