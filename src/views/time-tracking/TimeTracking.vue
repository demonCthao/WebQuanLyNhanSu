<script setup lang="ts">

import { useAttendance } from '@/hooks/useAttendance'
import AttendanceClock from './AttendanceClock.vue';
import AttendanceActions from './AttendanceActions.vue';
import TimeCard from './TimeCard.vue';

const { now, checkInAt, checkOutAt, status, canCheckIn, canCheckOut, work, checkIn, checkOut } =
    useAttendance()

const isDev = import.meta.env.DEV
</script>

<template>
    <div class="h-full w-full overflow-y-auto bg-gray-50 p-6">
        <div class="mx-auto max-w-2xl space-y-4">
            <h1 class="text-2xl font-bold text-gray-900">Chấm công</h1>

            <AttendanceClock :now="now" :status="status" />

            <AttendanceActions :can-check-in="canCheckIn" :can-check-out="canCheckOut"
                :has-checked-out="status === 'done'" @check-in="checkIn" @check-out="checkOut" />

            <div class="grid grid-cols-2 gap-4">
                <TimeCard label="Giờ check in" :value="checkInAt" empty-text="Chưa check in" />
                <TimeCard label="Giờ check out" :value="checkOutAt" empty-text="Chưa check out"
                    hint="Lần check out gần nhất" />
            </div>

            <WorkSummary :work="work" :live="status === 'working'" />
        </div>
    </div>
</template>
