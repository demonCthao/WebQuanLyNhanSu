<script setup lang="ts">
import { computed } from "vue";
import ApprovalActionForm from "./ApprovalActionForm.vue";
import ApprovalSection from "./ApprovalSection.vue";
import ApprovalStatusBadge from "./ApprovalStatusBadge.vue";
import ApprovalTimeline from "./ApprovalTimeline.vue";
import { formatDateTime } from "@/lib/utils.ts";
import { isPending } from "@/lib/approval-status.ts";
import type { ApprovalItem } from "@/types/approval.type.ts";

const props = defineProps<{
    detail: ApprovalItem;
    submitting?: boolean;
    errorMessage?: string;
}>();

const emit = defineEmits<{
    (e: "approve", comment: string): void;
    (e: "reject", comment: string): void;
}>();

const infoRows = computed(() => [
    { label: "Mã phiếu", value: props.detail.code },
    { label: "Loại phê duyệt", value: props.detail.type ?? "—" },
    { label: "Ngày tạo", value: formatDateTime(props.detail.createdAt) },
    { label: "Hạn xử lý", value: formatDateTime(props.detail.dueDate) },
]);

// Chỉ hiện khung duyệt khi người dùng được quyền (backend quyết định) hoặc phiếu đang chờ duyệt
const canAct = computed(() => props.detail.canApprove ?? isPending(props.detail.status));
</script>

<template>
    <article class="rounded-xl bg-white p-5 shadow-sm">
        <header class="flex flex-wrap items-start justify-between gap-3">
            <h2 class="min-w-0 text-xl font-bold text-gray-900">{{ detail.title }}</h2>
            <ApprovalStatusBadge :status="detail.status" />
        </header>

        <dl class="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-gray-100 p-4">
            <div v-for="row in infoRows" :key="row.label" class="min-w-0">
                <dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">{{ row.label }}</dt>
                <dd class="mt-1 break-words text-sm text-gray-900">{{ row.value }}</dd>
            </div>
        </dl>

        <ApprovalSection title="Nội dung đề nghị">
            <p v-if="detail.description" class="whitespace-pre-line text-sm leading-6 text-gray-700">
                {{ detail.description }}
            </p>
            <p v-else class="text-sm text-gray-400">Không có mô tả</p>
        </ApprovalSection>

        <ApprovalSection title="Tiến trình phê duyệt">
            <ApprovalTimeline :steps="detail.steps" />
        </ApprovalSection>

        <section v-if="canAct" class="mt-6 border-t border-gray-100 pt-5">
            <p v-if="errorMessage" role="alert" class="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {{ errorMessage }}
            </p>
            <ApprovalActionForm :submitting="submitting" @approve="emit('approve', $event)"
                @reject="emit('reject', $event)" />
        </section>
    </article>
</template>
