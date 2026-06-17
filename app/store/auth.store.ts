import { defineStore } from 'pinia'
import type { IAuthUser } from '~/types/auth/auth.type'

export const useAuthStore = defineStore('auth', () => {
  const userCookie = useCookie<IAuthUser | null>('pan-erp-user', {
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    sameSite: 'lax',
  })
  const token = useCookie<string | null>('pan-erp-token', {
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    sameSite: 'lax',
  })

  const user = ref<IAuthUser | null>(userCookie.value || null)
  const isAuthenticated = computed(() => !!token.value)
  const rol = computed(() => user.value?.rol?.nombre ?? '')

  const isAdmin = computed(() => rol.value === 'administrador')
  const isProduccion = computed(() => rol.value === 'produccion')
  const isRepartidor = computed(() => rol.value === 'repartidor')
  const isContabilidad = computed(() => rol.value === 'contabilidad')

  function authHeaders(): Record<string, string> {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  function setToken(newToken: string) {
    token.value = newToken
  }

  function setUser(newUser: IAuthUser) {
    user.value = newUser
    userCookie.value = newUser
  }

  function logout() {
    cleanAuth()
    navigateTo('/login')
  }

  function cleanAuth() {
    token.value = null
    user.value = null
    userCookie.value = null
  }

  return {
    token,
    user,
    isAuthenticated,
    rol,
    isAdmin,
    isProduccion,
    isRepartidor,
    isContabilidad,
    authHeaders,
    setUser,
    setToken,
    logout,
  }
})
