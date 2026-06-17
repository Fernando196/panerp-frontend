export type EstadoProduccion = 'planificada' | 'en_proceso' | 'completada' | 'cancelada'

export interface IProduccion {
  id: string
  recetaId: string
  recetaNombre: string | null
  productoId: string | null
  productoNombre: string | null
  cantidadProducida: number
  unidad: string
  costoTotal: number
  estado: EstadoProduccion
  usuarioId: string | null
  notas: string | null
  fecha: string
  createdAt: string
}

export interface ICreateProduccion {
  recetaId: string
  cantidadProducida: number
  notas?: string
}
