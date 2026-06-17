import { useAuthStore } from '~/store/auth.store'
import type { IReceta, ICreateReceta } from '~/types/receta.type'

interface ApiResponse<T> {
  data: T
  timestamp: string
}

export const RecetaService = () => {
  const { $api } = useNuxtApp()
  const auth = useAuthStore()

  return {
    async getAll(params?: { search?: string }) {
      return $api<ApiResponse<IReceta[]>>('/recetas', {
        method: 'GET',
        headers: auth.authHeaders(),
        query: params,
      })
    },

    async create(dto: ICreateReceta) {
      return $api<ApiResponse<IReceta>>('/recetas', {
        method: 'POST',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async update(id: string, dto: Partial<ICreateReceta>) {
      return $api<ApiResponse<IReceta>>(`/recetas/${id}`, {
        method: 'PUT',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async remove(id: string) {
      return $api(`/recetas/${id}`, {
        method: 'DELETE',
        headers: auth.authHeaders(),
      })
    },
  }
}
