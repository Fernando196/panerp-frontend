import { useRecetaStore } from '~/store/receta.store'

export function useRecetaFiltros() {
  const store = useRecetaStore()

  const search = ref('')

  const searchDebounced = refDebounced(search, 300)

  const hayFiltros = computed(() => !!search.value)

  function clearFiltros() {
    search.value = ''
  }

  watch(searchDebounced, () => {
    store.fetch({
      search: searchDebounced.value || undefined,
    })
  })

  return { search, hayFiltros, clearFiltros }
}
