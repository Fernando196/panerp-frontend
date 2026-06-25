import { useEntregaStore } from '~/store/entrega.store'
import EntregaFormModal from '~/components/entrega/EntregaFormModal.vue'
import ConfirmModal from '~/components/common/Modal/ConfirmModal.vue'
import type { IEntrega } from '~/types/entrega.type'

export function useEntregaAcciones() {
  const store = useEntregaStore()
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
    const result = await openModal(EntregaFormModal, {})
    if (!result) return
    await withSave(() => store.create(result))
  }

  async function handleCancelar(item: IEntrega) {
    const ok = await openModal(ConfirmModal, {
      title: 'Cancelar entrega',
      message: '¿Estás seguro? Esta acción no se puede deshacer.',
      confirmText: 'Cancelar entrega',
    })
    if (!ok) return
    await withSave(() => store.cancelar(item.id))
  }

  return { saving, errorMsg, handleCreate, handleCancelar }
}
