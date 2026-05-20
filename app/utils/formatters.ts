export function formatNumber(n: number | string, decimals = 2): string {
  return Number(n).toLocaleString('es-MX', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  })
}

export function formatMXN(n: number | string): string {
  return Number(n).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}

export function formatFecha(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
