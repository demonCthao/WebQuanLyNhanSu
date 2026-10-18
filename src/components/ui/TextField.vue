<script setup lang="ts">
import { computed } from "vue";
import { useField } from "vee-validate";
import { Search } from "lucide-vue-next";
import Label from "./Label.vue";
import Input from "./Input.vue";

defineOptions({
    inheritAttrs: false,
});

const props = withDefaults(
    defineProps<{
        name?: string;
        label?: string;
        required?: boolean;
        error?: string;
        containerClass?: string;
        inputClass?: string;
        isSearch?: boolean;
        placeHolder?: string;
    }>(),
    {
        required: false,
        containerClass: "",
        inputClass: "",
        isSearch: false,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string | number | undefined): void
}>()

const modelValue = defineModel<string | number>();
const hasFormField = computed(() => !!props.name);

const {
    value: fieldValue,
    errorMessage,
} = hasFormField.value
        ? useField<string | number>(() => props.name!)
        : {
            value: modelValue,
            errorMessage: undefined,
        };


const value = computed({
    get() {
        return fieldValue.value;
    },

    set(val) {
        fieldValue.value = val;
        emit("update:modelValue", val);
    },
});
</script>

<template>
    <div :class="['flex flex-col gap-1.5 font-sans', containerClass]">
        <Label :label="label" size="base" :required="required" />
        <div class="relative w-full flex items-center">
            <Input v-model="value" v-bind="$attrs" :name="name" :error="error || errorMessage" :class="inputClass"
                :place-holder="placeHolder" />
            <div v-if="isSearch"
                class="absolute right-3 text-secondary-600 pointer-events-none flex items-center justify-center">
                <Search class="h-4 w-4" stroke-width="2" />
            </div>
        </div>
    </div>
</template>