import { useEntregaStore } from '~/store/entrega.store'

export function useEntregaFiltros() {
  const store = useEntregaStore()

  const search = ref('')
  const estado = ref('')

  const searchDebounced = refDebounced(search, 300)

  const hayFiltros = computed(() => !!search.value || !!estado.value)

  function clearFiltros() {
    search.value = ''
    estado.value = ''
  }

  watch([searchDebounced, estado], () => {
    store.fetch({
      search: searchDebounced.value || undefined,
      estado: estado.value || undefined,
    })
  })

  return { search, estado, hayFiltros, clearFiltros }
}
