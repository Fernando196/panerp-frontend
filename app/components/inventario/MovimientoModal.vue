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
    costoUnitario: form.costoUnitario != null && form.costoUnitario !== undefined
      ? Number(form.costoUnitario)
      : undefined,
  }
  close(payload)
}
</script>

<template>
  <div
    class="relative flex max-h-[90vh] w-[min(440px,92vw)] flex-col rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
  >
    <!-- Header -->
    <div class="flex shrink-0 items-center justify-between border-b border-slate-800 px-5 py-4">
      <div>
        <h2 class="text-[15px] font-semibold text-white">Registrar movimiento</h2>
        <p class="mt-0.5 text-[12px] text-slate-500">{{ item.nombre }}</p>
      </div>
      <button
        class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
        @click="close(false)"
      >
        <X :size="15" />
      </button>
    </div>

    <!-- Body -->
    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
      <!-- Tipo selector (solo si no viene fijado) -->
      <div v-if="!props.tipo" class="mb-4 grid grid-cols-3 gap-1.5 rounded-lg bg-slate-800 p-1">
        <button
          v-for="t in ['entrada', 'ajuste', 'desperdicio'] as const"
          :key="t"
          class="flex items-center justify-center gap-1.5 rounded-md py-1.5 text-[12px] font-medium transition-colors"
          :class="
            tipoActivo === t
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          "
          @click="tipoActivo = t"
        >
          <ArrowDownToLine v-if="t === 'entrada'" :size="12" />
          <SlidersHorizontal v-else-if="t === 'ajuste'" :size="12" />
          <Trash2 v-else :size="12" />
          {{ tipoLabel[t] }}
        </button>
      </div>

      <!-- Stock actual info -->
      <div class="mb-4 flex items-center justify-between rounded-lg bg-slate-800/60 px-4 py-3">
        <span class="text-[12px] text-slate-400">Stock actual</span>
        <span class="text-[14px] font-semibold text-white">
          {{ Number(item.stockActual).toLocaleString('es-MX', { maximumFractionDigits: 2 }) }}
          <span class="text-[12px] font-normal text-slate-400">{{ item.unidadPrincipal }}</span>
        </span>
      </div>

      <div class="flex flex-col gap-3.5">
        <!-- Cantidad + Unidad -->
        <div class="grid grid-cols-5 gap-3">
          <div class="col-span-3 flex flex-col gap-1">
            <label class="text-[12px] font-medium text-slate-400">
              Cantidad <span class="text-error">*</span>
            </label>
            <input
              v-model="form.cantidad"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
            />
          </div>
          <div class="col-span-2 flex flex-col gap-1">
            <label class="text-[12px] font-medium text-slate-400">Unidad</label>
            <input
              v-model="form.unidad"
              type="text"
              placeholder="kg"
              class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
            />
          </div>
        </div>

        <!-- Costo unitario (solo entrada) -->
        <div v-if="tipoActivo === 'entrada'" class="flex flex-col gap-1">
          <label class="text-[12px] font-medium text-slate-400">Costo por unidad ($) <span class="text-slate-600">opcional</span></label>
          <input
            v-model="form.costoUnitario"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
          />
        </div>

        <!-- Notas -->
        <div class="flex flex-col gap-1">
          <label class="text-[12px] font-medium text-slate-400">Notas <span class="text-slate-600">opcional</span></label>
          <textarea
            v-model="form.notas"
            rows="2"
            placeholder="Observaciones del movimiento..."
            class="resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
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
        Registrar {{ tipoLabel[tipoActivo] }}
      </button>
    </div>
  </div>
</template>
