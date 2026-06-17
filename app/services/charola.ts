import { useAuthStore } from '~/store/auth.store'
import type { ICharola, ICreateCharola, IAsignarCharolaInput } from '~/types/charola.type'

interface ApiResponse<T> {
  data: T
  timestamp: string
}

export const CharolaService = () => {
  const { $api } = useNuxtApp()
  const auth = useAuthStore()

  return {
    async getAll(params?: { search?: string; estado?: string }) {
      return $api<ApiResponse<ICharola[]>>('/api/v1/charolas', {
        method: 'GET',
        headers: auth.authHeaders(),
        query: params,
      })
    },

    async create(dto: ICreateCharola) {
      return $api<ApiResponse<ICharola>>('/api/v1/charolas', {
        method: 'POST',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async update(id: string, dto: Partial<ICreateCharola>) {
      return $api<ApiResponse<ICharola>>(`/api/v1/charolas/${id}`, {
        method: 'PUT',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async remove(id: string) {
      return $api(`/api/v1/charolas/${id}`, {
        method: 'DELETE',
        headers: auth.authHeaders(),
      })
    },

    async asignar(id: string, dto: IAsignarCharolaInput) {
      return $api<ApiResponse<ICharola>>(`/api/v1/charolas/${id}/asignar`, {
        method: 'POST',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async liberar(id: string) {
      return $api<ApiResponse<ICharola>>(`/api/v1/charolas/${id}/liberar`, {
        method: 'POST',
        headers: auth.authHeaders(),
      })
    },
  }
}
