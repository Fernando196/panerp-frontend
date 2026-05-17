import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export interface AuthUser {
  id: string
  nombre: string
  email: string
  rol: { id: string; nombre: string }
}

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()

  const token = useLocalStorage<string | null>('pan-erp-token', null)
  const user = useLocalStorage<AuthUser | null>('pan-erp-user', null)

  const isAuthenticated = computed(() => !!token.value)
  const rol = computed(() => user.value?.rol?.nombre ?? '')
  const isAdmin = computed(() => rol.value === 'administrador')
  const isRepartidor = computed(() => rol.value === 'repartidor')
  const isProduccion = computed(() => rol.value === 'produccion')
  const isContabilidad = computed(() => rol.value === 'contabilidad')

  function authHeaders() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  async function login(email: string, password: string): Promise<void> {
    const res = await $fetch<{ data: { token: string; usuario: AuthUser } }>(
      '/api/v1/auth/login',
      {
        baseURL: config.public.apiBase as string,
        method: 'POST',
        body: { email, password },
      },
    )
    token.value = res.data.token
    user.value = res.data.usuario
  }

  async function logout(): Promise<void> {
    try {
      if (token.value) {
        await $fetch('/api/v1/auth/logout', {
          baseURL: config.public.apiBase as string,
          method: 'POST',
          headers: authHeaders(),
        })
      }
    } finally {
      token.value = null
      user.value = null
    }
  }

  async function refreshMe(): Promise<void> {
    if (!token.value) return
    try {
      const res = await $fetch<{ data: AuthUser }>('/api/v1/auth/me', {
        baseURL: config.public.apiBase as string,
        headers: authHeaders(),
      })
      user.value = res.data
    } catch {
      token.value = null
      user.value = null
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    rol,
    isAdmin,
    isRepartidor,
    isProduccion,
    isContabilidad,
    authHeaders,
    login,
    logout,
    refreshMe,
  }
})
