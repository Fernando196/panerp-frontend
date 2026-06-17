import { useClienteStore } from '~/store/cliente.store'

export function useClienteFiltros() {
  const store = useClienteStore()

  const search = ref('')
  const conSaldo = ref(false)

  const searchDebounced = refDebounced(search, 300)

  const hayFiltros = computed(() => !!search.value || conSaldo.value)

  const itemsFiltrados = computed(() =>
    conSaldo.value ? store.items.filter((x) => Number(x.saldoPendiente) > 0) : store.items,
  )

  function clearFiltros() {
    search.value = ''
    conSaldo.value = false
  }

  watch(searchDebounced, () => {
    store.fetch({ search: searchDebounced.value || undefined })
  })

  return { search, conSaldo, hayFiltros, itemsFiltrados, clearFiltros }
}
