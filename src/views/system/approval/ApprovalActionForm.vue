<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import { ref } from "vue";

defineProps<{ submitting?: boolean }>();

const emit = defineEmits<{
    (e: "approve", comment: string): void;
    (e: "reject", comment: string): void;
}>();

const MAX_LENGTH = 500;
const comment = ref("");
const error = ref("");

const handleApprove = () => {
    error.value = "";
    emit("approve", comment.value.trim());
};

// Từ chối thì bắt buộc nhập lý do
const handleReject = () => {
    if (!comment.value.trim()) {
        error.value = "Vui lòng nhập lý do từ chối";
        return;
    }
    error.value = "";
    emit("reject", comment.value.trim());
};
</script>

<template>
    <form class="space-y-3" @submit.prevent>
        <div>
            <label for="approval-comment" class="mb-1.5 block text-sm font-semibold text-gray-600">
                Ý kiến phê duyệt
            </label>
            <textarea id="approval-comment" v-model="comment" rows="3" :maxlength="MAX_LENGTH"
                placeholder="Nhập ý kiến (bắt buộc khi từ chối)"
                class="w-full resize-none rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#1e2147]"
                :class="error ? 'border-red-500' : 'border-gray-200'" :aria-invalid="Boolean(error)"
                @input="error = ''" />
            <div class="mt-1 flex items-start justify-between gap-3 text-xs">
                <p v-if="error" role="alert" class="text-red-600">{{ error }}</p>
                <span class="ml-auto text-gray-400">{{ comment.length }}/{{ MAX_LENGTH }}</span>
            </div>
        </div>

        <div class="flex justify-end gap-2">
            <Button variant="ghost" :disabled="submitting" @click="handleReject">Từ chối</Button>
            <Button variant="primary"  :disabled="submitting" @click="handleApprove">{{ submitting ? "Đang xử lý..." : "Phê duyệt" }}</Button>
        </div>
    </form>
</template>
