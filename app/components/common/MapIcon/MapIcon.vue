<script setup lang="ts">
  import { CAT_ICONS } from '~/const/icons.const'
  import type { Icons } from '~/types/icons.type'

  const componentMap: Record<Icons, Component> = {
    [CAT_ICONS.DASHBOARD]: defineAsyncComponent(() => import('./icons/DashboardIcon.vue')),
    [CAT_ICONS.LAUNDRY]: defineAsyncComponent(() => import('./icons/LaundryIcon.vue')),
    [CAT_ICONS.INVENTORY]: defineAsyncComponent(() => import('./icons/IventoryIcon.vue')),
    [CAT_ICONS.USERS]: defineAsyncComponent(() => import('./icons/UsersIcon.vue')),
    [CAT_ICONS.CONFIG]: defineAsyncComponent(() => import('./icons/ConfigIcon.vue')),
    [CAT_ICONS.INFO]: defineAsyncComponent(() => import('./icons/InfoIcon.vue')),
    [CAT_ICONS.ORDER]: defineAsyncComponent(() => import('./icons/OrderIcon.vue')),
    [CAT_ICONS.FILE]: defineAsyncComponent(() => import('./icons/FileIcon.vue')),
    [CAT_ICONS.CLOSE]: defineAsyncComponent(() => import('./icons/CloseIcon.vue')),
    [CAT_ICONS.SEARCH]: defineAsyncComponent(() => import('./icons/SearchIcon.vue')),
    [CAT_ICONS.ADD]: defineAsyncComponent(() => import('./icons/AddIcon.vue')),
    [CAT_ICONS.TIME]: defineAsyncComponent(() => import('./icons/TimeIcon.vue')),
    [CAT_ICONS.DELETE]: defineAsyncComponent(() => import('./icons/DeleteIcon.vue')),
    [CAT_ICONS.MONEY]: defineAsyncComponent(() => import('./icons/Money.vue')),
    [CAT_ICONS.EDIT]: defineAsyncComponent(() => import('./icons/EditIcon.vue')),
    [CAT_ICONS.ARROW_DOWN]: defineAsyncComponent(() => import('./icons/ArrowDownIcon.vue')),
    [CAT_ICONS.CATALOGS]: defineAsyncComponent(() => import('./icons/CatalogsIcon.vue')),
    [CAT_ICONS.BRANDS]: defineAsyncComponent(() => import('./icons/BrandsIcon.vue')),
    [CAT_ICONS.STATUS]: defineAsyncComponent(() => import('./icons/StatusIcon.vue')),
    [CAT_ICONS.USER_ROLE]: defineAsyncComponent(() => import('./icons/UserRoleIcon.vue')),
    [CAT_ICONS.SOAP]: defineAsyncComponent(() => import('./icons/SoapIcon.vue')),
    [CAT_ICONS.MENU]: defineAsyncComponent(() => import('./icons/MenuIcon.vue')),
    [CAT_ICONS.LABEL]: defineAsyncComponent(() => import('./icons/LabelIcon.vue')),
    [CAT_ICONS.ALERT]: defineAsyncComponent(() => import('./icons/AlertIcon.vue')),
    [CAT_ICONS.SQUARE]: defineAsyncComponent(() => import('./icons/SquareIcon.vue')),
    [CAT_ICONS.PLAY]: defineAsyncComponent(() => import('./icons/PlayIcon.vue')),
  }
  defineProps<{
    name: Icons
  }>()
</script>
<template>
  <component :is="componentMap[name]" v-bind="$attrs" />
</template>
