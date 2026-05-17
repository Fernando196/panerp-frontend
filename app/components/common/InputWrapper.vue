<script setup lang="ts">
  import type { InputTypeHTMLAttribute } from 'vue'

  interface Props {
    id: number | string
    label: string
    type: InputTypeHTMLAttribute
    disabled?: boolean
    isTextArea?: boolean
    rows?: number
    placeholder?: string
  }
  defineProps<Props>()

  const value = defineModel<number | string | null>()
</script>
<template>
  <div class="flex w-full flex-col">
    <label :for="'input-wrapper-' + id" class="input-label-muted">{{ label }}</label>
    <input
      v-if="!isTextArea"
      :id="'input-wrapper-' + id"
      v-model="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :type="type"
      class="input-content"
      autocomplete="off"
    />
    <textarea
      v-else
      :id="'input-wrapper-' + id"
      v-model="value"
      :placeholder="placeholder"
      :rows="rows || 3"
      class="input-content resize-none"
      autocomplete="off"
    />
  </div>
</template>
