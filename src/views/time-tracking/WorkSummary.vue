<script setup lang="ts">
import { formatDuration, formatHoursText, LUNCH_BREAK_MS, toDecimalHours, type WorkTime } from '@/lib/attendance-time';



defineProps<{
    work: WorkTime | null
    live: boolean // đang làm việc (chưa check out): số liệu tính đến hiện tại và chạy từng giây
}>()

const lunchHours = LUNCH_BREAK_MS / 3_600_000
</script>

<template>
    <section class="rounded-xl bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between gap-3">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500">Giờ làm việc</h3>
            <span v-if="live" class="flex items-center gap-1.5 text-xs text-emerald-600">
                <span class="size-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
                Đang tính đến hiện tại
            </span>
        </div>

        <p class="mt-3 text-4xl font-bold tabular-nums text-gray-900">
            {{ work ? formatDuration(work.workedMs) : '--:--:--' }}
        </p>
        <p class="mt-1 text-sm text-gray-500">
            <template v-if="work">
                {{ formatHoursText(work.workedMs) }} ({{ toDecimalHours(work.workedMs) }} giờ)
            </template>
            <template v-else>Chưa có dữ liệu</template>
        </p>

        <dl class="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div class="flex items-center justify-between">
                <dt class="text-gray-500">Tổng thời gian có mặt</dt>
                <dd class="tabular-nums text-gray-900">{{ work ? formatDuration(work.totalMs) : '--:--:--' }}</dd>
            </div>
            <div class="flex items-center justify-between">
                <dt class="text-gray-500">Nghỉ trưa (đã trừ)</dt>
                <dd class="tabular-nums text-gray-900">− {{ work ? formatDuration(work.lunchMs) : '--:--:--' }}</dd>
            </div>
        </dl>

        <p class="mt-4 text-xs text-gray-400">
            Nghỉ trưa mặc định {{ lunchHours }} giờ và được tự động trừ khỏi giờ làm việc.
        </p>
    </section>
</template>
