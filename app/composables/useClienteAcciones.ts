import { useClienteStore } from '~/store/cliente.store'
import ClienteFormModal from '~/components/cliente/ClienteFormModal.vue'
import ConfirmModal from '~/components/common/Modal/ConfirmModal.vue'
import type { ICliente } from '~/types/cliente.type'

export function useClienteAcciones() {
  const store = useClienteStore()
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
    const result = await openModal(ClienteFormModal, {})
    if (!result) return
    await withSave(() => store.create(result))
  }

  async function handleEdit(item: ICliente) {
    const result = await openModal(ClienteFormModal, { item })
    if (!result) return
    await withSave(() => store.update(item.id, result))
  }

  async function handleDelete(item: ICliente) {
    const ok = await openModal(ConfirmModal, {
      title: `Eliminar ${item.nombre}`,
      message: '¿Estás seguro? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
    })
    if (!ok) return
    await withSave(() => store.remove(item.id))
  }

  return { saving, errorMsg, handleCreate, handleEdit, handleDelete }
}
