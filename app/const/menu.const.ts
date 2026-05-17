import type { IMenuItem } from '~/types/menu.type'

export const MOCK_MENU: IMenuItem[] = [
  {
    id: 1,
    label: 'Dashboard',
    path: '/',
    icon: 'dashboard',
    type: 'item',
  },
  {
    id: 2,
    label: 'Pedidos',
    path: '/orders',
    icon: 'order',
    type: 'item',
  },
  {
    id: 3,
    label: 'Control',
    path: '/machine-control',
    icon: 'laundry',
    type: 'item',
  },
  {
    id: 4,
    label: 'Inventario',
    path: '/inventory',
    icon: 'inventory',
    type: 'item',
  },
  {
    id: 5,
    label: 'Usuarios',
    path: '/users',
    icon: 'users',
    type: 'item',
  },
  {
    id: 6,
    label: 'Catalogos',
    path: '/catalogs',
    icon: 'catalogs',
    type: 'item',
  },
]
