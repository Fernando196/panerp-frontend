import { useOnline } from '@vueuse/core'

export function useOffline() {
  const isOnline = useOnline()
  const isOffline = computed(() => !isOnline.value)

  return { isOnline, isOffline }
}
