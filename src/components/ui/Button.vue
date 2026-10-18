<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { Component } from "vue";

defineOptions({
    inheritAttrs: false,
});

const buttonVariants = cva(
    [
        "inline-flex items-center justify-center whitespace-nowrap font-sans",
        "font-medium transition-all duration-150 rounded-md",
        "select-none outline-none cursor-pointer border",
        "disabled:pointer-events-none disabled:opacity-50",
    ],
    {
        variants: {
            variant: {
                default: [
                    "bg-white",
                    "border-secondary-500",
                    "text-secondary-800",
                    "hover:bg-secondary-200",
                    "active:bg-secondary-300",
                ],

                primary: [
                    "bg-primary-800",
                    "border-primary-900",
                    "text-white",
                    "hover:bg-primary-900",
                    "active:bg-primary-800",
                ],

                destructive: [
                    "bg-red-600",
                    "border-red-600",
                    "text-white",
                    "hover:bg-red-500",
                    "active:bg-red-700",
                ],

                outline: [
                    "bg-white",
                    "border-secondary-400",
                    "text-secondary-700",
                    "hover:bg-secondary-200",
                    "hover:text-secondary-900",
                ],

                ghost: [
                    "bg-transparent",
                    "border-transparent",
                    "text-secondary-800",
                    "hover:bg-secondary-200",
                ],

                link: [
                    "border-transparent",
                    "bg-transparent",
                    "text-primary-500",
                    "underline-offset-4",
                    "hover:underline",
                    "px-0",
                ],
            },

            size: {
                xs: "h-7 px-2.5 text-[11px]",
                sm: "h-8 px-3 text-xs",
                default: "h-9 px-4 text-sm",
                lg: "h-11 px-6 text-base",
                icon: "h-9 w-9 p-0",
            },
        },

        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

const props = withDefaults(
    defineProps<{
        loading?: boolean;
        containerClass?: string;
        buttonClass?: string;
        variant?: ButtonVariants["variant"];
        size?: ButtonVariants["size"];
        icon?: Component;
    }>(),
    {
        loading: false,
        containerClass: "",
        buttonClass: "",
        variant: "default",
        size: "default",
    }
);
</script>

<template>
    <div :class="['inline-block', containerClass]">
        <button v-bind="$attrs" :disabled="loading || !!$attrs.disabled" :class="cn(
            buttonVariants({
                variant: props.variant,
                size: props.size,
            }),
            props.icon && 'pl-0.5',
            buttonClass
        )">
            <span v-if="props.icon"
                class="mr-2 flex h-full items-center justify-center border-r border-current/10 px-2 opacity-80">
                <component :is="props.icon" :size="15" />
            </span>

            <slot />
        </button>
    </div>
</template>