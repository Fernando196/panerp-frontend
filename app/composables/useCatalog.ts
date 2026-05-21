import { CatalogService } from '~/services/catalogs'
import type { IUserRole } from '~/types/user-role.type'

export const useCatalog = () => {
  const catalogService = CatalogService()
  const userRoles = useState<IUserRole[]>('userRoles', () => [])

  async function fetchUserRoles() {
    try {
      const data = await catalogService.getUserRoles()
      userRoles.value = data
    } catch (error) {
      console.error('Error fetching user roles:', error)
    }
  }

  async function loadInitialData() {
    await fetchUserRoles()
  }

  return {
    // State
    userRoles,

    // Actions
    fetchUserRoles,

    loadInitialData,
  }
}
