import { ProductoService } from '~/services/producto'
import type { IProducto, ICreateProducto } from '~/types/producto.type'

export const useProductoStore = defineStore('producto', () => {
  const service = ProductoService()

  const items = ref<IProducto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(params?: { search?: string; categoria?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await service.getAll(params)
      items.value = res.data
    } catch (e) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar los productos'
    } finally {
      loading.value = false
    }
  }

  async function create(dto: ICreateProducto) {
    const res = await service.create(dto)
    items.value.push(res.data)
    return res.data
  }

  async function update(id: string, dto: Partial<ICreateProducto>) {
    const res = await service.update(id, dto)
    const i = items.value.findIndex((x) => x.id === id)
    if (i !== -1) items.value[i] = res.data
    return res.data
  }

  async function remove(id: string) {
    await service.remove(id)
    items.value = items.value.filter((x) => x.id !== id)
  }

  const activos = computed(() => items.value.filter((x) => x.activo))

  const categorias = computed(
    () => [...new Set(items.value.map((x) => x.categoria).filter(Boolean))] as string[],
  )

  const precioPromedio = computed(() => {
    if (!items.value.length) return 0
    return items.value.reduce((sum, x) => sum + Number(x.precioVenta), 0) / items.value.length
  })

  return {
    items,
    loading,
    error,
    fetch,
    create,
    update,
    remove,
    activos,
    categorias,
    precioPromedio,
  }
})
