<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
    type: 'primary',
    size: 'md'
})

const badgeClasses = computed(() => {
    const base = 'inline-flex items-center justify-center font-semibold tracking-wide select-none transition-all duration-200'

    const sizes = {
        sm: 'px-2 py-0.5 text-sm rounded-md font-bold uppercase tracking-wider',
        md: 'px-2.5 py-1 text-base rounded-lg'
    }

    const types = {
        primary: 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border border-[var(--color-primary-100)]',
        secondary: 'bg-[var(--color-secondary-100)] text-[var(--color-secondary-700)] border border-[var(--color-secondary-200)]',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        warning: 'bg-amber-50 text-amber-700 border border-amber-100',
        danger: 'bg-red-50 text-red-700 border border-red-100',
        info: 'bg-sky-50 text-sky-700 border border-sky-100'
    }

    return `${base} ${sizes[props.size]} ${types[props.type]}`
})
</script>

<template>
    <span :class="badgeClasses">
        <slot />
    </span>
</template>