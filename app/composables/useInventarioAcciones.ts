import { useInventarioStore } from '~/store/inventario.store'
import MateriaPrimaFormModal from '~/components/inventario/MateriaPrimaFormModal.vue'
import MovimientoModal from '~/components/inventario/MovimientoModal.vue'
import ConfirmModal from '~/components/common/Modal/ConfirmModal.vue'
import type { IMateriaPrima } from '~/types/inventario.type'

export function useInventarioAcciones() {
  const store = useInventarioStore()
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
    const result = await openModal(MateriaPrimaFormModal, { categorias: store.categorias })
    if (!result) return
    await withSave(() => store.create(result))
  }

  async function handleEdit(item: IMateriaPrima) {
    const result = await openModal(MateriaPrimaFormModal, { item, categorias: store.categorias })
    if (!result) return
    await withSave(() => store.update(item.id, result))
  }

  async function handleEntrada(item: IMateriaPrima) {
    const result = await openModal(MovimientoModal, { item, tipo: 'entrada' })
    if (!result) return
    await withSave(() => store.registrarEntrada(item.id, result))
  }

  async function handleAjuste(item: IMateriaPrima) {
    const result = await openModal(MovimientoModal, { item, tipo: 'ajuste' })
    if (!result) return
    await withSave(() => store.registrarAjuste(item.id, result))
  }

  async function handleDelete(item: IMateriaPrima) {
    const ok = await openModal(ConfirmModal, {
      title: `Eliminar ${item.nombre}`,
      message: '¿Estás seguro? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
    })
    if (!ok) return
    await withSave(() => store.remove(item.id))
  }

  return { saving, errorMsg, handleCreate, handleEdit, handleEntrada, handleAjuste, handleDelete }
}
