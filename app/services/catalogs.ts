import type { IMachineBrand } from '~/types/machine.type'
import type { IProductCatalog } from '~/types/products.type'
import type { IUser, IUserRole } from '~/types/user.type'

export const CatalogService = () => {
  const { $api } = useNuxtApp()

  return {
    async getMachineBrands(): Promise<IMachineBrand[]> {
      return await $api<IMachineBrand[]>('/machine-brands', { method: 'GET' })
    },
    async createMachineBrand(brand: Omit<IMachineBrand, 'id'>): Promise<IMachineBrand> {
      return await $api<IMachineBrand>('/machine-brands', { method: 'POST', body: brand })
    },
    async updateMachineBrand(id: number, brand: Partial<IMachineBrand>): Promise<IMachineBrand> {
      return await $api<IMachineBrand>(`/machine-brands/${id}`, { method: 'PUT', body: brand })
    },
  }
}
