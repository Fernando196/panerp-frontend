export interface ICliente {
  id: string
  nombre: string
  telefono: string | null
  direccion: string | null
  tipoCliente: string | null
  saldoPendiente: number
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface ICreateCliente {
  nombre: string
  telefono?: string
  direccion?: string
  tipoCliente?: string
}
