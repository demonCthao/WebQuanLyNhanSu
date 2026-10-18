<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
    <section class="mt-6">
        <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">{{ title }}</h3>
        <slot />
    </section>
</template>
