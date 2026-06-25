<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useRecetaStore } from '~/store/receta.store'
import type { ICreateProduccion } from '~/types/produccion.type'

const { close } = useModal()
const recetaStore = useRecetaStore()

if (!recetaStore.items.length) {
  await recetaStore.fetch()
}

const form = reactive<ICreateProduccion>({
  recetaId: '',
  cantidadProducida: 0,
  notas: '',
})

const isValid = computed(() => !!form.recetaId && Number(form.cantidadProducida) > 0)

function onSave() {
  if (!isValid.value) return
  const payload: ICreateProduccion = {
    recetaId: form.recetaId,
    cantidadProducida: Number(form.cantidadProducida),
    notas: form.notas?.trim() || undefined,
  }
  close(payload)
}
</script>

<template>
  <div
    class="bg-surface border-border relative flex max-h-[90vh] w-[min(440px,92vw)] flex-col rounded-2xl border shadow-lg"
  >
    <!-- Header -->
    <div class="border-border flex shrink-0 items-center justify-between border-b px-5 py-4">
      <h2 class="text-text text-[15px] font-semibold">Nueva producción</h2>
      <button
        class="text-muted hover:bg-muted-bg hover:text-text flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
        @click="close(false)"
      >
        <X :size="15" />
      </button>
    </div>

    <!-- Body -->
    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
      <div class="flex flex-col gap-3.5">
        <!-- Receta -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Receta <span class="text-error">*</span>
          </label>
          <select
            v-model="form.recetaId"
            class="border-border bg-subtle-bg text-text focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
          >
            <option value="" disabled>Selecciona una receta</option>
            <option v-for="receta in recetaStore.items" :key="receta.id" :value="receta.id">
              {{ receta.nombre }} (rinde {{ receta.rendimiento }} {{ receta.unidadRendimiento }})
            </option>
          </select>
        </div>

        <!-- Cantidad producida -->
        <div class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Cantidad producida <span class="text-error">*</span>
          </label>
          <input
            v-model="form.cantidadProducida"
            type="number"
            min="0"
            step="0.01"
            inputmode="decimal"
            placeholder="0"
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
            placeholder="Observaciones de la producción..."
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
        Crear producción
      </button>
    </div>
  </div>
</template>
