import { AuthService } from '~/services/auth/auth'
import { useAuthStore } from '~/store/auth.store'

export const useLogin = () => {
  const authService = AuthService()
  const authStore = useAuthStore()
  const router = useRouter()
  const isLoading = ref<boolean>(false)

  const onLogin = async (email: string, password: string) => {
    try {
      isLoading.value = true
      const responseLogin = await authService.login({
        email,
        password,
      })
      authStore.setToken(responseLogin.token)
      authStore.setUser(responseLogin.usuario)
      await router.push('/')
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    onLogin,
  }
}
