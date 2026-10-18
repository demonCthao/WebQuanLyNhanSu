<script setup lang="ts">
import { getStatusView } from "@/lib/approval-status";
import { computed } from "vue";

const props = defineProps<{ status: string | number }>();

const view = computed(() => getStatusView(props.status));
</script>

<template>
    <span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium" :class="view.badge">
        {{ view.label }}
    </span>
</template>
