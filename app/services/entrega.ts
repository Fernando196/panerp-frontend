import { useAuthStore } from '~/store/auth.store'
import type { IEntrega, ICreateEntrega } from '~/types/entrega.type'

interface ApiResponse<T> {
  data: T
  timestamp: string
}

export const EntregaService = () => {
  const { $api } = useNuxtApp()
  const auth = useAuthStore()

  return {
    async getAll(params?: { search?: string; estado?: string; clienteId?: string }) {
      return $api<ApiResponse<IEntrega[]>>('/entregas', {
        method: 'GET',
        headers: auth.authHeaders(),
        query: params,
      })
    },

    async create(dto: ICreateEntrega) {
      return $api<ApiResponse<IEntrega>>('/entregas', {
        method: 'POST',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async cancelar(id: string) {
      return $api<ApiResponse<IEntrega>>(`/entregas/${id}/cancelar`, {
        method: 'POST',
        headers: auth.authHeaders(),
      })
    },
  }
}
