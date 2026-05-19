import { useAuthStore } from '~/store/auth.store'
import type {
  IMateriaPrima,
  ICreateMateriaPrima,
  IMovimientoInventario,
  IMovimientoInput,
} from '~/types/inventario.type'

interface ApiResponse<T> {
  data: T
  timestamp: string
}

export const InventarioService = () => {
  const { $api } = useNuxtApp()
  const auth = useAuthStore()

  return {
    async getAll(params?: { search?: string; categoria?: string; stockBajo?: string }) {
      return $api<ApiResponse<IMateriaPrima[]>>('/api/v1/inventario', {
        method: 'GET',
        headers: auth.authHeaders(),
        query: params,
      })
    },

    async create(dto: ICreateMateriaPrima) {
      return $api<ApiResponse<IMateriaPrima>>('/api/v1/inventario', {
        method: 'POST',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async update(id: string, dto: Partial<ICreateMateriaPrima>) {
      return $api<ApiResponse<IMateriaPrima>>(`/api/v1/inventario/${id}`, {
        method: 'PUT',
        headers: auth.authHeaders(),
        body: dto,
      })
    },

    async remove(id: string) {
      return $api(`/api/v1/inventario/${id}`, {
        method: 'DELETE',
        headers: auth.authHeaders(),
      })
    },

    async entrada(id: string, dto: IMovimientoInput) {
      return $api<ApiResponse<{ mp: IMateriaPrima; movimiento: IMovimientoInventario }>>(
        `/api/v1/inventario/${id}/entrada`,
        { method: 'POST', headers: auth.authHeaders(), body: dto },
      )
    },

    async ajuste(id: string, dto: IMovimientoInput) {
      return $api<ApiResponse<{ mp: IMateriaPrima; movimiento: IMovimientoInventario }>>(
        `/api/v1/inventario/${id}/ajuste`,
        { method: 'POST', headers: auth.authHeaders(), body: dto },
      )
    },

    async movimientos(id: string, limit = 50) {
      return $api<ApiResponse<IMovimientoInventario[]>>(
        `/api/v1/inventario/${id}/movimientos`,
        { headers: auth.authHeaders(), query: { limit } },
      )
    },
  }
}
