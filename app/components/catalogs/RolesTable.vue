<script setup lang="ts">
  import type { IUserRole } from '~/types/user.type'
  import type { TableColumn } from '~/types/table.type'
  import ConfirmModal from '../common/Modal/ConfirmModal.vue'
  import RoleFormModal from './RoleFormModal.vue'
  import { useCatalogStore } from '~/store/catalog.store'
  import DataTable from '../ui/DataTable.vue'
  import MapIcon from '../common/MapIcon/MapIcon.vue'

  const catalogStore = useCatalogStore()
  await useAsyncData('roles', () => catalogStore.fetchRoles())
  const roles = computed(() => catalogStore.roles)
  const { openModal } = useModal()

  const columns: TableColumn<IUserRole>[] = [
    { key: 'label', label: 'Nombre' },
    { key: 'role', label: 'Clave', width: '120px' },
    { key: 'description', label: 'Descripción' },
  ]

  async function handleEdit(row: Record<string, unknown>) {
    const role = roles.value.find((r) => r.id === row.id)
    if (!role) return
    const result = await openModal(RoleFormModal, { role })
    if (!result) return
    catalogStore.updateRole(role.id, result)
  }

  async function handleDelete(row: Record<string, unknown>) {
    const result = await openModal(ConfirmModal, {
      title: 'Eliminar ' + row.label,
      message: '¿Estás seguro de que deseas eliminar este rol?',
      confirmText: 'Eliminar',
    })
    if (!result) return
    catalogStore.deleteRole(row.id as number)
  }
</script>

<template>
  <DataTable
    class="mt-4 rounded-lg"
    :columns="columns"
    :rows="roles"
    empty-message="No hay roles registrados"
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
