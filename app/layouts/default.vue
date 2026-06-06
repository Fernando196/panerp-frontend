<script setup lang="ts">
  import type { Component } from 'vue'
  import {
    LayoutDashboard,
    Package,
    BookOpen,
    Factory,
    ShoppingBag,
    Grid3x3,
    Users,
    Truck,
    RotateCcw,
    Calculator,
    BarChart2,
    UserCog,
    Wheat,
    Menu,
    X,
    LogOut,
    WifiOff,
  } from 'lucide-vue-next'
  import { useAuthStore } from '~/store/auth.store'
  import AsideMenu from '~/components/layout/AsideMenu.vue'

  interface NavItem {
    label: string
    path: string
    icon: Component
    adminOnly?: boolean
    roles?: string[]
  }

  const auth = useAuthStore()
  const route = useRoute()
  const { isOffline } = useOffline()
  const sidebarOpen = ref(false)

  function isActive(path: string) {
    if (path === '/') return route.path === '/'
    return route.path.startsWith(path)
  }

  async function handleLogout() {
    await auth.logout()
    navigateTo('/login')
  }

  watch(
    () => route.path,
    () => {
      sidebarOpen.value = false
    }
  )
</script>

<template>
  <div class="relative flex h-screen flex-col overflow-hidden antialiased">
    <!-- Offline banner -->
    <Transition name="slide">
      <div
        v-if="isOffline"
        class="bg-warning/10 text-warning flex shrink-0 items-center justify-center gap-2 px-4 py-2 text-[12.5px]"
      >
        <WifiOff :size="13" class="shrink-0" />
        <span>Sin conexión — modo offline activo</span>
      </div>
    </Transition>

    <div class="flex min-h-0 flex-1">
      <!-- Mobile backdrop -->
      <Transition name="fade">
        <div
          v-if="sidebarOpen"
          class="absolute inset-0 z-20 bg-black/60 md:hidden"
          @click="sidebarOpen = false"
        />
      </Transition>

      <!-- Sidebar -->
      <aside
        class="absolute inset-y-0 left-0 z-30 flex w-56 shrink-0 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 ease-in-out md:relative md:translate-x-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <!-- Logo -->
        <div class="flex shrink-0 items-center gap-2.5 border-b border-slate-800 px-4 py-3.5">
          <div class="bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
            <Wheat :size="14" class="text-white" />
          </div>
          <span class="text-[15px] font-bold tracking-tight text-white">PanERP</span>
          <button
            class="ml-auto text-slate-500 transition-colors hover:text-white md:hidden"
            @click="sidebarOpen = false"
          >
            <X :size="16" />
          </button>
        </div>

        <AsideMenu />

        <!-- User footer -->
        <div class="shrink-0 border-t border-slate-800 p-2">
          <div class="flex items-center gap-2.5 rounded-lg px-3 py-2">
            <div
              class="bg-primary/20 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
            >
              {{ auth.user?.nombre?.charAt(0).toUpperCase() ?? 'U' }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[12.5px] font-medium text-white">
                {{ auth.user?.nombre ?? 'Usuario' }}
              </p>
              <p class="truncate text-[11px] text-slate-500 capitalize">{{ auth.rol }}</p>
            </div>
            <button
              class="hover:text-error shrink-0 text-slate-500 transition-colors"
              title="Cerrar sesión"
              @click="handleLogout"
            >
              <LogOut :size="14" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Main area -->
      <div class="flex min-w-0 flex-1 flex-col">
        <!-- Mobile top bar -->
        <div
          class="flex shrink-0 items-center border-b border-slate-800 bg-slate-900 px-4 py-3 md:hidden"
        >
          <button
            class="mr-3 text-slate-400 transition-colors hover:text-white"
            @click="sidebarOpen = true"
          >
            <Menu :size="20" />
          </button>
          <div class="flex items-center gap-2">
            <Wheat :size="15" class="text-primary" />
            <span class="text-sm font-bold text-white">PanERP</span>
          </div>
        </div>

        <main class="flex-1 overflow-auto">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .slide-enter-active,
  .slide-leave-active {
    transition:
      max-height 0.25s ease,
      opacity 0.25s ease;
    overflow: hidden;
    max-height: 48px;
  }
  .slide-enter-from,
  .slide-leave-to {
    max-height: 0;
    opacity: 0;
  }
</style>
