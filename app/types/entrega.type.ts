export type EstadoEntrega = 'pendiente' | 'entregada' | 'parcial' | 'cancelada'

export interface IEntregaItem {
  productoId: string
  productoNombre: string | null
  cantidadEntregada: number
  precioUnitario: number
}

export interface IEntrega {
  id: string
  clienteId: string
  clienteNombre: string | null
  fecha: string
  items: IEntregaItem[]
  charolaIds: string[]
  estado: EstadoEntrega
  montoTotal: number
  notas: string | null
  createdAt: string
}

export interface ICreateEntregaItem {
  productoId: string
  cantidadEntregada: number
  precioUnitario: number
}

export interface ICreateEntrega {
  clienteId: string
  items: ICreateEntregaItem[]
  charolaIds?: string[]
  notas?: string
}
