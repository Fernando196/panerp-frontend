import { useCharolaStore } from '~/store/charola.store'
import CharolaFormModal from '~/components/charola/CharolaFormModal.vue'
import AsignarClienteModal from '~/components/charola/AsignarClienteModal.vue'
import ConfirmModal from '~/components/common/Modal/ConfirmModal.vue'
import type { ICharola } from '~/types/charola.type'

export function useCharolaAcciones() {
  const store = useCharolaStore()
  const { openModal } = useModal()

  const saving = ref(false)
  const errorMsg = ref('')

  async function withSave<T>(fn: () => Promise<T>): Promise<T | undefined> {
    saving.value = true
    errorMsg.value = ''
    try {
      return await fn()
    } catch (e) {
      errorMsg.value =
        (e as { data?: { message?: string } })?.data?.message ?? 'Error inesperado'
    } finally {
      saving.value = false
    }
  }

  async function handleCreate() {
    const result = await openModal(CharolaFormModal, {})
    if (!result) return
    await withSave(() => store.create(result))
  }

  async function handleEdit(item: ICharola) {
    const result = await openModal(CharolaFormModal, { item })
    if (!result) return
    await withSave(() => store.update(item.id, result))
  }

  async function handleDelete(item: ICharola) {
    const ok = await openModal(ConfirmModal, {
      title: `Eliminar ${item.codigo}`,
      message: '¿Estás seguro? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
    })
    if (!ok) return
    await withSave(() => store.remove(item.id))
  }

  async function handleAsignar(item: ICharola) {
    const clienteId = await openModal(AsignarClienteModal, { item })
    if (!clienteId) return
    await withSave(() => store.asignar(item.id, { clienteId }))
  }

  async function handleLiberar(item: ICharola) {
    const ok = await openModal(ConfirmModal, {
      title: `Liberar ${item.codigo}`,
      message: '¿Liberar charola? Volverá a estado disponible.',
      confirmText: 'Liberar',
    })
    if (!ok) return
    await withSave(() => store.liberar(item.id))
  }

  return {
    saving,
    errorMsg,
    handleCreate,
    handleEdit,
    handleDelete,
    handleAsignar,
    handleLiberar,
  }
}
