export interface IUser {
  id: number
  name: string
  email: string
  role: string
  active: boolean
  createdAt?: Date
}

export interface IUserRole {
  id: number
  role: string
  description: string
  label: string
}
