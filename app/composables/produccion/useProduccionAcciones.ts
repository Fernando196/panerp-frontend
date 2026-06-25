import { useProduccionStore } from '~/store/produccion.store'
import ProduccionFormModal from '~/components/produccion/ProduccionFormModal.vue'
import ConfirmModal from '~/components/common/Modal/ConfirmModal.vue'
import type { IProduccion } from '~/types/produccion.type'

export function useProduccionAcciones() {
  const store = useProduccionStore()
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
    const result = await openModal(ProduccionFormModal)
    if (!result) return
    await withSave(() => store.create(result))
  }

  async function handleCompletar(item: IProduccion) {
    const ok = await openModal(ConfirmModal, {
      title: 'Completar producción',
      message: '¿Marcar como completada? Esto actualizará el inventario.',
      confirmText: 'Completar',
    })
    if (!ok) return
    await withSave(() => store.completar(item.id))
  }

  async function handleCancelar(item: IProduccion) {
    const ok = await openModal(ConfirmModal, {
      title: 'Cancelar producción',
      message: '¿Cancelar esta producción?',
      confirmText: 'Cancelar producción',
    })
    if (!ok) return
    await withSave(() => store.cancelar(item.id))
  }

  return { saving, errorMsg, handleCreate, handleCompletar, handleCancelar }
}
