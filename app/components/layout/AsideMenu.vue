<script setup lang="ts">
  import { useMenuStore } from '~/store/menu.store'
  import MapIcon from '../common/MapIcon/MapIcon.vue'

  const router = useRoute()
  const menuStore = useMenuStore()
  const menuItems = menuStore.menuItems

  const closeMenu = inject<() => void>('closeMenu')
</script>
<template>
  <aside
    class="bg-subtle-bg border-border relative flex h-full w-full flex-col gap-1 border-r px-2 pt-5 text-black shadow-md"
  >
    <button v-for="item in menuItems" :key="'menu-item-' + item.id">
      <NuxtLink
        class="stroke-subtle text-subtle hover:text-text flex flex-col items-center gap-2 bg-transparent fill-none px-2 py-3 text-xs text-[13px] hover:rounded-2xl hover:bg-white"
        :class="
          router.path === item.path
            ? 'stroke-primary! text-primary! rounded-2xl bg-white! shadow-sm'
            : ''
        "
        :to="item.path"
        @click="closeMenu?.()"
      >
        <MapIcon :name="item.icon" class="w-6 xl:w-8" />
        {{ item.label }}
      </NuxtLink>
    </button>
  </aside>
</template>
