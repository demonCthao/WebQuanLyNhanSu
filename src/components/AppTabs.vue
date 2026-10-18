<script setup lang="ts">
import { useTabsStore } from '@/store/tabs'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const router = useRouter()
const tabs = useTabsStore()

const draggedIndex = ref<number | null>(null)

const open = (path: string) => {
    router.push(path)
}

const close = (path: string) => {
    tabs.removeTab(path)
    if (tabs.activePath) {
        router.push(tabs.activePath)
    }
}

const handleDragStart = (index: number) => {
    draggedIndex.value = index
}

const handleDragOver = (event: DragEvent, index: number) => {
    event.preventDefault()
}

const handleDrop = (index: number) => {
    if (draggedIndex.value !== null) {
        tabs.reorderTabs(draggedIndex.value, index)
    }
    draggedIndex.value = null
}

const handleDragEnd = () => {
    draggedIndex.value = null
}
</script>

<template>
    <div
        class="flex items-center bg-secondary-100 border-b border-secondary-300 overflow-x-auto select-none px-4 h-11 font-sans gap-1.5 custom-scrollbar">

        <div v-for="(tab, index) in tabs.tabs" :key="tab.path" draggable="true" @dragstart="handleDragStart(index)"
            @dragover="handleDragOver($event, index)" @drop="handleDrop(index)" @dragend="handleDragEnd"
            class="relative flex items-center gap-2 px-4 h-8 text-[13px] rounded-md transition-all duration-200
            cursor-pointer whitespace-nowrap"
            :class="[
            tab.path === tabs.activePath
            ? 'bg-white border-[var(--color-secondary-300)] text-[var(--color-primary-900)] font-semibold shadow-xs'
            : 'bg-transparent border-transparent text-[var(--color-secondary-700)] hover:text-[var(--color-secondary-900)] hover:bg-[var(--color-secondary-200)]',
            draggedIndex === index ? 'opacity-40' : ''
            ]"
            @click="open(tab.path)">

            <span class="truncate max-w-[140px] pointer-events-none">
                {{ tab.title }}
            </span>

            <button v-if="tab.closable"
                class="flex items-center justify-center w-4 h-4 rounded-full text-[var(--color-secondary-600)] hover:text-white hover:bg-red-500 transition-all duration-150 p-0"
                @click.stop="close(tab.path)">
                <X :size="10" stroke-width="3" />
            </button>

            <div v-if="tab.path === tabs.activePath"
                class="absolute -bottom-[6px] left-2 right-2 h-[2.5px] bg-[var(--color-primary-500)] rounded-t-full" />
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    height: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 2px;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background: var(--color-secondary-400);
}
</style>