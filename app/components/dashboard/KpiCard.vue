<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  subtitle?: string
  accent?: 'primary' | 'secondary' | 'accent' | 'ready' | 'pending'
}

withDefaults(defineProps<Props>(), { accent: 'primary' })

const accentMap = {
  primary: { bar: 'bg-primary', bg: 'bg-primary-light', icon: 'text-primary' },
  secondary: { bar: 'bg-secondary', bg: 'bg-secondary-light', icon: 'text-secondary' },
  accent: { bar: 'bg-accent', bg: 'bg-accent-light', icon: 'text-accent' },
  ready: { bar: 'bg-status-ready', bg: 'bg-status-ready-bg', icon: 'text-status-ready' },
  pending: { bar: 'bg-status-pending', bg: 'bg-status-pending-bg', icon: 'text-status-pending' },
}
</script>

<template>
  <div class="relative overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm">
    <div :class="accentMap[accent].bar" class="absolute inset-y-0 left-0 w-1" />
    <div class="py-4 pr-4 pl-5">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <p class="truncate text-[11px] font-medium tracking-wider text-neutral-400 uppercase">
            {{ title }}
          </p>
          <p class="mt-1 text-2xl font-bold leading-tight text-neutral-900">{{ value }}</p>
          <p v-if="subtitle" class="mt-1 text-xs text-neutral-400">{{ subtitle }}</p>
        </div>
        <div
          :class="[accentMap[accent].bg, accentMap[accent].icon]"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        >
          <slot name="icon" />
        </div>
      </div>
    </div>
  </div>
</template>
