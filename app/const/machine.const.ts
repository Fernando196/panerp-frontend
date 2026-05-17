import type { IMachineEstatusCatalog, IMachineStatusClass } from '~/types/machine.type'

export const MACHINE_TYPES = {
  WASHER: 'washer',
  DRYER: 'dryer',
  WASHER_DRYER: 'washer-dryer',
} as const
export const MACHINE_STATUS = {
  ACTIVE: 'active',
  RUNNING: 'running',
  MAINTENANCE: 'maintenance',
  'OUT-OF-SERVICE': 'out-of-service',
} as const
export const MACHINE_STATUS_CATALOG: IMachineEstatusCatalog = {
  active: {
    id: 1,
    label: 'Activo',
    description: 'Disponible para nuevo ciclo',
  },
  running: {
    id: 2,
    label: 'En ciclo',
    description: 'Ciclo en curso',
  },
  maintenance: {
    id: 3,
    label: 'Mantenimiento',
    description: 'Revisión o reparación en curso',
  },
  'out-of-service': {
    id: 4,
    label: 'Fuera de servicio',
    description: 'Requiere reparación, no disponible',
  },
} as const

export const MACHINE_STATUS_CLASS: IMachineStatusClass = {
  active: {
    class: 'text-success bg-success-bg',
    dot: 'bg-success',
    messageIconCard: 'text-success fill-success ',
    chip: 'badge-ready',
  },
  running: {
    class: 'text-info bg-info-bg',
    dot: 'bg-info',
    messageIconCard: 'text-info fill-info ',
    chip: 'badge-in-process',
  },
  maintenance: {
    class: 'text-warning bg-warning-bg',
    dot: 'bg-warning',
    messageIconCard: 'text-warning fill-warning ',
    chip: 'badge-pending',
  },
  'out-of-service': {
    class: 'text-error bg-error-bg',
    dot: 'bg-error',
    messageIconCard: 'text-error fill-error ',
    chip: 'badge-canceled',
  },
}
