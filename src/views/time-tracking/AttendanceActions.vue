<script setup lang="ts">
defineProps<{
    canCheckIn: boolean
    canCheckOut: boolean
    hasCheckedOut: boolean
}>()

const emit = defineEmits<{
    (e: 'check-in'): void
    (e: 'check-out'): void
}>()

const baseClass = 'flex h-16 w-full items-center justify-center gap-2.5 rounded-xl text-lg font-semibold transition-colors'
const disabledClass = 'cursor-not-allowed bg-gray-100 text-gray-400'
</script>

<template>
    <div class="grid grid-cols-2 gap-4">
        <div>
            <button type="button" :disabled="!canCheckIn" :class="[baseClass, canCheckIn ? 'bg-emerald-600 text-white hover:bg-emerald-700' : disabledClass]"
                @click="emit('check-in')">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                </svg>
                Check in
            </button>
            <p v-if="!canCheckIn" class="mt-1.5 text-center text-xs text-gray-400">Bạn đã check in hôm nay</p>
        </div>

        <div>
            <button type="button" :disabled="!canCheckOut" :class="[baseClass, canCheckOut ? 'bg-[#e60012] text-white hover:bg-[#c8000f]' : disabledClass]"
                @click="emit('check-out')">
                <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                </svg>
                Check out
            </button>
            <p v-if="!canCheckOut" class="mt-1.5 text-center text-xs text-gray-400">Cần check in trước</p>
            <p v-else-if="hasCheckedOut" class="mt-1.5 text-center text-xs text-gray-400">
                Bấm lại để cập nhật giờ check out
            </p>
        </div>
    </div>
</template>
