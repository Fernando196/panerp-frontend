import { useAuthStore } from '~/store/auth.store'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // if (!auth.isAuthenticated) {
  //   return navigateTo('/login')
  // }

  // // Role-based access: only admin can access /usuarios
  // if (to.path.startsWith('/usuarios') && !auth.isAdmin) {
  //   return navigateTo('/')
  // }

  // // Only admin and contabilidad can access /contabilidad
  // if (to.path.startsWith('/contabilidad') && !auth.isAdmin && !auth.isContabilidad) {
  //   return navigateTo('/')
  // }
})
