<script setup lang="ts">
  import type { IMachineBrand } from '~/types/machine.type'
  import type { TableColumn } from '~/types/table.type'
  import ConfirmModal from '../common/Modal/ConfirmModal.vue'
  import BrandFormModal from './BrandFormModal.vue'
  import { useCatalogStore } from '~/store/catalog.store'
  import DataTable from '../ui/DataTable.vue'
  import MapIcon from '../common/MapIcon/MapIcon.vue'

  const catalogStore = useCatalogStore()
  await useAsyncData('brands', () => catalogStore.fetchBrands())
  const brands = computed(() => catalogStore.brands)
  const { openModal } = useModal()

  const columns: TableColumn<IMachineBrand>[] = [
    { key: 'id', label: '#', width: '60px' },
    { key: 'name', label: 'Nombre' },
  ]

  async function handleEdit(row: Record<string, unknown>) {
    const brand = brands.value.find((b) => b.id === row.id)
    if (!brand) return
    const result = await openModal(BrandFormModal, { brand })
    if (!result) return
    catalogStore.updateBrand(brand.id, result)
  }

  async function handleDelete(row: Record<string, unknown>) {
    const result = await openModal(ConfirmModal, {
      title: 'Eliminar ' + row.name,
      message: '¿Estás seguro de que deseas eliminar esta marca?',
      confirmText: 'Eliminar',
    })
    if (!result) return
    catalogStore.deleteBrand(row.id as number)
  }
</script>

<template>
  <DataTable
    class="mt-4 rounded-lg"
    :columns="columns"
    :rows="brands"
    empty-message="No hay marcas registradas"
  >
    <template #actions="{ row }">
      <button
        class="hover:text-primary flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm text-neutral-400 transition-colors hover:bg-neutral-100"
        title="Editar"
        @click="handleEdit(row)"
      >
        <MapIcon name="edit" class="fill-primary h-6 w-6" />
      </button>
      <button
        class="hover:bg-accent-light hover:text-accent flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm text-neutral-400 transition-colors"
        title="Eliminar"
        @click="handleDelete(row)"
      >
        <MapIcon name="delete" class="stroke-accent h-6 w-6 fill-none" />
      </button>
    </template>
  </DataTable>
</template>
