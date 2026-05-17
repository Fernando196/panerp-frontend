import { CatalogService } from '~/services/catalogs'

export const useCatalogStore = defineStore('catalog', () => {
  const service = CatalogService()

  return {
  }
})
