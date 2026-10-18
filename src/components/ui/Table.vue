<template>
    <div
        class="w-full flex flex-col h-full bg-white font-sans text-sm text-secondary-800 p-3 rounded-xl shadow-xs border border-secondary-200">

        <div v-if="title" class="shrink-0 mb-5 font-bold text-xl text-primary-900 tracking-tight">
            {{ title }}
        </div>

        <div class="shrink-0 flex items-center justify-between mb-4 text-[var(--color-secondary-600)] font-medium">
            <div class="flex items-center gap-1.5 bg-[var(--color-secondary-100)] px-2.5 py-1 rounded-md text-[12px]">
                <span>Tổng số bản ghi:</span>
                <span class="font-bold text-[var(--color-primary-900)]">{{ data.length }}</span>
            </div>
        </div>

        <div
            class="flex-1 min-h-0 min-w-0 overflow-x-auto overflow-y-auto border border-secondary-300 rounded-lg custom-scrollbar">
            <table class="w-full min-w-[800px] border-collapse text-left">
                <thead
                    class="sticky top-0 z-10 bg-secondary-100 select-none text-sm font-bold text-secondary-800 uppercase tracking-wider border-b border-secondary-300">
                    <tr>
                        <th class="w-16 pl-4 py-3 text-center">
                            STT
                        </th>
                        <th v-for="(col, index) in columns" :key="String(col.key) + index"
                            class="whitespace-nowrap px-4 py-3 font-semibold">
                            {{ col.header }}
                        </th>
                        <th v-if="hasActions" class="w-32 text-center py-3 font-semibold pr-4">
                            Thao tác
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-[var(--color-secondary-200)] bg-white">
                    <tr v-for="(item, rowIndex) in paginatedData" :key="item.id ?? rowIndex"
                        class="hover:bg-[var(--color-primary-50)]/60 hover:cursor-pointer transition-colors duration-150 group">

                        <td class="py-3 pl-4 text-center text-[var(--color-secondary-500)] font-medium">
                            {{ (currentPage - 1) * pageSize + rowIndex + 1 }}
                        </td>

                        <td v-for="(col, colIndex) in columns" :key="colIndex"
                            class="py-3 px-4 whitespace-nowrap text-[var(--color-secondary-800)] group-hover:text-[var(--color-primary-900)] font-normal transition-colors">
                            <slot :name="`col-${String(col.key)}`" :item="item" :value="item[col.key]">
                                {{ item[col.key] !== undefined && item[col.key] !== null ? item[col.key] : "—" }}
                            </slot>
                        </td>

                        <td v-if="hasActions" class="py-2 text-center pr-4">
                            <div class="flex justify-center gap-1.5">
                                <Button type="button" @click.stop="emit('choose', item, ACTION.EDIT)"
                                    class="h-7 px-2.5 text-[12px] font-medium bg-white border border-[var(--color-secondary-300)] text-[var(--color-secondary-700)] hover:bg-[var(--color-secondary-100)] hover:text-[var(--color-primary-900)] rounded-md transition-all shadow-2xs">
                                    Sửa
                                </Button>
                                <Button variant="destructive" type="button" @click.stop="emit('choose', item, ACTION.DELETE)"
                                    class="h-7 px-2.5 text-[12px] font-medium bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 rounded-md transition-all shadow-2xs">
                                    Xóa
                                </Button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="data.length === 0">
                        <td :colspan="columns.length + (hasActions ? 2 : 1)"
                            class="text-center py-12 text-[var(--color-secondary-500)] italic bg-white">
                            Không có dữ liệu hiển thị
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            class="shrink-0 mt-4 pt-4 border-t border-secondary-200 grid grid-cols-3 items-center text-sm text-[var(--color-secondary-600)] select-none">

            <div class="flex items-center gap-1.5 justify-self-start">
                <span>Hiển thị:</span>
                <select v-model="pageSize" @change="currentPage = 1"
                    class="h-8 px-2.5 bg-white border border-[var(--color-secondary-300)] rounded-md outline-none text-sm font-medium text-[var(--color-secondary-700)] cursor-pointer focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all">
                    <option :value="10">10 dòng / trang</option>
                    <option :value="20">20 dòng / trang</option>
                    <option :value="50">50 dòng / trang</option>
                </select>
            </div>

            <div class="flex items-center gap-1 justify-self-center">
                <button type="button" :disabled="currentPage === 1" @click="currentPage = 1"
                    class="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-colors">
                    <ChevronsLeft :size="18" />
                </button>

                <button type="button" :disabled="currentPage === 1" @click="currentPage--"
                    class="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-colors mr-1">
                    <ChevronLeft :size="18" />
                </button>

                <div class="flex items-center gap-1 mx-1">
                    <button v-for="page in visiblePages" :key="page" type="button" @click="currentPage = page"
                        class="w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200 text-base cursor-pointer"
                        :class="currentPage === page
                            ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] font-semibold border border-[var(--color-primary-200)]'
                            : 'text-gray-600 hover:bg-gray-100 font-normal'">
                        {{ page }}
                    </button>
                </div>

                <button type="button" :disabled="currentPage === totalPages || totalPages === 0" @click="currentPage++"
                    class="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-colors ml-1">
                    <ChevronRight :size="18" />
                </button>

                <button type="button" :disabled="currentPage === totalPages || totalPages === 0"
                    @click="currentPage = totalPages"
                    class="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-colors">
                    <ChevronsRight :size="18" />
                </button>

                <div
                    class="flex items-center border border-secondary-300 rounded-md ml-3 bg-white overflow-hidden h-8 shadow-2xs">
                    <input v-model="jumpPage" type="text" @keyup.enter="handleJumpPage"
                        class="w-10 h-full px-1 text-center outline-none border-r border-secondary-300 text-base text-gray-700" />
                    <button type="button" @click="handleJumpPage"
                        class="px-2 h-full text-base text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium cursor-pointer">
                        Đi
                    </button>
                </div>
            </div>
            <div></div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="TData extends Record<string, any>">
import { ref, computed, watch } from 'vue'
import Button from './Button.vue';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';
import { ACTION, type Action } from '@/enums/action.enum';

export interface TableColumn {
    key: string;
    header: string;
}

const props = withDefaults(
    defineProps<{
        title?: string
        data: TData[]
        columns: TableColumn[]
        useCanMutation?: boolean
    }>(),
    {
        useCanMutation: false
    }
)

const emit = defineEmits<{
    (e: 'choose', data: TData, type: Action): void
}>();

const hasActions = computed(() => props.useCanMutation)

const currentPage = ref(1)
const pageSize = ref(10)

const totalPages = computed(() => {
    return Math.ceil(props.data.length / pageSize.value)
})

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return props.data.slice(start, end)
})

watch(() => props.data, () => {
    currentPage.value = 1
}, { deep: true })

const jumpPage = ref('')

const handleJumpPage = () => {
    const page = parseInt(jumpPage.value)
    if (page && page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
    jumpPage.value = ''
}

const visiblePages = computed(() => {
    const total = totalPages.value || 1
    const current = currentPage.value
    const maxVisible = 5

    let start = Math.max(current - Math.floor(maxVisible / 2), 1)
    let end = start + maxVisible - 1

    if (end > total) {
        end = total
        start = Math.max(end - maxVisible + 1, 1)
    }

    const pages = []
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})


</script>