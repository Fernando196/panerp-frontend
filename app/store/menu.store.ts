import { MOCK_MENU } from '~/const/menu.const'
import type { IMenu } from '~/types/menu.type'

export const useMenuStore = defineStore('menu', () => {
  const menu = ref<IMenu>({
    items: MOCK_MENU,
  })
  const menuItems = computed(() => menu.value.items)
  const childrenItems = computed(() => menu.value.items.flatMap((item) => item.children || []))
  const activeMenuItem = computed(() => {
    const route = useRoute()
    return (
      menuItems.value.find((item) => item.path === route.path) ||
      childrenItems.value.find((child) => child.path === route.path)
    )
  })

  return {
    menuItems,
    childrenItems,
    activeMenuItem,
  }
})
