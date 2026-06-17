export interface IProducto {
  id: string
  nombre: string
  categoria: string | null
  unidad: string
  precioVenta: number
  costoEstimado: number | null
  recetaId: string | null
  recetaNombre: string | null
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface ICreateProducto {
  nombre: string
  categoria?: string
  unidad: string
  precioVenta: number
  costoEstimado?: number
  recetaId?: string
}
