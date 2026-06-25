<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { ICharola } from '~/types/charola.type'
import { useClienteStore } from '~/store/cliente.store'

interface Props {
  item: ICharola
}

const props = defineProps<Props>()
const { close } = useModal()

const clienteStore = useClienteStore()

if (!clienteStore.items.length) {
  await clienteStore.fetch()
}

const clienteId = ref('')

const isValid = computed(() => !!clienteId.value)

function onSave() {
  if (!isValid.value) return
  close(clienteId.value)
}
</script>

<template>
  <div
    class="bg-surface border-border relative flex max-h-[90vh] w-[min(420px,92vw)] flex-col rounded-2xl border shadow-lg"
  >
    <!-- Header -->
    <div class="border-border flex shrink-0 items-center justify-between border-b px-5 py-4">
      <div>
        <h2 class="text-text text-[15px] font-semibold">Asignar charola</h2>
        <p class="text-muted mt-0.5 text-[12px]">{{ props.item.codigo }}</p>
      </div>
      <button
        class="text-muted hover:bg-muted-bg hover:text-text flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
        @click="close(false)"
      >
        <X :size="15" />
      </button>
    </div>

    <!-- Body -->
    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-subtle text-[12px] font-medium">
          Cliente <span class="text-error">*</span>
        </label>
        <select
          v-model="clienteId"
          class="border-border bg-subtle-bg text-text focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
        >
          <option value="" disabled>Selecciona un cliente</option>
          <option v-for="cliente in clienteStore.items" :key="cliente.id" :value="cliente.id">
            {{ cliente.nombre }}
          </option>
        </select>
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
        Asignar
      </button>
    </div>
  </div>
</template>
