import type { IOrderStatusCatalog, IServiceTypeCatalog } from '~/types/order.type'

export const ORDER_STATUS_TYPE = {
  PENDING: 'pending',
  'IN-PROCESS': 'in-process',
  READY: 'ready',
  CANCELED: 'canceled',
  COMPLETED: 'completed',
} as const
export const ORDER_SERVICE_TYPE = {
  WASH: 'wash',
  DRY: 'dry',
  'WASH-DRY': 'wash-dry',
  IRONING: 'ironing',
  EXPRESS: 'express',
} as const

export const ORDER_STATUS_CATALOG: IOrderStatusCatalog = {
  [ORDER_STATUS_TYPE.PENDING]: {
    id: 1,
    label: 'Pendiente',
  },
  [ORDER_STATUS_TYPE['IN-PROCESS']]: {
    id: 2,
    label: 'En proceso',
  },
  [ORDER_STATUS_TYPE.READY]: {
    id: 3,
    label: 'Listo',
  },
  [ORDER_STATUS_TYPE.CANCELED]: {
    id: 4,
    label: 'Cancelado',
  },
  [ORDER_STATUS_TYPE.COMPLETED]: {
    id: 5,
    label: 'Completado',
  },
}
export const ORDER_SERVICE_TYPE_CATALOG: IServiceTypeCatalog = {
  [ORDER_SERVICE_TYPE.WASH]: {
    id: 1,
    label: 'Lavar',
    serviceCost: 100,
    description:
      'Servicio de lavado para prendas de ropa. Incluye el uso de detergentes y suavizantes adecuados para cada tipo de tela, garantizando una limpieza efectiva y cuidado de las prendas.',
  },
  [ORDER_SERVICE_TYPE.DRY]: {
    id: 2,
    label: 'Secar',
    serviceCost: 150,
    description:
      'Servicio de secado para prendas de ropa. Utiliza técnicas y equipos adecuados para asegurar un secado uniforme y cuidado de las prendas.',
  },
  [ORDER_SERVICE_TYPE['WASH-DRY']]: {
    id: 3,
    label: 'Secar y Lavar',
    serviceCost: 250,
    description:
      'Servicio combinado de lavado y secado para prendas de ropa. Garantiza una limpieza completa y un secado adecuado, cuidando cada tipo de tela.',
  },
  [ORDER_SERVICE_TYPE.IRONING]: {
    id: 4,
    label: 'Planchar',
    serviceCost: 50,
    description:
      'Servicio de planchado para prendas de ropa. Utiliza técnicas y equipos adecuados para asegurar un planchado uniforme y cuidado de las prendas.',
  },
  [ORDER_SERVICE_TYPE.EXPRESS]: {
    id: 5,
    label: 'Express',
    serviceCost: 300,
    description:
      'Servicio express para prendas de ropa. Garantiza una limpieza y entrega rápida, ideal para situaciones de urgencia.',
  },
}
