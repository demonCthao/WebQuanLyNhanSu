<script setup lang="ts">
import { getStatusView } from "@/lib/approval-status.ts";
import ApprovalStatusBadge from "./ApprovalStatusBadge.vue";
import type { ApprovalStep } from "@/types/approval.type.ts";
import { formatDateTime } from "@/lib/utils.ts";

defineProps<{ steps: ApprovalStep[] }>();
</script>

<template>
    <ol>
        <li v-for="(step, index) in steps" :key="step.id" class="relative flex gap-3 pb-5 last:pb-0">
            <!-- đường nối giữa các bước -->
            <span v-if="index < steps.length - 1" class="absolute left-3 top-6 h-[calc(100%-1.5rem)] w-px bg-gray-200"
                aria-hidden="true" />

            <span class="z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full"
                :class="getStatusView(step.status).dot">
                <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="3"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path v-if="getStatusView(step.status).kind === 'approved'" d="M5 12l4.5 4.5L19 7" />
                    <path v-else-if="getStatusView(step.status).kind === 'rejected'" d="M6 6l12 12M18 6L6 18" />
                    <circle v-else cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
                </svg>
            </span>

            <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <p class="text-sm font-semibold text-gray-900">{{ step.name }}</p>
                    <ApprovalStatusBadge :status="step.status" />
                </div>
                <p class="text-sm text-gray-600">
                    {{ step.user.fullname }}
                </p>
                <p v-if="step.actedAt" class="text-xs text-gray-400">{{ formatDateTime(step.actedAt) }}</p>
                <p v-if="step.comment" class="mt-1.5 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    “{{ step.comment }}”
                </p>
            </div>
        </li>
    </ol>
</template>
