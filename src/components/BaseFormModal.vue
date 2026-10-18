<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/40 p-4 font-sans">
        <div
            class="w-full max-w-[800px] bg-white rounded-lg shadow-xl border border-secondary-200 p-8 relative flex flex-col gap-6">

            <div class="flex items-center justify-between pb-2">
                <h2 class="text-2xl font-bold text-secondary-900 tracking-tight">
                    {{ title }}
                </h2>
                <button type="button" @click="emit('close')"
                    class="text-secondary-400 hover:text-secondary-700 transition-colors p-1 rounded-md hover:bg-secondary-100 cursor-pointer">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="emit('submit')" class="flex flex-col gap-4">

                <div class="flex flex-col gap-4">
                    <slot></slot>
                </div>

                <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-secondary-100">

                    <Button type="button" variant="outline" size="lg" @click="emit('close')">
                        {{ cancelText }}
                    </Button>

                    <Button type="submit" variant="primary" size="lg">
                        {{ submitText }}
                    </Button>

                </div>

            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from './ui/Button.vue'

withDefaults(
    defineProps<{
        title: string
        submitText?: string
        cancelText?: string
    }>(),
    {
        submitText: 'Send Request',
        cancelText: 'Cancel'
    }
)

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit'): void
}>()
</script>