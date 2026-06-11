<script setup lang="ts">
  import { useMenuStore } from '~/store/menu.store'

  const menuStore = useMenuStore()
  const router = useRoute()
  const menuMobileItems = menuStore.menuMobileItems
</script>
<template>
  <div class="absolute bottom-0 flex w-full bg-white shadow-xs">
    <NuxtLink
      v-for="item in menuMobileItems"
      class="flex flex-1 flex-col items-center justify-center gap-2 border-t-2 py-4 text-black"
      :class="[router.path === item.path ? 'text-primary border-t' : 'border-t-border']"
      :to="item.path"
    >
      <component :is="item.icon" />
      <span class="text-[11px] font-semibold">{{ item.label }}</span>
    </NuxtLink>
  </div>
</template>
