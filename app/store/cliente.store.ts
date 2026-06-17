import { ClienteService } from '~/services/cliente'
import type { ICliente, ICreateCliente } from '~/types/cliente.type'

export const useClienteStore = defineStore('cliente', () => {
  const service = ClienteService()

  const items = ref<ICliente[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(params?: { search?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await service.getAll(params)
      items.value = res.data
    } catch (e) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar los clientes'
    } finally {
      loading.value = false
    }
  }

  async function create(dto: ICreateCliente) {
    const res = await service.create(dto)
    items.value.push(res.data)
    return res.data
  }

  async function update(id: string, dto: Partial<ICreateCliente>) {
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

  const saldoPendienteTotal = computed(() =>
    items.value.reduce((sum, x) => sum + Number(x.saldoPendiente), 0),
  )

  return {
    items,
    loading,
    error,
    fetch,
    create,
    update,
    remove,
    activos,
    saldoPendienteTotal,
  }
})
