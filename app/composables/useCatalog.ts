import { CatalogService } from '~/services/catalogs'
import type { IMachineBrand } from '~/types/machine.type'
import type { IProductCatalog } from '~/types/products.type'
import type { IUser, IUserRole } from '~/types/user.type'

export const useCatalog = () => {
  const catalogService = CatalogService()
  const machineBrands = useState<IMachineBrand[]>('machineBrands', () => [])
  const products = useState<IProductCatalog[]>('products', () => [])
  const users = useState<IUser[]>('users', () => [])
  const userRoles = useState<IUserRole[]>('userRoles', () => [])

  async function fetchMachineBrands() {
    try {
      const data = await catalogService.getMachineBrands()
      machineBrands.value = data
    } catch (error) {
      console.error('Error fetching machine brands:', error)
    }
  }

  async function fetchProducts() {
    try {
      const data = await catalogService.getProducts()
      products.value = data
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  async function fetchUsers() {
    try {
      const data = await catalogService.getUsers()
      users.value = data
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  async function fetchUserRoles() {
    try {
      const data = await catalogService.getUserRoles()
      userRoles.value = data
    } catch (error) {
      console.error('Error fetching user roles:', error)
    }
  }

  async function loadInitialData() {
    await fetchMachineBrands()
    await fetchProducts()
    await fetchUsers()
    await fetchUserRoles()
  }

  return {
    // State
    machineBrands,
    products,
    users,
    userRoles,

    // Actions
    fetchMachineBrands,
    fetchProducts,
    fetchUsers,
    fetchUserRoles,

    loadInitialData,
  }
}
