<script setup lang="ts">
import { toRaw, computed } from 'vue';

defineOptions({
    inheritAttrs: false,
});

const props = withDefaults(
    defineProps<{
        label?: string;
        error?: string;
        containerClass?: string;
        labelClass?: string;
        value?: any;
    }>(),
    {
        containerClass: "",
        labelClass: "",
    }
);

const model = defineModel<any>();

const isChecked = computed(() => {
    if (props.value !== undefined) {
        const rawModel = toRaw(model.value);
        if (Array.isArray(rawModel)) {
            return rawModel.includes(props.value);
        }
        return model.value === props.value;
    }
    return !!model.value;
});

const handleToggle = () => {
    if (props.value !== undefined) {
        const rawModel = toRaw(model.value);
        if (Array.isArray(rawModel)) {
            const index = rawModel.indexOf(props.value);
            if (index > -1) {
                model.value = rawModel.filter((item: any) => item !== props.value);
            } else {
                model.value = [...rawModel, props.value];
            }
        } else {
            model.value = model.value === props.value ? null : props.value;
        }
    } 
    else {
        model.value = !model.value;
    }
};
</script>

<template>
    <div :class="['flex flex-col gap-1 font-sans', containerClass]">
        <label @click.prevent="handleToggle"
            class="inline-flex items-center gap-2.5 cursor-pointer select-none group w-fit">

            <div class="relative flex items-center justify-center shrink-0 h-4 w-4">
                <input type="checkbox" v-bind="$attrs" :value="value" :checked="isChecked" class="sr-only" />

                <div :class="[
                    'absolute inset-0 rounded-full border bg-white transition-all pointer-events-none',
                    isChecked ? 'border-primary-600' : 'border-secondary-400 group-hover:border-secondary-500',
                    error && 'border-red-500'
                ]"></div>

                <div :class="[
                    'absolute h-2 w-2 rounded-full transition-transform duration-150 pointer-events-none bg-primary-600',
                    isChecked ? 'scale-100' : 'scale-0'
                ]"></div>
            </div>

            <span v-if="label" :class="[
                'text-[14px] text-color-secondary-800 group-hover:text-secondary-900 font-medium transition-colors',
                labelClass
            ]">
                {{ label }}
            </span>
        </label>

        <p v-if="error" class="text-xs text-red-500 mt-0.5 pl-6">
            {{ error }}
        </p>
    </div>
</template>