import { useAuthStore } from '~/store/auth.store'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  console.log(auth.isAuthenticated)
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})
