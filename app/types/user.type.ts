export interface IUser {
  id: number
  name: string
  email: string
  role: string
  active: boolean
  createdAt?: Date
}