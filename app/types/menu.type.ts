import type { Icons } from './icons.type'

export interface IMenu {
  items: IMenuItem[]
}

export interface IMenuItem {
  id: number
  label: string
  description?: string
  path: string
  icon: Icons
  type: 'item' | 'group'
  children?: IMenuItem[]
}
