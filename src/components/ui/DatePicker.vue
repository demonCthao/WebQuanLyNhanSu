<script setup lang="ts">
import { ref, computed, toRaw, onMounted, onUnmounted } from 'vue';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next';

defineOptions({
    inheritAttrs: false,
});

const props = withDefaults(
    defineProps<{
        label?: string;
        error?: string;
        containerClass?: string;
        labelClass?: string;
    }>(),
    {
        containerClass: "",
        labelClass: "",
    }
);

const model = defineModel<any>();

const isRange = computed(() => Array.isArray(toRaw(model.value)));

const activePicker = ref<'first' | 'second' | null>(null);
const containerRef = ref<HTMLElement | null>(null);

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

const displayFirstValue = computed(() => isRange.value ? model.value?.[0] || '' : model.value || '');
const displaySecondValue = computed(() => isRange.value ? model.value?.[1] || '' : '');

const openPicker = (type: 'first' | 'second') => {
    activePicker.value = type;
    const currentVal = type === 'first' ? displayFirstValue.value : displaySecondValue.value;
    if (currentVal) {
        const d = new Date(currentVal);
        if (!isNaN(d.getTime())) {
            currentYear.value = d.getFullYear();
            currentMonth.value = d.getMonth();
        }
    } else {
        const d = new Date();
        currentYear.value = d.getFullYear();
        currentMonth.value = d.getMonth();
    }
};

const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
        activePicker.value = null;
    }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
    } else {
        currentMonth.value--;
    }
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
    } else {
        currentMonth.value++;
    }
};

const formatDateStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
};

const selectToday = () => {
    const today = new Date();
    const dateStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());
    selectDateStr(dateStr);
};

const selectDateStr = (dateStr: string) => {
    if (isRange.value) {
        if (activePicker.value === 'first') {
            model.value = [dateStr, model.value?.[1] || ''];
        } else if (activePicker.value === 'second') {
            model.value = [model.value?.[0] || '', dateStr];
        }
    } else {
        model.value = dateStr;
    }
    activePicker.value = null;
};

const daysInMatrix = computed(() => {
    const year = currentYear.value;
    const month = currentMonth.value;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const totalDaysPrev = new Date(year, month, 0).getDate();

    const matrix = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const prevM = month === 0 ? 11 : month - 1;
        const prevY = month === 0 ? year - 1 : year;
        const d = totalDaysPrev - i;
        matrix.push({ day: d, isCurrentMonth: false, dateStr: formatDateStr(prevY, prevM, d), isSunday: false, isSaturday: false });
    }

    for (let d = 1; d <= totalDays; d++) {
        const currentIdx = new Date(year, month, d).getDay();
        matrix.push({
            day: d,
            isCurrentMonth: true,
            dateStr: formatDateStr(year, month, d),
            isSunday: currentIdx === 0,
            isSaturday: currentIdx === 6
        });
    }

    const remainingCells = 42 - matrix.length;
    for (let d = 1; d <= remainingCells; d++) {
        const nextM = month === 11 ? 0 : month + 1;
        const nextY = month === 11 ? year + 1 : year;
        matrix.push({ day: d, isCurrentMonth: false, dateStr: formatDateStr(nextY, nextM, d), isSunday: false, isSaturday: false });
    }

    return matrix;
});

const isDateSelected = (dateStr: string) => {
    if (activePicker.value === 'first') return displayFirstValue.value === dateStr;
    if (activePicker.value === 'second') return displaySecondValue.value === dateStr;
    return displayFirstValue.value === dateStr || displaySecondValue.value === dateStr;
};
</script>

<template>
    <div ref="containerRef" :class="['flex flex-col gap-1 font-sans relative', containerClass]">
        <span v-if="label"
            :class="['text-base text-secondary-800 font-medium select-none w-fit mb-0.5', labelClass]">
            {{ label }}
        </span>

        <div class="flex items-center gap-2 w-full">
            <div class="relative flex-1 group">
                <input type="text" readonly :value="displayFirstValue" @click="openPicker('first')" :class="[
                    'w-full h-9 px-3 pr-9 rounded border text-base text-gray-700 bg-white outline-none cursor-pointer transition-all select-none',
                    activePicker === 'first' ? 'border-blue-600 shadow-sm' : 'border-gray-300 group-hover:border-gray-400',
                    error && 'border-red-500'
                ]" />
                <Calendar @click.stop="openPicker('first')"
                    class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
            </div>

            <span v-if="isRange" class="text-gray-400 select-none text-base">~</span>

            <div v-if="isRange" class="relative flex-1 group">
                <input type="text" readonly :value="displaySecondValue" @click="openPicker('second')" :class="[
                    'w-full h-9 px-3 pr-9 rounded border text-base text-gray-700 bg-white outline-none cursor-pointer transition-all select-none',
                    activePicker === 'second' ? 'border-blue-600 shadow-sm' : 'border-gray-300 group-hover:border-gray-400',
                    error && 'border-red-500'
                ]" />
                <Calendar @click.stop="openPicker('second')"
                    class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
            </div>
        </div>

        <div v-if="activePicker" :class="[
            'absolute z-50 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-[280px]',
            activePicker === 'second' && isRange ? 'right-0' : 'left-0'
        ]">

            <div class="flex items-center justify-between mb-4 px-1">
                <button type="button" @click="prevMonth"
                    class="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">
                    <ChevronLeft class="h-4 w-4" />
                </button>
                <span class="text-base font-bold text-gray-700">
                    {{ currentYear }}-{{ String(currentMonth + 1).padStart(2, '0') }}
                </span>
                <button type="button" @click="nextMonth"
                    class="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">
                    <ChevronRight class="h-4 w-4" />
                </button>
            </div>

            <div class="grid grid-cols-7 text-center text-[12px] font-semibold text-gray-500 mb-2">
                <span class="text-red-500">S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span class="text-blue-400">S</span>
            </div>

            <div class="grid grid-cols-7 gap-y-1 text-center text-base">
                <div v-for="(cell, idx) in daysInMatrix" :key="idx" class="flex items-center justify-center h-8 font-normal">
                    <button type="button" @click="selectDateStr(cell.dateStr)" :class="[
                        'w-7 h-7 flex items-center justify-center rounded-full transition-all',
                        !cell.isCurrentMonth ? 'text-gray-300 cursor-not-allowed pointer-events-none' : 'hover:bg-gray-100 text-gray-700',
                        cell.isCurrentMonth && cell.isSunday && !isDateSelected(cell.dateStr) ? 'text-red-500' : '',
                        cell.isCurrentMonth && cell.isSaturday && !isDateSelected(cell.dateStr) ? 'text-blue-500' : '',
                        isDateSelected(cell.dateStr) ? 'bg-blue-700 text-white font-medium underline' : ''
                    ]">
                        {{ cell.day }}
                    </button>
                </div>
            </div>

            <div class="border-t border-gray-100 mt-3 pt-2 flex justify-start">
                <button type="button" @click="selectToday"
                    class="text-[12px] font-semibold text-gray-700 hover:text-blue-600 px-1 py-0.5 transition-colors">
                    Today
                </button>
            </div>
        </div>

        <p v-if="error" class="text-xs text-red-500 mt-0.5">
            {{ error }}
        </p>
    </div>
</template>