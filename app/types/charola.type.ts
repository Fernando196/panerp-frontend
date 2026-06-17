export type EstadoCharola = 'disponible' | 'en_cliente' | 'en_transito' | 'perdida'

export interface ICharola {
  id: string
  codigo: string
  estado: EstadoCharola
  clienteId: string | null
  clienteNombre: string | null
  notas: string | null
  createdAt: string
  updatedAt: string
}

export interface ICreateCharola {
  codigo: string
  notas?: string
}

export interface IAsignarCharolaInput {
  clienteId: string
}
