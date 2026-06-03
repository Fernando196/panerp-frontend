<script setup lang="ts">
  import { WifiOff, Wheat } from 'lucide-vue-next'
  import LoginForm from '~/components/auth/LoginForm.vue'
  import { useLogin } from '~/composables/auth/useLogin'
  import { useAuthStore } from '~/store/auth.store'
  import type { ICredentials } from '~/types/auth/auth.type'

  definePageMeta({ layout: 'auth' })

  const login = useLogin()
  const authStore = useAuthStore()
  const { isOffline } = useOffline()

  // Redirect if already authenticated
  if (authStore.isAuthenticated) {
    await navigateTo('/')
  }

  const isLoading = ref(false)
  const error = ref('')

  async function handleSubmit(form: ICredentials) {
    if (isLoading.value || isOffline.value) return
    error.value = ''
    isLoading.value = true

    try {
      await login.onLogin(form.email, form.password)
    } catch (e: unknown) {
      error.value = e as string
      if (e && typeof e === 'object' && 'data' in e) {
        const apiErr = e as { data?: { message?: string } }
        error.value = apiErr.data?.message ?? 'Credenciales incorrectas'
      } else {
        error.value = 'No se pudo conectar al servidor'
      }
    } finally {
      isLoading.value = false
    }
  }
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- Offline banner -->
    <Transition name="slide-down">
      <div
        v-if="isOffline"
        class="bg-warning/10 text-warning flex items-center justify-center gap-2 px-4 py-2.5 text-[13px]"
      >
        <WifiOff :size="14" class="shrink-0" />
        <span>Sin conexión — el inicio de sesión requiere internet</span>
      </div>
    </Transition>

    <!-- Main content -->
    <div class="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <!-- Logo -->
      <div class="mb-8 flex flex-col items-center gap-3">
        <div
          class="bg-primary shadow-primary/30 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
        >
          <Wheat :size="28" class="" />
        </div>
        <div class="text-center">
          <h1 class="text-2xl font-bold tracking-tight">Panaderia Osuka</h1>
          <p class="mt-0.5 text-sm text-slate-400">Sistema de gestión para panadería</p>
        </div>
      </div>

      <LoginForm
        :error="error"
        :is-loading="isLoading"
        :is-offline="isOffline"
        @on-submit="handleSubmit"
      />

      <!-- Footer -->
      <p class="mt-6 text-center text-[12px] text-slate-600">
        PanERP v1.0 &middot; {{ new Date().getFullYear() }}
      </p>
    </div>
  </div>
</template>

<style scoped>
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition:
      max-height 0.25s ease,
      opacity 0.25s ease;
    overflow: hidden;
    max-height: 80px;
  }
  .slide-down-enter-from,
  .slide-down-leave-to {
    max-height: 0;
    opacity: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
