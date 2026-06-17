import { useAuthStore } from '~/store/auth.store'
import type { IProducto, ICreateProducto } from '~/types/producto.type'

interface ApiResponse<T> {
  data: T
  timestamp: string
}

export const ProductoService = () => {
  const { $api } = useNuxtApp()
  const auth = useAuthStore()

  return {
    async getAll(params?: { search?: string; categoria?: string }) {
      return $api<ApiResponse<IProducto[]>>('/api/v1/productos', {
        method: 'GET',
        headers: auth.authHeaders(),
        query: params,
      })
    },

    async create(dto: ICreateProducto) {
      return $api<ApiResponse<IProducto>>('/api/v1/productos', {
        method: 'POST',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async update(id: string, dto: Partial<ICreateProducto>) {
      return $api<ApiResponse<IProducto>>(`/api/v1/productos/${id}`, {
        method: 'PUT',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async remove(id: string) {
      return $api(`/api/v1/productos/${id}`, {
        method: 'DELETE',
        headers: auth.authHeaders(),
      })
    },
  }
}
