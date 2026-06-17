import { RecetaService } from '~/services/receta'
import type { IReceta, ICreateReceta } from '~/types/receta.type'

export const useRecetaStore = defineStore('receta', () => {
  const service = RecetaService()

  const items = ref<IReceta[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(params?: { search?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await service.getAll(params)
      items.value = res.data
    } catch (e) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar las recetas'
    } finally {
      loading.value = false
    }
  }

  async function create(dto: ICreateReceta) {
    const res = await service.create(dto)
    items.value.push(res.data)
    return res.data
  }

  async function update(id: string, dto: Partial<ICreateReceta>) {
    const res = await service.update(id, dto)
    const i = items.value.findIndex((x) => x.id === id)
    if (i !== -1) items.value[i] = res.data
    return res.data
  }

  async function remove(id: string) {
    await service.remove(id)
    items.value = items.value.filter((x) => x.id !== id)
  }

  const costoPromedio = computed(() => {
    if (!items.value.length) return 0
    return items.value.reduce((sum, x) => sum + Number(x.costoEstimado), 0) / items.value.length
  })

  return {
    items,
    loading,
    error,
    fetch,
    create,
    update,
    remove,
    costoPromedio,
  }
})
