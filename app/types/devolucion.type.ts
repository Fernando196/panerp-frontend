export interface IDevolucionItem {
  productoId: string
  productoNombre: string | null
  cantidadEntregada: number
  cantidadDevuelta: number
  precioUnitario: number
}

export interface IDevolucion {
  id: string
  entregaId: string
  clienteId: string
  clienteNombre: string | null
  fecha: string
  items: IDevolucionItem[]
  montoCobrado: number
  createdAt: string
}

export interface ICreateDevolucionItem {
  productoId: string
  cantidadDevuelta: number
}

export interface ICreateDevolucion {
  entregaId: string
  items: ICreateDevolucionItem[]
}
