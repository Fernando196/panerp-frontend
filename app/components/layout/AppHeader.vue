<script setup lang="ts">
  import type { IOrder } from '~/types/order.type'
  import MapIcon from '../common/MapIcon/MapIcon.vue'
  import OrderFormModal from '../orders/OrderFormModal.vue'

  const { openModal } = useModal()
  const handleAddOrder = async () => {
    await openModal<IOrder>(OrderFormModal)
  }
</script>

<template>
  <div
    class="flex h-14 items-center justify-between border-b border-b-gray-300 px-3 shadow-sm md:px-10"
  >
    <div>
      <h1 class="text-primary text-sm font-semibold md:text-lg">Nombre de lavanderia</h1>
    </div>
    <div>
      <button class="btn btn-primary" @click="handleAddOrder">
        <MapIcon name="add" class="hidden h-6 w-6 stroke-white md:flex" />
        Nuevo pedido
      </button>
    </div>
  </div>
</template>
