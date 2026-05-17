<script setup lang="ts">
  import MapIcon from '../MapIcon/MapIcon.vue'

  interface Option {
    id: number | string
    label: string
  }

  interface Props {
    id: number | string
    label?: string
    options: Option[]
    placeholder?: string
    disabled?: boolean
  }

  const props = defineProps<Props>()
  const modelValue = defineModel<number | string | null>({ default: null })

  const open = ref(false)
  const triggerRef = ref<HTMLElement | null>(null)
  const menuStyle = ref<{ top: string; left: string; width: string }>({
    top: '0px',
    left: '0px',
    width: '0px',
  })

  const selectedLabel = computed(
    () => props.options.find((o) => o.id === modelValue.value)?.label ?? null
  )

  function openDropdown() {
    if (open.value) {
      open.value = false
      return
    }
    if (props.disabled || !triggerRef.value) return
    const rect = triggerRef.value.getBoundingClientRect()
    menuStyle.value = {
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
    }
    open.value = true
  }

  function select(option: Option) {
    modelValue.value = option.id
    open.value = false
  }

  function handleOutsideClick(e: MouseEvent) {
    if (open.value && !triggerRef.value?.contains(e.target as Node)) {
      open.value = false
    }
  }

  onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
  onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>

<template>
  <div class="flex w-full flex-col">
    <span
      v-if="label"
      :id="`dropdown-label-${id}`"
      class="text-muted truncate text-[12.5px] font-medium whitespace-nowrap"
      >{{ label }}</span
    >
    <button
      ref="triggerRef"
      :aria-labelledby="'dropdown-label-' + id"
      type="button"
      class="border-border focus:border-primary mt-2 flex h-9 w-full items-center justify-between rounded-sm border px-2 transition-colors outline-none"
      :class="disabled ? 'cursor-not-allowed bg-gray-50 text-gray-400' : 'cursor-pointer bg-white'"
      @click="openDropdown"
    >
      <span :class="selectedLabel ? 'text-gray-900' : 'text-gray-400'">
        {{ selectedLabel ?? placeholder ?? 'Seleccionar...' }}
      </span>
      <MapIcon
        name="arrow-down"
        class="h-4 w-4 shrink-0 stroke-gray-400 transition-transform"
        :class="open ? 'rotate-180' : ''"
      />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        :style="menuStyle"
        class="border-border fixed z-9999 max-h-60 overflow-y-auto rounded-sm border bg-white shadow-md"
      >
        <ul>
          <li
            v-for="option in options"
            :key="option.id"
            class="hover:bg-primary-light cursor-pointer px-3 py-2 text-sm"
            :class="modelValue === option.id ? 'bg-primary-light text-primary font-medium' : ''"
            @mousedown.prevent="select(option)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
