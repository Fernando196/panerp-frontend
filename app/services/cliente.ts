import { useAuthStore } from '~/store/auth.store'
import type { ICliente, ICreateCliente } from '~/types/cliente.type'

interface ApiResponse<T> {
  data: T
  timestamp: string
}

export const ClienteService = () => {
  const { $api } = useNuxtApp()
  const auth = useAuthStore()

  return {
    async getAll(params?: { search?: string }) {
      return $api<ApiResponse<ICliente[]>>('/api/v1/clientes', {
        method: 'GET',
        headers: auth.authHeaders(),
        query: params,
      })
    },

    async create(dto: ICreateCliente) {
      return $api<ApiResponse<ICliente>>('/api/v1/clientes', {
        method: 'POST',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async update(id: string, dto: Partial<ICreateCliente>) {
      return $api<ApiResponse<ICliente>>(`/api/v1/clientes/${id}`, {
        method: 'PUT',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async remove(id: string) {
      return $api(`/api/v1/clientes/${id}`, {
        method: 'DELETE',
        headers: auth.authHeaders(),
      })
    },
  }
}
