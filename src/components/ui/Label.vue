<script setup lang="ts">
import { computed } from 'vue';

type LabelSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

const props = withDefaults(
    defineProps<{
        label?: string;
        required?: boolean;
        size?: LabelSize;
        htmlFor?: string;
        class?: string;
    }>(),
    {
        required: false,
        size: 'base',
    }
);

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'xs':
            return 'text-xs leading-[16px]';
        case 'sm':
            return 'text-sm leading-[20px]';
        case 'base':
            return 'text-base leading-[24px]';
        case 'lg':
            return 'text-lg leading-[28px]';
        case 'xl':
            return 'text-xl leading-[32px]';
        default:
            return 'text-base leading-[24px]';
    }
});
</script>

<template>
    <label v-if="label" :for="htmlFor" :class="[
        'font-medium whitespace-pre-line text-[var(--color-secondary-800)] transition-colors inline-block',
        sizeClasses,
        props.class
    ]">
        {{ label }}
        <span v-if="required" class="ml-0.5 text-red-500">*</span>
    </label>
</template>