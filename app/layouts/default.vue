<script setup lang="ts">
  import type { Component } from 'vue'
  import { WifiOff } from 'lucide-vue-next'
  import { useAuthStore } from '~/store/auth.store'
  import AsideMenu from '~/components/layout/AsideMenu.vue'
  import AppNavbar from '~/components/layout/AppNavbar.vue'

  interface NavItem {
    label: string
    path: string
    icon: Component
    adminOnly?: boolean
    roles?: string[]
  }

  const route = useRoute()
  const { isOffline } = useOffline()
  const sidebarOpen = ref(false)

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
      <AsideMenu :sidebar-open="sidebarOpen" @close-menu="sidebarOpen = false" />

      <!-- Main area -->
      <div class="flex min-w-0 flex-1 flex-col">
        <!-- Mobile top bar -->
        <AppNavbar @on-click-menu="sidebarOpen = true" />

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
