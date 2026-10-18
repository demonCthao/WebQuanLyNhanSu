<script setup lang="ts">
import { computed, ref } from "vue";
import { useFetch } from "@/hooks/useFetch";
import ApprovalDetailView from "./ApprovalDetailView.vue";
import Button from "@/components/ui/Button.vue";
import type { ApprovalItem } from "@/types/approval.type.ts";
import type { ApprovalDecision } from "@/enums/approval.enum.ts";
import { MOCK_APPROVAL_DETAIL } from "@/mock/approval.ts";

const props = defineProps<{ id: string | number }>();

const emit = defineEmits<{
    (e: "decided"): void; // đã duyệt/từ chối xong, để trang cha tải lại danh sách
}>();

// Tải chi tiết theo id. Component chỉ được tạo khi đã chọn phiếu (xem :key ở trang cha)
const url = computed(() => `/approval/${props.id}`);
const queryKey = computed(() => ["approval", "detail", props.id]);
const { data, isLoading, refetch } = useFetch<ApprovalItem>({ url, key: queryKey });

const submitting = ref(false);
const errorMessage = ref("");

const handleDecision = async (decision: ApprovalDecision, comment: string) => {

};
</script>

<template>
    <div class="h-full">
        <!-- Đang tải: khung xương -->
        <div v-if="isLoading" class="animate-pulse space-y-4 rounded-xl bg-gray-400 p-5 shadow-sm" aria-busy="true">
            <div class="h-6 w-2/3 rounded bg-gray-200" />
            <div class="h-24 rounded bg-gray-100" />
            <div class="h-4 w-1/3 rounded bg-gray-200" />
            <div class="h-16 rounded bg-gray-100" />
            <div class="h-4 w-1/3 rounded bg-gray-200" />
            <div class="h-28 rounded bg-gray-100" />
        </div>

        <ApprovalDetailView v-else-if="MOCK_APPROVAL_DETAIL" :detail="MOCK_APPROVAL_DETAIL" :submitting="submitting"
            :error-message="errorMessage" @approve="handleDecision('approve', $event)"
            @reject="handleDecision('reject', $event)" />

        <!-- Không tải được -->
        <div v-else class="rounded-xl bg-white p-8 text-center shadow-sm">
            <p class="mb-4 text-sm text-gray-600">Không tải được chi tiết phê duyệt.</p>
            <Button variant="default" @click="refetch()">Thử lại</Button>
        </div>
    </div>
</template>
