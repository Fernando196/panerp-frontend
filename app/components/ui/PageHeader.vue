<script lang="ts" setup>
  interface Props {
    title: string
    subtitle?: string
  }

  defineProps<Props>()
</script>
<template>
  <div class="page-header">
    <div class="page-header-content">
      <div class="page-header-content-titles">
        <h1 class="page-title">{{ title }}</h1>
        <span v-if="subtitle" class="page-subtitle">{{ subtitle }}</span>
      </div>
      <slot name="right" />
    </div>
    <slot name="bottom" />
  </div>
</template>
<style lang="css" scoped>
  @reference '~/assets/css/main.css';

  .page-header {
    @apply flex flex-col gap-4;
  }
  .page-header-content {
    @apply flex items-center justify-between;
  }
  .page-header-content-titles {
    @apply flex flex-col;
  }
  .page-title {
    @apply text-xl font-semibold;
    letter-spacing: -0.02em;
  }
  .page-subtitle {
    @apply text-muted m-0 text-[13.5px];
  }
</style>
