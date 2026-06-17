import { useReporteStore } from '~/store/reporte.store'

function toDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function useReporteFiltros() {
  const store = useReporteStore()

  const hoy = new Date()
  const hace30Dias = new Date()
  hace30Dias.setDate(hoy.getDate() - 30)

  const desde = ref(toDateString(hace30Dias))
  const hasta = ref(toDateString(hoy))

  async function aplicar() {
    await store.fetch({ desde: desde.value, hasta: hasta.value })
  }

  return { desde, hasta, aplicar }
}
