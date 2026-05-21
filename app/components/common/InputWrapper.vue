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

  const slots = useSlots();
</script>
<template>
  <div class="flex w-full flex-col">
    <label :for="'input-wrapper-' + id" class="input-label-muted">{{ label }}</label>
    <div class="input-container">
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

      <div v-if="slots['content-right']">
        <slot name="content-right"/>
      </div>

    </div>
  </div>
</template>
<style lang="css" scoped>

@reference '~/assets/css/main.css';

.input-container{
  @apply relative flex border-border focus:border-primary shadow-soft mt-2 w-full rounded-sm border bg-white px-2 py-2;
}

.input-label-muted {
  @apply text-muted truncate text-[12.5px] font-medium whitespace-nowrap;
}
.input-content {
  @apply flex-1 outline-none;
}
.input-content.input-disabled {
  @apply bg-muted-bg text-subtle cursor-not-allowed outline-none;
}


</style>