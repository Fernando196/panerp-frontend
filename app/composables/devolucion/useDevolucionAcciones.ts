import { useDevolucionStore } from '~/store/devolucion.store'
import DevolucionFormModal from '~/components/devolucion/DevolucionFormModal.vue'

export function useDevolucionAcciones() {
  const store = useDevolucionStore()
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
    const result = await openModal(DevolucionFormModal)
    if (!result) return
    await withSave(() => store.create(result))
  }

  return { saving, errorMsg, handleCreate }
}
