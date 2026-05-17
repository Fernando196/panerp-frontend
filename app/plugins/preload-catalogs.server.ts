export default defineNuxtPlugin(async () => {
  const catalog = useCatalog()
  await catalog.loadInitialData()
})
