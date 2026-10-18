<script setup lang="ts">
import { useField } from "vee-validate";
import { computed, ref } from "vue";

defineOptions({
    inheritAttrs: false,
});

const props = withDefaults(
    defineProps<{
        name?: string;
        error?: string;
        containerClass?: string;
        inputClass?: string;
        placeholder?: string;
    }>(),
    {
        containerClass: "",
        inputClass: "",
    }
);

const model = defineModel<string | number>();

let errorMessage = ref<string | undefined>(undefined);

if (props.name) {
    const { errorMessage: fieldError } = useField<string | number>(
        () => props.name as string,
        undefined,
        {
            initialValue: model.value,
            syncVModel: true,
        }
    );
    errorMessage = fieldError;
}

const computedError = computed(() => props.error || errorMessage.value);
</script>

<template>
    <div :class="[
        'w-full flex flex-col gap-1.5',
        containerClass
    ]">
        <div :class="[
            'h-9 w-full bg-white border border-secondary-500 rounded-md px-3.5 flex items-center transition-all',
            'focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400',
            computedError && 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
        ]">
            <input 
                v-model="model" 
                v-bind="$attrs" 
                :class="[
                    'w-full bg-transparent border-none outline-none text-left font-sans',
                    'h-[calc(100%-4px)]',
                    'leading-[24px]',
                    'tracking-normal',
                    'text-[#333]',
                    'whitespace-pre',
                    'truncate',
                    'disabled:cursor-not-allowed disabled:text-secondary-500',
                    inputClass,
                ]" 
                :placeholder="placeholder" 
            />
        </div>

        <p v-if="computedError" class="text-xs text-red-500 mt-0.5">
            {{ computedError }}
        </p>
    </div>
</template>