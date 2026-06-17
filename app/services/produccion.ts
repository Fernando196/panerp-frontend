import { useAuthStore } from '~/store/auth.store'
import type { IProduccion, ICreateProduccion } from '~/types/produccion.type'

interface ApiResponse<T> {
  data: T
  timestamp: string
}

export const ProduccionService = () => {
  const { $api } = useNuxtApp()
  const auth = useAuthStore()

  return {
    async getAll(params?: { search?: string; estado?: string }) {
      return $api<ApiResponse<IProduccion[]>>('/produccion', {
        method: 'GET',
        headers: auth.authHeaders(),
        query: params,
      })
    },

    async create(dto: ICreateProduccion) {
      return $api<ApiResponse<IProduccion>>('/produccion', {
        method: 'POST',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async completar(id: string) {
      return $api<ApiResponse<IProduccion>>(`/produccion/${id}/completar`, {
        method: 'POST',
        headers: auth.authHeaders(),
      })
    },

    async cancelar(id: string) {
      return $api<ApiResponse<IProduccion>>(`/produccion/${id}/cancelar`, {
        method: 'POST',
        headers: auth.authHeaders(),
      })
    },
  }
}
