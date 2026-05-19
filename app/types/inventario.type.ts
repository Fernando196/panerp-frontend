export interface IMateriaPrima {
  id: string
  nombre: string
  categoria: string | null
  lugarCompra: string | null
  unidadPrincipal: string
  costoPorUnidad: number
  stockActual: number
  stockMinimo: number
  fechaUltimaCompra: string | null
  fechaCaducidad: string | null
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface IMovimientoInventario {
  id: string
  materiaPrimaId: string
  usuarioId: string
  tipo: 'entrada' | 'salida' | 'ajuste' | 'desperdicio' | 'produccion'
  cantidad: number
  unidad: string
  costoUnitario: number | null
  stockAnterior: number
  stockPosterior: number
  referenciaId: string | null
  referenciaTipo: string | null
  notas: string | null
  createdAt: string
}

export interface ICreateMateriaPrima {
  nombre: string
  categoria?: string
  lugarCompra?: string
  unidadPrincipal: string
  costoPorUnidad: number
  stockActual: number
  stockMinimo: number
  fechaCaducidad?: string
}

export interface IMovimientoInput {
  cantidad: number
  unidad: string
  costoUnitario?: number
  notas?: string
}
