<script setup lang="ts">
  import { LogOut, Wheat, X } from 'lucide-vue-next'
  import { useAuthStore } from '~/store/auth.store'
  import { useMenuStore } from '~/store/menu.store'

  interface Props {
    sidebarOpen: boolean
  }

  defineProps<Props>()

  const auth = useAuthStore()
  const router = useRoute()
  const menuStore = useMenuStore()
  const menuItems = menuStore.menuItems

  const emit = defineEmits(['closeMenu'])

  async function handleLogout() {
    await auth.logout()
    navigateTo('/login')
  }
</script>
<template>
  <aside
    class="border-r-border bg-menu-bg absolute inset-y-0 left-0 z-30 flex w-56 shrink-0 flex-col border-r transition-transform duration-300 ease-in-out md:relative md:translate-x-0"
    :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo -->
    <div class="border-border flex shrink-0 items-center gap-2.5 border-b px-4 py-3.5">
      <div class="bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
        <Wheat :size="14" class="text-white" />
      </div>
      <span class="text-[15px] font-bold tracking-tight">Panaderia</span>
      <button
        class="ml-auto text-slate-500 transition-colors hover:text-white md:hidden"
        @click="emit('closeMenu')"
      >
        <X :size="16" />
      </button>
    </div>

    <div class="mt-4 flex flex-1 flex-col overflow-auto">
      <button v-for="item in menuItems" :key="'menu-item-' + item.id">
        <NuxtLink
          class="stroke-subtle text-subtle hover:text-text inline-flex flex-col items-center gap-2 bg-transparent fill-none px-5 py-3 text-xs text-[13px] hover:rounded-2xl hover:bg-white"
          :class="
            router.path === item.path
              ? 'stroke-primary! text-primary! rounded-2xl bg-white! shadow-sm'
              : ''
          "
          :to="item.path"
          @click="emit('closeMenu')"
        >
          <component :is="item.icon" />
          {{ item.label }}
        </NuxtLink>
      </button>
    </div>

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
</template>
