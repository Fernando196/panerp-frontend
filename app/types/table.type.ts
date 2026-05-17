export interface TableColumn<T> {
  key: keyof T
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}
