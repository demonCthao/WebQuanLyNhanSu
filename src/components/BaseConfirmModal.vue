<script setup lang="ts">
import { HelpCircle } from 'lucide-vue-next'
import Button from './ui/Button.vue'

interface Props {
    modelValue: boolean
    title?: string
    cancelText?: string
    confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    title: 'Are you sure you want to log out?',
    cancelText: 'Cancel',
    confirmText: 'Confirm'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm'): void
    (e: 'cancel'): void
}>()

const handleCancel = () => {
    emit('update:modelValue', false)
    emit('cancel')
}

const handleConfirm = () => {
    emit('update:modelValue', false)
    emit('confirm')
}
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modelValue"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10142e]/30 backdrop-blur-[1px]">

                <div
                    class="w-full max-w-[440px] bg-white rounded-xl shadow-xl border border-secondary-400 p-8 flex flex-col items-center text-center transform transition-all">

                    <div class="mb-4 text-blue-500 p-2.5 rounded-full">
                        <HelpCircle :size="52" stroke-width="2" />
                    </div>

                    <h3 class="text-[19px] font-bold text-secondary-900 leading-snug tracking-normal px-2 mb-3">
                        {{ title }}
                    </h3>

                    <div class="flex items-center justify-center gap-3 w-full">

                        <Button variant="default" button-class="min-w-[100px] border-secondary-400 font-semibold"
                            @click="handleCancel">
                            {{ cancelText }}
                        </Button>

                        <Button variant="primary" button-class="min-w-[110px] font-semibold shadow-sm"
                            @click="handleConfirm">
                            {{ confirmText }}
                    </Button>

                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>