<script setup lang="ts">
import type { Icons } from '~/types/icons.type';
import MapIcon from './MapIcon/MapIcon.vue';


interface Props {
    message: string;
    icon?: Icons;
    iconClass?: string;
}

defineProps<Props>();

</script>
<template>
    <div class="h-full w-full flex flex-col justify-center items-center text-neutral-400 stroke-neutral-400">
        <MapIcon v-if="icon" :name="icon" :class="iconClass || 'w-12 h-12'" />
        <p>{{ message }}</p>
    </div>
</template>