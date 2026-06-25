<script setup lang="ts">
import { X, ArrowDownToLine, SlidersHorizontal, Trash2 } from 'lucide-vue-next'
import type { IMateriaPrima, IMovimientoInput } from '~/types/inventario.type'

interface Props {
  item: IMateriaPrima
  tipo?: 'entrada' | 'ajuste' | 'desperdicio'
}

const props = defineProps<Props>()
const { close } = useModal()

const tipoActivo = ref<'entrada' | 'ajuste' | 'desperdicio'>(props.tipo ?? 'entrada')

const form = reactive<IMovimientoInput & { notas: string; costoUnitario: number | undefined }>({
  cantidad: 0,
  unidad: props.item.unidadPrincipal,
  costoUnitario: undefined,
  notas: '',
})

const isValid = computed(() => Number(form.cantidad) > 0 && !!form.unidad.trim())

const tipoLabel: Record<string, string> = {
  entrada: 'Entrada',
  ajuste: 'Ajuste',
  desperdicio: 'Desperdicio',
}

function onSave() {
  if (!isValid.value) return
  const payload: IMovimientoInput & { tipo: string } = {
    tipo: tipoActivo.value,
    cantidad: Number(form.cantidad),
    unidad: form.unidad.trim(),
    notas: form.notas.trim() || undefined,
    costoUnitario:
      form.costoUnitario != null && form.costoUnitario !== undefined
        ? Number(form.costoUnitario)
        : undefined,
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
      <div>
        <h2 class="text-text text-[15px] font-semibold">Registrar movimiento</h2>
        <p class="text-muted mt-0.5 text-[12px]">{{ item.nombre }}</p>
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
      <!-- Selector de tipo (solo si no viene fijado) -->
      <div v-if="!props.tipo" class="bg-muted-bg mb-4 grid grid-cols-3 gap-1 rounded-xl p-1">
        <button
          v-for="t in ['entrada', 'ajuste', 'desperdicio'] as const"
          :key="t"
          class="flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12px] font-medium transition-colors"
          :class="
            tipoActivo === t
              ? 'bg-surface text-text shadow-xs'
              : 'text-subtle hover:text-text'
          "
          @click="tipoActivo = t"
        >
          <ArrowDownToLine v-if="t === 'entrada'" :size="12" />
          <SlidersHorizontal v-else-if="t === 'ajuste'" :size="12" />
          <Trash2 v-else :size="12" />
          {{ tipoLabel[t] }}
        </button>
      </div>

      <!-- Stock actual -->
      <div class="bg-muted-bg border-border mb-4 flex items-center justify-between rounded-xl border px-4 py-3">
        <span class="text-subtle text-[12px]">Stock actual</span>
        <span class="text-text text-[14px] font-semibold">
          {{ Number(item.stockActual).toLocaleString('es-MX', { maximumFractionDigits: 2 }) }}
          <span class="text-muted text-[12px] font-normal">{{ item.unidadPrincipal }}</span>
        </span>
      </div>

      <div class="flex flex-col gap-3.5">
        <!-- Cantidad + Unidad -->
        <div class="grid grid-cols-5 gap-3">
          <div class="col-span-3 flex flex-col gap-1.5">
            <label class="text-subtle text-[12px] font-medium">
              Cantidad <span class="text-error">*</span>
            </label>
            <input
              v-model="form.cantidad"
              type="number"
              min="0"
              step="0.01"
              inputmode="decimal"
              placeholder="0"
              class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
            />
          </div>
          <div class="col-span-2 flex flex-col gap-1.5">
            <label class="text-subtle text-[12px] font-medium">Unidad</label>
            <input
              v-model="form.unidad"
              type="text"
              placeholder="kg"
              class="border-border bg-subtle-bg text-text placeholder-muted focus:border-primary rounded-xl border px-3 py-2.5 text-[13px] outline-none transition-colors"
            />
          </div>
        </div>

        <!-- Costo unitario (solo entrada) -->
        <div v-if="tipoActivo === 'entrada'" class="flex flex-col gap-1.5">
          <label class="text-subtle text-[12px] font-medium">
            Costo por unidad ($)
            <span class="text-muted font-normal">opcional</span>
          </label>
          <input
            v-model="form.costoUnitario"
            type="number"
            min="0"
            step="0.01"
            inputmode="decimal"
            placeholder="0.00"
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
            placeholder="Observaciones del movimiento..."
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
        Registrar {{ tipoLabel[tipoActivo] }}
      </button>
    </div>
  </div>
</template>
