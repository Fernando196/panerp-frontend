import { useInventarioStore } from '~/store/inventario.store'

export function useInventarioFiltros() {
  const store = useInventarioStore()

  const search = ref('')
  const categoria = ref('')
  const soloStockBajo = ref(false)

  const searchDebounced = refDebounced(search, 300)

  const hayFiltros = computed(
    () => !!search.value || !!categoria.value || soloStockBajo.value,
  )

  function clearFiltros() {
    search.value = ''
    categoria.value = ''
    soloStockBajo.value = false
  }

  watch([searchDebounced, categoria, soloStockBajo], () => {
    store.fetch({
      search: searchDebounced.value || undefined,
      categoria: categoria.value || undefined,
      stockBajo: soloStockBajo.value ? 'true' : undefined,
    })
  })

  return { search, categoria, soloStockBajo, hayFiltros, clearFiltros }
}
