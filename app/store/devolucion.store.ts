import { DevolucionService } from '~/services/devolucion'
import type { IDevolucion, ICreateDevolucion } from '~/types/devolucion.type'

export const useDevolucionStore = defineStore('devolucion', () => {
  const service = DevolucionService()

  const items = ref<IDevolucion[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(params?: { search?: string; clienteId?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await service.getAll(params)
      items.value = res.data
    } catch (e) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar las devoluciones'
    } finally {
      loading.value = false
    }
  }

  async function create(dto: ICreateDevolucion) {
    const res = await service.create(dto)
    items.value.unshift(res.data)
    return res.data
  }

  const hoy = computed(() => {
    const today = new Date().toDateString()
    return items.value.filter((x) => new Date(x.fecha).toDateString() === today)
  })

  const montoCobradoHoy = computed(() => hoy.value.reduce((sum, x) => sum + Number(x.montoCobrado), 0))

  return {
    items,
    loading,
    error,
    fetch,
    create,
    hoy,
    montoCobradoHoy,
  }
})
