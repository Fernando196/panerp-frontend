import { useLocalStorage } from '@vueuse/core'
import { useOffline } from './useOffline'

interface SyncOperation {
  id: string
  timestamp: string
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  body?: unknown
}

export function useSync() {
  const config = useRuntimeConfig()
  const { isOnline } = useOffline()
  const queue = useLocalStorage<SyncOperation[]>('pan-erp-sync-queue', [])
  const isSyncing = ref(false)
  const lastSync = useLocalStorage<string | null>('pan-erp-last-sync', null)

  function enqueue(operation: Omit<SyncOperation, 'id' | 'timestamp'>) {
    queue.value.push({
      ...operation,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    })
  }

  async function sync() {
    if (isSyncing.value || !isOnline.value || queue.value.length === 0) return
    isSyncing.value = true

    try {
      const auth = useLocalStorage<string | null>('pan-erp-token', null)
      const ops = [...queue.value]

      await $fetch<{ data: unknown }>('/api/v1/sync', {
        baseURL: config.public.apiBase as string,
        method: 'POST',
        headers: auth.value ? { Authorization: `Bearer ${auth.value}` } : {},
        body: { operaciones: ops },
      })

      queue.value = []
      lastSync.value = new Date().toISOString()
    } catch {
      // Silently fail — retry on next connection
    } finally {
      isSyncing.value = false
    }
  }

  // Auto-sync when connection is restored
  watch(isOnline, (online) => {
    if (online) sync()
  })

  return { queue, isSyncing, lastSync, enqueue, sync }
}
