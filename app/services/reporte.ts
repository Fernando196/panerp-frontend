import { useAuthStore } from '~/store/auth.store'
import type { IReporteResumen } from '~/types/reporte.type'

interface ApiResponse<T> {
  data: T
  timestamp: string
}

export const ReporteService = () => {
  const { $api } = useNuxtApp()
  const auth = useAuthStore()

  return {
    async getResumen(params?: { desde?: string; hasta?: string }) {
      return $api<ApiResponse<IReporteResumen>>('/api/v1/reportes/resumen', {
        method: 'GET',
        headers: auth.authHeaders(),
        query: params,
      })
    },
  }
}
