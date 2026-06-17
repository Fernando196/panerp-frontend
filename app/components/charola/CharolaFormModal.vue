<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { ICharola, ICreateCharola } from '~/types/charola.type'

interface Props {
  item?: ICharola
}

const props = defineProps<Props>()
const { close } = useModal()

const isEdit = computed(() => !!props.item?.id)

const form = reactive<ICreateCharola>({
  codigo: props.item?.codigo ?? '',
  notas: props.item?.notas ?? '',
})

const isValid = computed(() => !!form.codigo.trim())

function onSave() {
  if (!isValid.value) return
  const payload: ICreateCharola = {
    codigo: form.codigo.trim(),
  }
  if (form.notas?.trim()) payload.notas = form.notas.trim()
  close(payload)
}
</script>

<template>
  <div
    class="bg-surface border-border relative flex max-h-[90vh] w-[min(440px,92vw)] flex-col rounded-2xl border shadow-lg"
  >
    <!-- Header -->
    <div class="border-border flex shrink-0 items-center justify-between border-b px-5 py-4">
      <h2 class="text-text text-[15px] font-semibold">
        {{ isEdit ? 'Editar charola' : 'Nueva charola' }}
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
      <div class="flex flex-col gap-4">
        <!-- Código -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Código <span class="text-error">*</span>
          </label>
          <input
            v-model="form.codigo"
            type="text"
            placeholder="Ej. CH-001"
            class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          />
        </div>

        <!-- Notas -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Notas
            <span class="text-muted font-normal">opcional</span>
          </label>
          <textarea
            v-model="form.notas"
            rows="2"
            placeholder="Observaciones de la charola..."
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
        {{ isEdit ? 'Guardar cambios' : 'Crear charola' }}
      </button>
    </div>
  </div>
</template>
