import { ProduccionService } from '~/services/produccion'
import type { IProduccion, ICreateProduccion } from '~/types/produccion.type'

export const useProduccionStore = defineStore('produccion', () => {
  const service = ProduccionService()

  const items = ref<IProduccion[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(params?: { search?: string; estado?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await service.getAll(params)
      items.value = res.data
    } catch (e) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar la producción'
    } finally {
      loading.value = false
    }
  }

  async function create(dto: ICreateProduccion) {
    const res = await service.create(dto)
    items.value.unshift(res.data)
    return res.data
  }

  async function completar(id: string) {
    const res = await service.completar(id)
    const i = items.value.findIndex((x) => x.id === id)
    if (i !== -1) items.value[i] = res.data
    return res.data
  }

  async function cancelar(id: string) {
    const res = await service.cancelar(id)
    const i = items.value.findIndex((x) => x.id === id)
    if (i !== -1) items.value[i] = res.data
    return res.data
  }

  const hoy = computed(() => {
    const today = new Date().toDateString()
    return items.value.filter((x) => new Date(x.fecha).toDateString() === today)
  })

  const cantidadHoy = computed(() => hoy.value.reduce((sum, x) => sum + Number(x.cantidadProducida), 0))

  const costoHoy = computed(() => hoy.value.reduce((sum, x) => sum + Number(x.costoTotal), 0))

  const enProceso = computed(() => items.value.filter((x) => x.estado === 'en_proceso' || x.estado === 'planificada'))

  return {
    items,
    loading,
    error,
    fetch,
    create,
    completar,
    cancelar,
    hoy,
    cantidadHoy,
    costoHoy,
    enProceso,
  }
})
