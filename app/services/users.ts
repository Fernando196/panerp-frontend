import type { IUser } from '~/types/user.type'

export const UserService = () => {
  const { $api } = useNuxtApp()

  return {
    async getUsers(): Promise<IUser[]> {
      return await $api<IUser[]>('/users', {
        method: 'GET',
      })
    },
    async postUser(user: Omit<IUser, 'id'>): Promise<IUser> {
      return await $api<IUser>('/users', {
        method: 'POST',
        body: user,
      })
    },
    async putUser(userId: number, user: Partial<IUser>): Promise<IUser> {
      return await $api<IUser>(`/users/${userId}`, {
        method: 'PUT',
        body: user,
      })
    },
    async deleteUser(userId: number): Promise<void> {
      await $api(`/users/${userId}`, {
        method: 'DELETE',
      })
    },
  }
}
