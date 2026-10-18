<script setup lang="ts">
import { ChevronLeft, ChevronRight, RotateCcw, Search } from "lucide-vue-next";
import { ref } from "vue";
import Button from "./ui/Button.vue";

interface Props {
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    loading: false,
});

const emit = defineEmits<{
    (e: "search"): void;
    (e: "reset"): void;
}>();

const collapsed = ref(false);

const togglePanel = () => {
    collapsed.value = !collapsed.value;
};
</script>

<template>
    <div class="h-full flex flex-col bg-white border-r border-[var(--color-secondary-300)] transition-all duration-300 ease-in-out overflow-hidden relative select-none"
        :class="collapsed ? 'w-12 px-1' : 'w-72 p-4 shadow-sm'">

        <div class="flex h-10 shrink-0 items-center justify-between mb-4 border-b border-[var(--color-secondary-300)] pb-2"
            :class="{ 'justify-center border-b-0 mb-0 pt-2': collapsed }">

            <span v-if="!collapsed"
                class="font-bold text-[15px] text-[var(--color-primary-900)] tracking-wide uppercase">
                Bộ lọc tìm kiếm
            </span>

            <button type="button" @click="togglePanel"
                class="p-1.5 rounded-lg text-[var(--color-secondary-600)] hover:text-[var(--color-primary-700)] hover:bg-[var(--color-secondary-300)] transition-all duration-200 cursor-pointer flex items-center justify-center">
                <ChevronRight v-if="collapsed" :size="18" />
                <ChevronLeft v-else :size="18" />
            </button>
        </div>

        <template v-if="!collapsed">
            <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                <slot />
            </div>

            <div class="mt-4 pt-4 border-t border-secondary-300 flex items-center gap-2 shrink-0 flex justify-center">
                <Button variant="primary" :loading="loading" :icon="Search" @click="emit('search')"
                    class="flex-1 justify-center h-9 bg-primary-900 text-white hover:bg-primary-800 transition-colors text-[13px] font-medium rounded-md shadow-xs">
                    Tìm kiếm
                </Button>

                <Button variant="outline" :disabled="loading" :icon="RotateCcw" @click="emit('reset')"
                    class="px-3 h-9 border border-secondary-400 text-[var(--color-secondary-700)] hover:bg-secondary-200 hover:text-secondary-900 transition-all text-[13px] font-medium rounded-md">
                    Xóa lọc
                </Button>
            </div>
        </template>

        <div v-else class="flex-1 flex flex-col items-center pt-1 text-secondary-800">
            <Search :size="18" class="opacity-60" />
        </div>
    </div>
</template>