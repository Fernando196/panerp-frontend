export interface IRecetaIngrediente {
  materiaPrimaId: string
  materiaPrimaNombre: string | null
  cantidad: number
  unidad: string
}

export interface IReceta {
  id: string
  nombre: string
  productoId: string | null
  productoNombre: string | null
  rendimiento: number
  unidadRendimiento: string
  ingredientes: IRecetaIngrediente[]
  costoEstimado: number
  activo: boolean
  notas: string | null
  createdAt: string
  updatedAt: string
}

export interface ICreateRecetaIngrediente {
  materiaPrimaId: string
  cantidad: number
  unidad: string
}

export interface ICreateReceta {
  nombre: string
  productoId?: string
  rendimiento: number
  unidadRendimiento: string
  ingredientes: ICreateRecetaIngrediente[]
  notas?: string
}
