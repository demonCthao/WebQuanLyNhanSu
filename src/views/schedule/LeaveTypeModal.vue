<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import type { Approval } from '@/enums/approval.enum';
import { LEAVE_TYPES } from '@/lib/day-action';

const props = defineProps<{ open: boolean; date: string }>()
const emit = defineEmits<{
    (e: 'confirm', type: Approval): void
    (e: 'close'): void
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const selected = ref<Approval>('full_day')

// Dùng thẻ <dialog> gốc: tự khoá nền, tự xử lý phím Esc và giữ focus trong modal
watch(
    () => props.open,
    (open) => {
        const dialog = dialogRef.value
        if (!dialog) return
        if (open) {
            selected.value = 'full_day' // mỗi lần mở lại về mặc định
            if (!dialog.open) dialog.showModal()
        } else if (dialog.open) {
            dialog.close()
        }
    },
    { flush: 'post' },
)
</script>

<template>
    <dialog ref="dialogRef"
        class="m-auto w-[360px] max-w-[92vw] rounded-xl p-0 shadow-xl backdrop:bg-black/40 text-secondary-800"
        aria-labelledby="leave-modal-title" @close="emit('close')" @click.self="emit('close')">
        <div class="p-5">
            <h3 id="leave-modal-title" class="text-lg font-bold">Nghỉ phép</h3>
            <p class="mt-1 text-sm text-[var(--color-secondary-500)]">Ngày {{ date }}</p>

            <fieldset class="mt-4 space-y-2">
                <legend class="sr-only">Loại nghỉ</legend>
                <label v-for="type in LEAVE_TYPES" :key="type.value"
                    class="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-[14px] font-medium transition-colors"
                    :class="selected === type.value
                        ? 'border-[var(--color-primary-700)] bg-secondary-50'
                        : 'border-secondary-200 hover:bg-secondary-50'">
                    <input v-model="selected" type="radio" name="leave-type" :value="type.value"
                        class="size-4 cursor-pointer accent-[var(--color-primary-700)]" />
                    {{ type.label }}
                </label>
            </fieldset>

            <div class="mt-5 flex justify-end gap-2">
                <Button variant="default" @click="emit('close')">Hủy</Button>
                <Button variant="primary" @click="emit('confirm', selected)">Xác nhận</Button>
            </div>
        </div>
    </dialog>
</template>
