import { useProductoStore } from '~/store/producto.store'
import ProductoFormModal from '~/components/producto/ProductoFormModal.vue'
import ConfirmModal from '~/components/common/Modal/ConfirmModal.vue'
import type { IProducto } from '~/types/producto.type'

export function useProductoAcciones() {
  const store = useProductoStore()
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
    const result = await openModal(ProductoFormModal, { categorias: store.categorias })
    if (!result) return
    await withSave(() => store.create(result))
  }

  async function handleEdit(item: IProducto) {
    const result = await openModal(ProductoFormModal, { item, categorias: store.categorias })
    if (!result) return
    await withSave(() => store.update(item.id, result))
  }

  async function handleDelete(item: IProducto) {
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
