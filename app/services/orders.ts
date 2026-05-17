import type { IOrder, IOrderProduct, IOrderResponse } from '~/types/order.type'

export const OrderService = () => {
  const { $api } = useNuxtApp()

  return {
    async getOrders(): Promise<IOrderResponse[]> {
      return await $api<IOrderResponse[]>('/orders?_embed=order_products', {
        method: 'GET',
      })
    },
    async postOrder(order: Omit<IOrder, 'id'>): Promise<IOrder> {
      return await $api<IOrder>('/orders', {
        method: 'POST',
        body: order,
      })
    },
    async putOrder(orderId: number, order: Partial<IOrder>): Promise<IOrder> {
      return await $api<IOrder>(`/orders/${orderId}`, {
        method: 'PUT',
        body: order,
      })
    },
    async deleteOrder(orderId: number): Promise<void> {
      await $api(`/orders/${orderId}`, {
        method: 'DELETE',
      })
    },
    async postOrderProduct(orderId: number, product: IOrderProduct): Promise<IOrderProduct> {
      return await $api<IOrderProduct>(`/order-products`, {
        method: 'POST',
        body: {
          orderId,
          ...product,
        },
      })
    },
    async deleteOrderProduct(orderProductId: number): Promise<void> {
      const { $api } = useNuxtApp()
      await $api(`/order_products/${orderProductId}`, {
        method: 'DELETE',
      })
    },
    async putOrderProduct(
      orderProductId: number,
      product: Partial<IOrderProduct>
    ): Promise<IOrderProduct> {
      const { $api } = useNuxtApp()
      return await $api<IOrderProduct>(`/order_products/${orderProductId}`, {
        method: 'PUT',
        body: product,
      })
    },
    async getOrderProducts(orderId: number): Promise<IOrderProduct[]> {
      const { $api } = useNuxtApp()
      return await $api<IOrderProduct[]>(`/order_products?orderId=${orderId}`)
    },
  }
}
