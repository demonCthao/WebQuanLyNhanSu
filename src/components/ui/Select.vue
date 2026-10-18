<template>
    <div :class="['grid grid-cols-4 gap-2 items-center', containerClass]" ref="selectRef">

        <div class="col-span-1">
            <Label :label="label" v-if="label" size="base" :required="required" />
        </div>

        <div class="col-span-3 relative font-sans text-base text-[var(--color-primary-900)]">
            <div @click="isOpen = !isOpen" :class="cn(
                'flex items-center justify-between bg-[var(--color-secondary-50)] min-h-[36px] py-1 px-3 text-base rounded border transition-all',
                'cursor-pointer outline-none select-none',
                isOpen ? 'border-[var(--color-primary-500)] shadow-sm' : 'border-[var(--color-secondary-500)] hover:border-[var(--color-secondary-700)]',
                displayError && 'border-red-500 focus:border-red-500',
                selectClass
            )">
                <div class="flex flex-wrap gap-1 items-center max-w-[92%]">

                    <template v-if="multiple">
                        <template v-if="Array.isArray(modelValue) && modelValue.length > 0">
                            <div v-for="item in selectedItems" :key="item.value"
                                class="flex items-center bg-[var(--color-secondary-300)] border border-[var(--color-secondary-500)] rounded px-2 py-0.5 h-[24px] text-sm text-[var(--color-secondary-900)]"
                                @click.stop>
                                <span class="max-w-[120px] truncate">{{ item.label }}</span>
                                <button type="button" @click="removeValue(item.value)"
                                    class="ml-1.5 text-[var(--color-secondary-600)] hover:text-red-600 font-bold text-base leading-none">
                                    ×
                                </button>
                            </div>
                        </template>
                        <span v-else class="text-[var(--color-secondary-600)] leading-5">{{ placeholder }}</span>
                    </template>

                    <template v-else>
                        <span v-if="modelValue" class="leading-5 truncate text-[var(--color-secondary-900)]">{{
                            singleSelectedLabel }}</span>
                        <span v-else class="text-[var(--color-secondary-600)] leading-5">{{ placeholder }}</span>
                    </template>

                </div>

                <svg :class="['w-4 h-4 text-[var(--color-secondary-600)] transition-transform duration-200 shrink-0', isOpen ? 'rotate-180 text-[var(--color-primary-500)]' : '']"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            <div v-if="isOpen"
                class="absolute left-0 z-50 w-full mt-1 bg-[var(--color-secondary-50)] border border-[var(--color-secondary-400)] rounded-md shadow-lg max-h-[220px] overflow-y-auto p-1 animate-in fade-in slide-in-from-top-1 duration-150">

                <div v-for="item in items" :key="item.value" @click="selectItem(item.value)" :class="cn(
                    'px-3 py-2 cursor-pointer text-base whitespace-nowrap rounded transition-colors select-none',
                    isCurrentSelected(item.value)
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] font-semibold'
                        : 'text-[var(--color-secondary-900)] hover:bg-[var(--color-secondary-200)]'
                )">
                    <span>{{ item.label }}</span>
                </div>

                <div v-if="items.length === 0"
                    class="px-3 py-4 text-center text-[var(--color-secondary-600)] italic select-none text-base">
                    Không có dữ liệu
                </div>
            </div>
        </div>

        <!-- ĐÃ SỬA: Sử dụng displayError thay cho error truyền cứng -->
        <p v-if="displayError" class="col-span-4 text-sm text-red-500 mt-1 pl-[25%]">
            {{ displayError }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { cn } from '@/lib/utils'
import Label from './Label.vue';

defineOptions({
    inheritAttrs: false,
})

export interface OptionItem {
    label: string;
    value: string;
}

const props = withDefaults(
    defineProps<{
        items: OptionItem[]
        modelValue: string[] | string
        multiple?: boolean
        label?: string
        required?: boolean
        error?: string
        placeholder?: string
        containerClass?: string
        selectClass?: string
    }>(),
    {
        multiple: false,
        required: false,
        placeholder: '--- Chọn ---',
        containerClass: '',
        selectClass: ''
    }
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string[] | string): void
    (e: 'change', value: string[] | string): void
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)
const localError = ref('')

const displayError = computed(() => {
    if (props.error && props.required) {
        const isEmpty = props.multiple 
            ? (!Array.isArray(props.modelValue) || props.modelValue.length === 0)
            : !props.modelValue;
        
        if (isEmpty) return props.error;
    }
    return localError.value;
})

const isCurrentSelected = (value: string) => {
    if (props.multiple) {
        return Array.isArray(props.modelValue) && (props.modelValue as string[]).includes(value)
    }
    return props.modelValue === value
}

const selectedItems = computed(() => {
    if (!props.multiple) return []
    return props.items.filter(item => Array.isArray(props.modelValue) && (props.modelValue as string[]).includes(item.value))
})

const singleSelectedLabel = computed(() => {
    if (props.multiple) return ''
    const found = props.items.find(item => item.value === props.modelValue)
    return found ? found.label : ''
})

const checkValidation = (value: string[] | string) => {
    if (props.required) {
        const isEmpty = props.multiple 
            ? (!Array.isArray(value) || value.length === 0)
            : !value;
            
        if (isEmpty) {
            localError.value = props.error || 'Vui lòng không bỏ trống trường này';
        } else {
            localError.value = '';
        }
    }
}

const selectItem = (value: string) => {
    if (props.multiple) {
        const updatedValue = Array.isArray(props.modelValue) ? [...(props.modelValue as string[])] : []
        const index = updatedValue.indexOf(value)
        if (index > -1) {
            updatedValue.splice(index, 1)
        } else {
            updatedValue.push(value)
        }
        emit('update:modelValue', updatedValue)
        emit('change', updatedValue)
        checkValidation(updatedValue);
    } else {
        emit('update:modelValue', value)
        emit('change', value)
        isOpen.value = false
        checkValidation(value);
    }
}

const removeValue = (value: string) => {
    if (!props.multiple) return
    const updatedValue = Array.isArray(props.modelValue) ? (props.modelValue as string[]).filter(v => v !== value) : []
    emit('update:modelValue', updatedValue)
    emit('change', updatedValue)
    checkValidation(updatedValue);
}

const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
        isOpen.value = false
    }
}

watch(() => props.modelValue, (newVal) => {
    checkValidation(newVal);
}, { immediate: true })

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>