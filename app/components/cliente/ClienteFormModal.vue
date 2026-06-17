<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { ICliente, ICreateCliente } from '~/types/cliente.type'

interface Props {
  item?: ICliente
}

const props = defineProps<Props>()
const { close } = useModal()

const isEdit = computed(() => !!props.item?.id)

const tiposSugeridos = ['Tienda', 'Particular', 'Mayorista']

const form = reactive<ICreateCliente>({
  nombre: props.item?.nombre ?? '',
  telefono: props.item?.telefono ?? '',
  direccion: props.item?.direccion ?? '',
  tipoCliente: props.item?.tipoCliente ?? '',
})

const isValid = computed(() => !!form.nombre.trim())

function onSave() {
  if (!isValid.value) return
  const payload: ICreateCliente = {
    nombre: form.nombre.trim(),
  }
  if (form.telefono?.trim()) payload.telefono = form.telefono.trim()
  if (form.direccion?.trim()) payload.direccion = form.direccion.trim()
  if (form.tipoCliente?.trim()) payload.tipoCliente = form.tipoCliente.trim()
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
        {{ isEdit ? 'Editar cliente' : 'Nuevo cliente' }}
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
            placeholder="Ej. Tienda Don Beto"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Teléfono -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Teléfono</label>
          <input
            v-model="form.telefono"
            type="text"
            inputmode="tel"
            placeholder="Ej. 555 123 4567"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Tipo de cliente -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Tipo de cliente</label>
          <input
            v-model="form.tipoCliente"
            type="text"
            list="tipos-cliente-list"
            placeholder="Ej. Tienda"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
          <datalist id="tipos-cliente-list">
            <option v-for="tipo in tiposSugeridos" :key="tipo" :value="tipo" />
          </datalist>
        </div>

        <!-- Dirección -->
        <div class="col-span-2 flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">Dirección</label>
          <input
            v-model="form.direccion"
            type="text"
            placeholder="Ej. Calle Reforma 123, Centro"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
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
        {{ isEdit ? 'Guardar cambios' : 'Crear cliente' }}
      </button>
    </div>
  </div>
</template>
