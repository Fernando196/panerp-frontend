<script setup lang="ts">
import {
  Package,
  AlertTriangle,
  DollarSign,
  Plus,
  Search,
  ChevronDown,
  Pencil,
  Trash2,
  ArrowDownToLine,
  SlidersHorizontal,
  X,
  RefreshCcw,
} from 'lucide-vue-next'
import MateriaPrimaFormModal from '~/components/inventario/MateriaPrimaFormModal.vue'
import MovimientoModal from '~/components/inventario/MovimientoModal.vue'
import ConfirmModal from '~/components/common/Modal/ConfirmModal.vue'
import type { IMateriaPrima } from '~/types/inventario.type'

definePageMeta({ layout: 'pan-erp', middleware: 'auth' })

const store = useInventarioStore()
const auth = useAuthStore()
const { openModal } = useModal()

// ── Filtros ──────────────────────────────────────────────
const search = ref('')
const categoriaFiltro = ref('')
const soloStockBajo = ref(false)
const categoriasOpen = ref(false)

const searchDebounced = refDebounced(search, 300)

watch([searchDebounced, categoriaFiltro, soloStockBajo], () => {
  store.fetch({
    search: searchDebounced.value || undefined,
    categoria: categoriaFiltro.value || undefined,
    stockBajo: soloStockBajo.value ? 'true' : undefined,
  })
})

await store.fetch()

// ── KPIs ─────────────────────────────────────────────────
const totalItems = computed(() => store.items.length)

// ── Tabla ────────────────────────────────────────────────
function stockPct(item: IMateriaPrima) {
  const min = Number(item.stockMinimo)
  if (!min) return 100
  return Math.min(100, Math.round((Number(item.stockActual) / min) * 100))
}

function stockColor(item: IMateriaPrima) {
  const pct = stockPct(item)
  if (pct <= 25) return 'bg-error'
  if (pct <= 75) return 'bg-warning'
  return 'bg-success'
}

function stockLabel(item: IMateriaPrima) {
  if (Number(item.stockActual) <= Number(item.stockMinimo)) return 'bajo'
  return 'ok'
}

function fmt(n: number | string, decimals = 2) {
  return Number(n).toLocaleString('es-MX', { maximumFractionDigits: decimals, minimumFractionDigits: 0 })
}

function fmtMoneda(n: number | string) {
  return Number(n).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}

function fmtFecha(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Acciones ─────────────────────────────────────────────
const saving = ref(false)
const errorMsg = ref('')

async function handleCreate() {
  const result = await openModal(MateriaPrimaFormModal, {
    categorias: store.categorias,
  })
  if (!result) return
  saving.value = true
  errorMsg.value = ''
  try {
    await store.create(result)
  } catch (e) {
    errorMsg.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al crear'
  } finally {
    saving.value = false
  }
}

async function handleEdit(item: IMateriaPrima) {
  const result = await openModal(MateriaPrimaFormModal, {
    item,
    categorias: store.categorias,
  })
  if (!result) return
  saving.value = true
  errorMsg.value = ''
  try {
    await store.update(item.id, result)
  } catch (e) {
    errorMsg.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al actualizar'
  } finally {
    saving.value = false
  }
}

async function handleEntrada(item: IMateriaPrima) {
  const result = await openModal(MovimientoModal, { item, tipo: 'entrada' })
  if (!result) return
  saving.value = true
  errorMsg.value = ''
  try {
    await store.registrarEntrada(item.id, result)
  } catch (e) {
    errorMsg.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al registrar entrada'
  } finally {
    saving.value = false
  }
}

async function handleAjuste(item: IMateriaPrima) {
  const result = await openModal(MovimientoModal, { item, tipo: 'ajuste' })
  if (!result) return
  saving.value = true
  errorMsg.value = ''
  try {
    await store.registrarAjuste(item.id, result)
  } catch (e) {
    errorMsg.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al registrar ajuste'
  } finally {
    saving.value = false
  }
}

async function handleDelete(item: IMateriaPrima) {
  const ok = await openModal(ConfirmModal, {
    title: `Eliminar ${item.nombre}`,
    message: '¿Estás seguro? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
  })
  if (!ok) return
  saving.value = true
  errorMsg.value = ''
  try {
    await store.remove(item.id)
  } catch (e) {
    errorMsg.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al eliminar'
  } finally {
    saving.value = false
  }
}

function clearFiltros() {
  search.value = ''
  categoriaFiltro.value = ''
  soloStockBajo.value = false
}

const hayFiltros = computed(() => !!search.value || !!categoriaFiltro.value || soloStockBajo.value)
</script>

<template>
  <div class="w-full space-y-5 p-5 pb-10 md:p-7">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-white">Inventario</h1>
        <p class="mt-0.5 text-[13px] text-slate-500">Materias primas y suministros</p>
      </div>
      <button class="btn btn-primary btn-sm inline-flex items-center gap-1.5" @click="handleCreate">
        <Plus :size="13" />
        Nueva materia prima
      </button>
    </div>

    <!-- KPI cards -->
    <div class="grid grid-cols-3 gap-3">
      <div class="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div class="mb-2 flex items-center justify-between">
          <p class="text-[11.5px] font-medium uppercase tracking-wider text-slate-500">Total</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <Package :size="14" class="text-primary" />
          </div>
        </div>
        <p class="text-2xl font-bold text-white">{{ totalItems }}</p>
        <p class="mt-1 text-[12px] text-slate-500">materias primas</p>
      </div>

      <div class="rounded-xl border border-warning/20 bg-slate-900 p-4">
        <div class="mb-2 flex items-center justify-between">
          <p class="text-[11.5px] font-medium uppercase tracking-wider text-slate-500">Stock bajo</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10 ring-1 ring-warning/20">
            <AlertTriangle :size="14" class="text-warning" />
          </div>
        </div>
        <p class="text-2xl font-bold" :class="store.stockBajoCount > 0 ? 'text-warning' : 'text-white'">
          {{ store.stockBajoCount }}
        </p>
        <p class="mt-1 text-[12px] text-slate-500">requieren reposición</p>
      </div>

      <div class="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div class="mb-2 flex items-center justify-between">
          <p class="text-[11.5px] font-medium uppercase tracking-wider text-slate-500">Valor est.</p>
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10 ring-1 ring-success/20">
            <DollarSign :size="14" class="text-success" />
          </div>
        </div>
        <p class="text-2xl font-bold text-white">{{ fmtMoneda(store.valorTotal) }}</p>
        <p class="mt-1 text-[12px] text-slate-500">en inventario</p>
      </div>
    </div>

    <!-- Error global -->
    <div
      v-if="errorMsg"
      class="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-[13px] text-error"
    >
      <AlertTriangle :size="14" />
      {{ errorMsg }}
      <button class="ml-auto" @click="errorMsg = ''"><X :size="13" /></button>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Search -->
      <div class="relative min-w-48 flex-1">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          v-model="search"
          type="text"
          placeholder="Buscar materia prima..."
          class="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-8 pr-3 text-[13px] text-white placeholder-slate-600 outline-none transition-colors focus:border-primary"
        />
      </div>

      <!-- Categoría -->
      <div class="relative">
        <button
          class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[13px] text-slate-300 transition-colors hover:border-slate-600"
          :class="categoriaFiltro ? 'border-primary/60 text-primary' : ''"
          @click="categoriasOpen = !categoriasOpen"
        >
          {{ categoriaFiltro || 'Categoría' }}
          <ChevronDown :size="13" class="text-slate-500" :class="categoriasOpen ? 'rotate-180' : ''" />
        </button>
        <div
          v-if="categoriasOpen"
          class="absolute left-0 top-full z-20 mt-1 min-w-44 rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-lg"
          @mouseleave="categoriasOpen = false"
        >
          <button
            class="w-full px-3 py-1.5 text-left text-[13px] text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            @click="categoriaFiltro = ''; categoriasOpen = false"
          >
            Todas
          </button>
          <button
            v-for="cat in store.categorias"
            :key="cat"
            class="w-full px-3 py-1.5 text-left text-[13px] transition-colors hover:bg-slate-800"
            :class="categoriaFiltro === cat ? 'text-primary' : 'text-slate-300'"
            @click="categoriaFiltro = cat; categoriasOpen = false"
          >
            {{ cat }}
          </button>
          <p v-if="!store.categorias.length" class="px-3 py-2 text-[12px] text-slate-600">
            Sin categorías
          </p>
        </div>
      </div>

      <!-- Stock bajo toggle -->
      <button
        class="flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors"
        :class="
          soloStockBajo
            ? 'border-warning/40 bg-warning/10 text-warning'
            : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200'
        "
        @click="soloStockBajo = !soloStockBajo"
      >
        <AlertTriangle :size="13" />
        Stock bajo
      </button>

      <!-- Limpiar filtros -->
      <button
        v-if="hayFiltros"
        class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] text-slate-500 transition-colors hover:text-slate-300"
        @click="clearFiltros"
      >
        <X :size="12" />
        Limpiar
      </button>

      <!-- Refresh -->
      <button
        class="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-500 transition-colors hover:border-slate-600 hover:text-slate-300"
        :class="store.loading ? 'animate-spin' : ''"
        :disabled="store.loading"
        @click="store.fetch()"
      >
        <RefreshCcw :size="14" />
      </button>
    </div>

    <!-- Tabla -->
    <div class="overflow-hidden rounded-xl border border-slate-800">
      <!-- Loading -->
      <div v-if="store.loading" class="flex items-center justify-center py-16 text-slate-500">
        <RefreshCcw :size="20" class="mr-2 animate-spin" />
        Cargando inventario...
      </div>

      <!-- Empty -->
      <div
        v-else-if="!store.items.length"
        class="flex flex-col items-center justify-center gap-2 py-16 text-center"
      >
        <Package :size="32" class="text-slate-700" />
        <p class="text-[14px] font-medium text-slate-500">Sin materias primas</p>
        <p class="text-[13px] text-slate-600">
          {{ hayFiltros ? 'Prueba con otros filtros' : 'Agrega la primera materia prima' }}
        </p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-slate-800 bg-slate-900/50">
              <th class="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
                Nombre
              </th>
              <th class="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
                Categoría
              </th>
              <th class="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
                Stock
              </th>
              <th class="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
                Costo / u
              </th>
              <th class="hidden px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
                Ult. compra
              </th>
              <th class="px-4 py-3 text-right text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr
              v-for="item in store.items"
              :key="item.id"
              class="transition-colors hover:bg-slate-800/30"
            >
              <!-- Nombre -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5">
                  <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800"
                  >
                    <Package :size="14" class="text-slate-400" />
                  </div>
                  <div>
                    <p class="text-[13px] font-medium text-white">{{ item.nombre }}</p>
                    <p v-if="item.lugarCompra" class="text-[11.5px] text-slate-500">
                      {{ item.lugarCompra }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Categoría -->
              <td class="px-4 py-3">
                <span
                  v-if="item.categoria"
                  class="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11.5px] text-slate-300"
                >
                  {{ item.categoria }}
                </span>
                <span v-else class="text-[13px] text-slate-600">—</span>
              </td>

              <!-- Stock -->
              <td class="px-4 py-3">
                <div class="flex min-w-28 flex-col gap-1">
                  <div class="flex items-baseline justify-between gap-1">
                    <span class="text-[13px] font-medium text-white">
                      {{ fmt(item.stockActual) }}
                      <span class="text-[11.5px] font-normal text-slate-400">
                        {{ item.unidadPrincipal }}
                      </span>
                    </span>
                    <span
                      class="text-[11px] font-medium"
                      :class="stockLabel(item) === 'bajo' ? 'text-warning' : 'text-slate-500'"
                    >
                      mín {{ fmt(item.stockMinimo) }}
                    </span>
                  </div>
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="stockColor(item)"
                      :style="{ width: `${stockPct(item)}%` }"
                    />
                  </div>
                </div>
              </td>

              <!-- Costo -->
              <td class="px-4 py-3">
                <span class="text-[13px] text-slate-300">
                  {{ fmtMoneda(item.costoPorUnidad) }}
                </span>
              </td>

              <!-- Ult. compra -->
              <td class="hidden px-4 py-3 md:table-cell">
                <span class="text-[13px] text-slate-400">
                  {{ fmtFecha(item.fechaUltimaCompra) }}
                </span>
              </td>

              <!-- Acciones -->
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1">
                  <!-- Entrada -->
                  <button
                    class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-success/10 hover:text-success"
                    title="Registrar entrada"
                    @click="handleEntrada(item)"
                  >
                    <ArrowDownToLine :size="14" />
                  </button>

                  <!-- Ajuste (solo admin) -->
                  <button
                    v-if="auth.isAdmin"
                    class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-info/10 hover:text-info"
                    title="Ajustar stock"
                    @click="handleAjuste(item)"
                  >
                    <SlidersHorizontal :size="14" />
                  </button>

                  <!-- Editar -->
                  <button
                    class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-700 hover:text-white"
                    title="Editar"
                    @click="handleEdit(item)"
                  >
                    <Pencil :size="14" />
                  </button>

                  <!-- Eliminar (solo admin) -->
                  <button
                    v-if="auth.isAdmin"
                    class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-error/10 hover:text-error"
                    title="Eliminar"
                    @click="handleDelete(item)"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pie de tabla -->
    <p v-if="store.items.length" class="text-right text-[12px] text-slate-600">
      {{ store.items.length }} registro{{ store.items.length !== 1 ? 's' : '' }}
    </p>
  </div>
</template>
