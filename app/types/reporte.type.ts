export interface IReportePunto {
  fecha: string
  total: number
}

export interface IReporteProductoTop {
  productoId: string
  nombre: string
  cantidad: number
  monto: number
}

export interface IReporteResumen {
  ventasHoy: number
  ventasMes: number
  entregasPendientes: number
  saldoClientesPendiente: number
  serieVentas: IReportePunto[]
  topProductos: IReporteProductoTop[]
}
