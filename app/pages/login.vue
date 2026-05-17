<script setup lang="ts">
import { Eye, EyeOff, Loader2, LogIn, WifiOff, Wheat } from 'lucide-vue-next'
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
          class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30"
        >
          <Wheat :size="28" class="text-white" />
        </div>
        <div class="text-center">
          <h1 class="text-2xl font-bold tracking-tight text-white">PanERP</h1>
          <p class="mt-0.5 text-sm text-slate-400">Sistema de gestión para panadería</p>
        </div>
      </div>

      <!-- Card -->
      <div
        class="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/50"
      >
        <h2 class="mb-5 text-[15px] font-semibold text-white">Iniciar sesión</h2>

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
          <div>
            <label class="mb-1.5 block text-[12.5px] font-medium text-slate-400">
              Correo electrónico
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              placeholder="correo@panaderia.mx"
              :disabled="loading"
              class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-[13.5px] text-white placeholder:text-slate-500 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="mb-1.5 block text-[12.5px] font-medium text-slate-400">
              Contraseña
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                :disabled="loading"
                class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 pr-10 text-[13.5px] text-white placeholder:text-slate-500 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                tabindex="-1"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" :size="15" />
                <Eye v-else :size="15" />
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || isOffline"
            class="btn btn-primary mt-1 w-full justify-center py-2.5 text-[13.5px] disabled:cursor-not-allowed disabled:opacity-50"
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
