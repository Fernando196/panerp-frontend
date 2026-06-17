import { useProductoStore } from '~/store/producto.store'

export function useProductoFiltros() {
  const store = useProductoStore()

  const search = ref('')
  const categoria = ref('')
  const soloActivos = ref(false)

  const searchDebounced = refDebounced(search, 300)

  const hayFiltros = computed(
    () => !!search.value || !!categoria.value || soloActivos.value,
  )

  function clearFiltros() {
    search.value = ''
    categoria.value = ''
    soloActivos.value = false
  }

  watch([searchDebounced, categoria, soloActivos], () => {
    store.fetch({
      search: searchDebounced.value || undefined,
      categoria: categoria.value || undefined,
    })
  })

  return { search, categoria, soloActivos, hayFiltros, clearFiltros }
}
