import { ProductService } from '~/services/product'
import type { IProduct } from '~/types/products.type'

export const useProductStore = defineStore('products', () => {
  const productService = ProductService()
  const products = ref<IProduct[]>([])
  const pending = ref<boolean>(false)

  async function fetchProducts({ force = false } = {}) {
    if (!force && products.value.length > 0) return products.value
    pending.value = true
    try {
      const data: IProduct[] = <IProduct[]>await productService.getProducts()
      products.value = data
      return data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    } finally {
      pending.value = false
    }
  }

  const addProduct = async (product: IProduct) => {
    const newProduct = await productService.postProduct(product)
    products.value.push(newProduct)
  }

  const deleteProduct = async (productId: number) => {
    await productService.deleteProduct(productId)
    products.value = products.value.filter((product) => product.id !== productId)
  }

  const updatedProduct = async (id: number, updated: IProduct) => {
    const updatedProduct = await productService.putProduct(id, updated)
    const index = products.value.findIndex((product) => product.id === updatedProduct.id)
    if (index !== -1) {
      products.value[index] = updatedProduct
    }
  }

  return {
    // State
    products,

    // Actions
    addProduct,
    deleteProduct,
    updatedProduct,
    fetchProducts,
  }
})
