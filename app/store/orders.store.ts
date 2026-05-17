import { ORDER_SERVICE_TYPE_CATALOG, ORDER_STATUS_CATALOG } from '~/const/orders.const'
import { OrderService } from '~/services/orders'
import type { IOrder, IOrderProduct, IOrderResponse } from '~/types/order.type'
import { useProductStore } from './product.store'

export const useOrderStore = defineStore('orders', () => {
  const orderService = OrderService()
  const orders = ref<IOrder[]>([])
  const pending = ref<boolean>(false)
  const productStore = useProductStore()
  const products = computed(() => productStore.products)

  async function fetchOrders() {
    if (orders.value.length > 0) return orders.value
    pending.value = true
    try {
      const data: IOrderResponse[] = <IOrderResponse[]>await orderService.getOrders()
      orders.value = data.map((order: IOrderResponse) => ({
        ...order,
        Service: ORDER_SERVICE_TYPE_CATALOG[order.service] || null,
        Status: ORDER_STATUS_CATALOG[order.status] || null,
        OrderProducts: order.order_products.map((op) => ({
          ...op,
          Product: products.value.find((p) => p.id === op.productId),
        })),
      }))
      return data
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    } finally {
      pending.value = false
    }
  }

  const addOrder = async (order: IOrder) => {
    const amount = calculateOrderAmount(order)

    const bodyOrder: IOrder = {
      status: order.status,
      service: order.service,
      customerName: order.customerName,
      amount: amount,
      createdAt: new Date().toISOString(),
      completedAt: '',
      quantity: order.quantity,
      receivedAt: order.receivedAt,
    }

    const newOrder = await orderService.postOrder(bodyOrder)

    if (order.OrderProducts?.length) {
      const newProducts = await Promise.all(
        order.OrderProducts.map((product) => orderService.postOrderProduct(newOrder.id!, product))
      )
      newOrder.OrderProducts = newProducts
    }
    newOrder.Service = ORDER_SERVICE_TYPE_CATALOG[newOrder.service] || null
    newOrder.Status = ORDER_STATUS_CATALOG[newOrder.status] || null
    orders.value.push(newOrder)
  }

  const deleteOrder = async (orderId: number) => {
    await orderService.deleteOrder(orderId)
    orders.value = orders.value.filter((order) => order.id !== orderId)
  }

  const updatedOrder = async (id: number, updated: IOrder) => {
    const updateOrder: IOrder = {
      status: updated.status,
      service: updated.service,
      customerName: updated.customerName,
      amount: updated.amount,
      createdAt: new Date().toISOString(),
      completedAt: '',
      quantity: updated.quantity,
      receivedAt: updated.receivedAt,
    }

    await orderService.putOrder(id, updateOrder)
    const index = orders.value.findIndex((order) => order.id === updated.id)
    if (index !== -1) {
      orders.value[index] = {
        ...orders.value[index],
        ...updated,
        Service: ORDER_SERVICE_TYPE_CATALOG[updated.service] || null,
        Status: ORDER_STATUS_CATALOG[updated.status] || null,
        amount: calculateOrderAmount(updated),
      }
    }
  }

  const calculateOrderAmount = (order: IOrder): number => {
    const productsAmount =
      order.OrderProducts?.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0) || 0
    const serviceAmount = ORDER_SERVICE_TYPE_CATALOG[order.service].serviceCost
    return productsAmount + serviceAmount
  }

  // Products

  const addProductToOrder = async (orderId: number, product: IOrderProduct) => {
    const newProduct = await orderService.postOrderProduct(orderId, product)
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.OrderProducts = order.OrderProducts || []
      order.OrderProducts.push(newProduct)
    }
  }

  const deleteProductFromOrder = async (orderProductId: number) => {
    await orderService.deleteOrderProduct(orderProductId)
    const order = orders.value.find((o) => o.OrderProducts?.some((p) => p.id === orderProductId))
    if (order && order.OrderProducts) {
      order.OrderProducts = order.OrderProducts.filter((p) => p.id !== orderProductId)
    }
  }

  const updateProductInOrder = async (orderProductId: number, updated: IOrderProduct) => {
    const updatedProduct = await orderService.putOrderProduct(orderProductId, updated)
    const order = orders.value.find((o) => o.OrderProducts?.some((p) => p.id === orderProductId))
    if (order && order.OrderProducts) {
      const index = order.OrderProducts.findIndex((p) => p.id === updatedProduct.id)
      if (index !== -1) {
        order.OrderProducts[index] = updatedProduct
      }
    }
  }

  return {
    // State
    orders,

    // Actions
    addOrder,
    deleteOrder,
    updatedOrder,
    fetchOrders,

    addProductToOrder,
    deleteProductFromOrder,
    updateProductInOrder,
  }
})
