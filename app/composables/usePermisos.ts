import { useAuthStore } from '~/store/auth.store'

export function usePermisos() {
  const auth = useAuthStore()

  const puedeEditar = computed(() => auth.isAdmin || auth.isProduccion)
  const puedeEliminar = computed(() => auth.isAdmin)
  const puedeAjustar = computed(() => auth.isAdmin)

  return { puedeEditar, puedeEliminar, puedeAjustar }
}
