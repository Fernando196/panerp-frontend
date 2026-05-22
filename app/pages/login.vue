<script setup lang="ts">
import { Eye, Loader2, LogIn, WifiOff, Wheat, EyeOff } from 'lucide-vue-next'
import InputWrapper from '~/components/common/InputWrapper.vue'
import { useAuthStore } from '~/store/auth.store'

definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const { isOffline } = useOffline()

// Redirect if already authenticated
if (auth.isAuthenticated) {
  await navigateTo(roleHome(auth.rol))
}

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

function roleHome(rol: string) {
  if (rol === 'repartidor') return '/entregas'
  if (rol === 'produccion') return '/produccion'
  if (rol === 'contabilidad') return '/contabilidad'
  return '/'
}

async function handleSubmit() {
  if (loading.value || isOffline.value) return
  error.value = ''
  loading.value = true

  try {
    await auth.login(form.email, form.password)
    await navigateTo(roleHome(auth.rol))
  } catch (e: unknown) {
    error.value = e as string;
    if (e && typeof e === 'object' && 'data' in e) {
      const apiErr = e as { data?: { message?: string } }
      error.value = apiErr.data?.message ?? 'Credenciales incorrectas'
    } else {
      error.value = 'No se pudo conectar al servidor'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- Offline banner -->
    <Transition name="slide-down">
      <div
        v-if="isOffline"
        class="flex items-center justify-center gap-2 bg-warning/10 px-4 py-2.5 text-[13px] text-warning"
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
          class="flex h-14 w-14 items-center justify-center text-white rounded-2xl bg-primary shadow-lg shadow-primary/30"
        >
          <Wheat :size="28" class="" />
        </div>
        <div class="text-center">
          <h1 class="text-2xl font-bold tracking-tight ">Panaderia Osuka</h1>
          <p class="mt-0.5 text-sm text-slate-400">Sistema de gestión para panadería</p>
        </div>
      </div>

      <!-- Card -->
      <div
        class="w-full max-w-sm rounded-2xl border border-border p-6 shadow-md shadow-black/20"
      >
        <h2 class="mb-5 text-[15px] font-semibold ">Iniciar sesión</h2>

        <!-- Error message -->
        <Transition name="fade">
          <div
            v-if="error"
            class="mb-4 flex items-start gap-2.5 rounded-lg border border-error/20 bg-error/10 px-3 py-2.5"
          >
            <span class="mt-px h-2 w-2 shrink-0 rounded-full bg-error" />
            <p class="text-[13px] leading-snug text-error">{{ error }}</p>
          </div>
        </Transition>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Email -->
          <InputWrapper
            id='login-email'
            v-model="form.email"
            label="Correo electronio o usuario"
            type="text"
            placeholder="admin"
          />

          <!-- Password -->
          <InputWrapper
            id='login-password'
            v-model="form.password"
            label="Contraseña"
            placeholder="********"
            :type=" showPassword ? 'text' : 'password' "
          >
            <template #content-right>
              <Eye v-if="showPassword" :size="20" @click="showPassword = !showPassword" />
              <EyeOff v-else :size="20" @click="showPassword = !showPassword" />
            </template>
          </InputWrapper>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || isOffline"
            class="btn btn-primary mt-1 w-full justify-center py-2.5 text-[13.5px]"
          >
            <Loader2 v-if="loading" :size="14" class="animate-spin" />
            <LogIn v-else :size="14" />
            {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
          </button>
        </form>
      </div>

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
