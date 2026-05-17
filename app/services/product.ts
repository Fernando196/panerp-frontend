import type { IProduct } from '~/types/products.type'

export const ProductService = () => {
  const { $api } = useNuxtApp()
  return {
    async getProducts(): Promise<IProduct[]> {
      return await $api<IProduct[]>('/products', {
        method: 'GET',
      })
    },
    async postProduct(product: Omit<IProduct, 'id'>): Promise<IProduct> {
      return await $api<IProduct>('/products', {
        method: 'POST',
        body: product,
      })
    },
    async putProduct(productId: number, product: Partial<IProduct>): Promise<IProduct> {
      return await $api<IProduct>(`/products/${productId}`, {
        method: 'PUT',
        body: product,
      })
    },
    async deleteProduct(productId: number): Promise<void> {
      await $api(`/products/${productId}`, {
        method: 'DELETE',
      })
    },
  }
}
