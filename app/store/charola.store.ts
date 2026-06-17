import { CharolaService } from '~/services/charola'
import type { ICharola, ICreateCharola, IAsignarCharolaInput } from '~/types/charola.type'

export const useCharolaStore = defineStore('charola', () => {
  const service = CharolaService()

  const items = ref<ICharola[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(params?: { search?: string; estado?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await service.getAll(params)
      items.value = res.data
    } catch (e) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar las charolas'
    } finally {
      loading.value = false
    }
  }

  async function create(dto: ICreateCharola) {
    const res = await service.create(dto)
    items.value.push(res.data)
    return res.data
  }

  async function update(id: string, dto: Partial<ICreateCharola>) {
    const res = await service.update(id, dto)
    const i = items.value.findIndex((x) => x.id === id)
    if (i !== -1) items.value[i] = res.data
    return res.data
  }

  async function remove(id: string) {
    await service.remove(id)
    items.value = items.value.filter((x) => x.id !== id)
  }

  async function asignar(id: string, dto: IAsignarCharolaInput) {
    const res = await service.asignar(id, dto)
    const i = items.value.findIndex((x) => x.id === id)
    if (i !== -1) items.value[i] = res.data
    return res.data
  }

  async function liberar(id: string) {
    const res = await service.liberar(id)
    const i = items.value.findIndex((x) => x.id === id)
    if (i !== -1) items.value[i] = res.data
    return res.data
  }

  const disponibles = computed(() => items.value.filter((x) => x.estado === 'disponible'))
  const enCliente = computed(() => items.value.filter((x) => x.estado === 'en_cliente'))

  return {
    items,
    loading,
    error,
    fetch,
    create,
    update,
    remove,
    asignar,
    liberar,
    disponibles,
    enCliente,
  }
})
