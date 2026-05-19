import { InventarioService } from '~/services/inventario'
import type { IMateriaPrima, ICreateMateriaPrima, IMovimientoInput } from '~/types/inventario.type'

export const useInventarioStore = defineStore('inventario', () => {
  const service = InventarioService()

  const items = ref<IMateriaPrima[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(params?: { search?: string; categoria?: string; stockBajo?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await service.getAll(params)
      items.value = res.data
    } catch (e) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar el inventario'
    } finally {
      loading.value = false
    }
  }

  async function create(dto: ICreateMateriaPrima) {
    const res = await service.create(dto)
    items.value.push(res.data)
    return res.data
  }

  async function update(id: string, dto: Partial<ICreateMateriaPrima>) {
    const res = await service.update(id, dto)
    const i = items.value.findIndex((x) => x.id === id)
    if (i !== -1) items.value[i] = res.data
    return res.data
  }

  async function remove(id: string) {
    await service.remove(id)
    items.value = items.value.filter((x) => x.id !== id)
  }

  async function registrarEntrada(id: string, dto: IMovimientoInput) {
    const res = await service.entrada(id, dto)
    const i = items.value.findIndex((x) => x.id === id)
    if (i !== -1) items.value[i] = res.data.mp
  }

  async function registrarAjuste(id: string, dto: IMovimientoInput) {
    const res = await service.ajuste(id, dto)
    const i = items.value.findIndex((x) => x.id === id)
    if (i !== -1) items.value[i] = res.data.mp
  }

  const stockBajoCount = computed(
    () => items.value.filter((x) => Number(x.stockActual) <= Number(x.stockMinimo)).length,
  )

  const valorTotal = computed(() =>
    items.value.reduce((sum, x) => sum + Number(x.stockActual) * Number(x.costoPorUnidad), 0),
  )

  const categorias = computed(
    () => [...new Set(items.value.map((x) => x.categoria).filter(Boolean))] as string[],
  )

  return {
    items,
    loading,
    error,
    fetch,
    create,
    update,
    remove,
    registrarEntrada,
    registrarAjuste,
    stockBajoCount,
    valorTotal,
    categorias,
  }
})
