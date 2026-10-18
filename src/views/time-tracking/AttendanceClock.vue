<script setup lang="ts">
import { formatClock, formatDateLong, STATUS_VIEW, type AttendanceStatus } from '@/lib/attendance-time';
import { computed } from 'vue'

const props = defineProps<{ now: Date; status: AttendanceStatus }>()

const view = computed(() => STATUS_VIEW[props.status])
</script>

<template>
    <section class="rounded-xl bg-white p-6 text-center shadow-sm">
        <p class="text-sm font-semibold text-gray-500">{{ formatDateLong(now) }}</p>
        <p class="mt-2 text-5xl font-bold tabular-nums tracking-tight text-gray-900">{{ formatClock(now) }}</p>
        <span class="mt-3 inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="view.badge" role="status">
            {{ view.label }}
        </span>
    </section>
</template>
