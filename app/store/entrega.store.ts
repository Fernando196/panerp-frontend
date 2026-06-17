import { EntregaService } from '~/services/entrega'
import type { IEntrega, ICreateEntrega } from '~/types/entrega.type'

export const useEntregaStore = defineStore('entrega', () => {
  const service = EntregaService()

  const items = ref<IEntrega[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(params?: { search?: string; estado?: string; clienteId?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await service.getAll(params)
      items.value = res.data
    } catch (e) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar las entregas'
    } finally {
      loading.value = false
    }
  }

  async function create(dto: ICreateEntrega) {
    const res = await service.create(dto)
    items.value.unshift(res.data)
    return res.data
  }

  async function cancelar(id: string) {
    const res = await service.cancelar(id)
    const i = items.value.findIndex((x) => x.id === id)
    if (i !== -1) items.value[i] = res.data
    return res.data
  }

  const pendientes = computed(() =>
    items.value.filter((x) => x.estado === 'pendiente' || x.estado === 'parcial'),
  )

  const hoy = computed(() => {
    const today = new Date().toDateString()
    return items.value.filter((x) => new Date(x.fecha).toDateString() === today)
  })

  const montoHoy = computed(() => hoy.value.reduce((sum, x) => sum + Number(x.montoTotal), 0))

  return {
    items,
    loading,
    error,
    fetch,
    create,
    cancelar,
    pendientes,
    hoy,
    montoHoy,
  }
})
