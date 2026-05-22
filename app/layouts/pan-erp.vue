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

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Inventario', path: '/inventario', icon: Package },
  { label: 'Recetas', path: '/recetas', icon: BookOpen },
  { label: 'Producción', path: '/produccion', icon: Factory },
  { label: 'Productos', path: '/productos', icon: ShoppingBag },
  { label: 'Charolas', path: '/charolas', icon: Grid3x3 },
  { label: 'Clientes', path: '/clientes', icon: Users },
  { label: 'Entregas', path: '/entregas', icon: Truck },
  { label: 'Devoluciones', path: '/devoluciones', icon: RotateCcw },
  {
    label: 'Contabilidad',
    path: '/contabilidad',
    icon: Calculator,
    roles: ['administrador', 'contabilidad'],
  },
  { label: 'Reportes', path: '/reportes', icon: BarChart2 },
  { label: 'Usuarios', path: '/usuarios', icon: UserCog, adminOnly: true },
]

const visibleItems = computed(() =>
  navItems.filter((item) => {
    if (item.adminOnly) return auth.isAdmin
    if (item.roles) return item.roles.includes(auth.rol)
    return true
  }),
)

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
  },
)
</script>

<template>
  <div class="relative flex h-screen flex-col overflow-hidden antialiased">
    <!-- Offline banner -->
    <Transition name="slide">
      <div
        v-if="isOffline"
        class="flex shrink-0 items-center justify-center gap-2 bg-warning/10 px-4 py-2 text-[12.5px] text-warning"
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
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
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

        <!-- Nav items -->
        <nav class="flex-1 overflow-y-auto px-2 py-2">
          <NuxtLink
            v-for="item in visibleItems"
            :key="item.path"
            :to="item.path"
            class="mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors"
            :class="
              isActive(item.path)
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            "
          >
            <component :is="item.icon" :size="15" class="shrink-0" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- User footer -->
        <div class="shrink-0 border-t border-slate-800 p-2">
          <div class="flex items-center gap-2.5 rounded-lg px-3 py-2">
            <div
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary"
            >
              {{ auth.user?.nombre?.charAt(0).toUpperCase() ?? 'U' }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[12.5px] font-medium text-white">
                {{ auth.user?.nombre ?? 'Usuario' }}
              </p>
              <p class="truncate text-[11px] capitalize text-slate-500">{{ auth.rol }}</p>
            </div>
            <button
              class="shrink-0 text-slate-500 transition-colors hover:text-error"
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
