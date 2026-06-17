import { useAuthStore } from '~/store/auth.store'
import type { IDevolucion, ICreateDevolucion } from '~/types/devolucion.type'

interface ApiResponse<T> {
  data: T
  timestamp: string
}

export const DevolucionService = () => {
  const { $api } = useNuxtApp()
  const auth = useAuthStore()

  return {
    async getAll(params?: { search?: string; clienteId?: string }) {
      return $api<ApiResponse<IDevolucion[]>>('/api/v1/devoluciones', {
        method: 'GET',
        headers: auth.authHeaders(),
        query: params,
      })
    },

    async create(dto: ICreateDevolucion) {
      return $api<ApiResponse<IDevolucion>>('/api/v1/devoluciones', {
        method: 'POST',
        headers: auth.authHeaders(),
        body: dto,
      })
    },
  }
}
