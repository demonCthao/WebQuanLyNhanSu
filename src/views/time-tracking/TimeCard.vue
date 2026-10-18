<script setup lang="ts">
import { formatClock } from '@/lib/attendance-time';


defineProps<{
    label: string
    value: Date | null
    emptyText: string // chữ hiện khi chưa có giờ
    hint?: string // chú thích nhỏ khi đã có giờ
}>()
</script>

<template>
    <section class="rounded-xl bg-white p-5 shadow-sm">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500">{{ label }}</h3>
        <p class="mt-2 text-3xl font-bold tabular-nums" :class="value ? 'text-gray-900' : 'text-gray-300'">
            {{ formatClock(value) }}
        </p>
        <p class="mt-1 text-xs text-gray-400">{{ value ? (hint ?? '') : emptyText }}</p>
    </section>
</template>
