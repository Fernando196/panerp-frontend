import { ReporteService } from '~/services/reporte'
import type { IReporteResumen } from '~/types/reporte.type'

export const useReporteStore = defineStore('reporte', () => {
  const service = ReporteService()

  const resumen = ref<IReporteResumen | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(params?: { desde?: string; hasta?: string }) {
    loading.value = true
    error.value = null
    try {
      const res = await service.getResumen(params)
      resumen.value = res.data
    } catch (e) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar el reporte'
    } finally {
      loading.value = false
    }
  }

  return {
    resumen,
    loading,
    error,
    fetch,
  }
})
