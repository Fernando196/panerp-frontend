import { useRecetaStore } from '~/store/receta.store'
import RecetaFormModal from '~/components/receta/RecetaFormModal.vue'
import ConfirmModal from '~/components/common/Modal/ConfirmModal.vue'
import type { IReceta } from '~/types/receta.type'

export function useRecetaAcciones() {
  const store = useRecetaStore()
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
    const result = await openModal(RecetaFormModal, {})
    if (!result) return
    await withSave(() => store.create(result))
  }

  async function handleEdit(item: IReceta) {
    const result = await openModal(RecetaFormModal, { item })
    if (!result) return
    await withSave(() => store.update(item.id, result))
  }

  async function handleDelete(item: IReceta) {
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
