import type { IUserRole } from "~/types/user-role.type"


export const CatalogService = () => {
  const { $api } = useNuxtApp()

  return {
    async getUserRoles(): Promise<IUserRole[]> {
      return await $api<IUserRole[]>('/catalogos/user-roles', { method: 'GET' })
    },
  }
}
