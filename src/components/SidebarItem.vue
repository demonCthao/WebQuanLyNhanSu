<script setup lang="ts">
import type { SidebarMenu } from "@/types/sidebar";
import { ChevronDown, ChevronRight } from "lucide-vue-next";
import { computed, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = withDefaults(
    defineProps<{
        route: SidebarMenu;
        depth?: number;
    }>(),
    {
        depth: 0,
    }
);

const router = useRouter();
const currentRoute = useRoute();
const open = ref(false);

const depth = computed(() => props.depth ?? 0);

const hasChildren = computed(() => {
    return !!props.route.children?.length;
});

const isActive = computed(() => {
    if (props.route.name && currentRoute.name === props.route.name) {
        return true;
    }

    if (!props.route.path) return false;
    const currentPath = currentRoute.path.replace(/\/$/, '');
    const targetPath = props.route.path.replace(/\/$/, '');

    if (!hasChildren.value) {
        return currentPath === targetPath || currentRoute.meta.redirect === targetPath;
    }
    return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
});

watchEffect(() => {
    if (hasChildren.value) {
        const checkChildActive = (menu: SidebarMenu): boolean => {
            if (menu.name && currentRoute.name === menu.name) return true;

            const currentPath = currentRoute.path.replace(/\/$/, '');
            const targetPath = (menu.path || '').replace(/\/$/, '');
            if (targetPath && (currentPath === targetPath || currentPath.startsWith(targetPath + '/'))) {
                return true;
            }
            return !!menu.children?.some(child => checkChildActive(child));
        };

        if (checkChildActive(props.route)) {
            open.value = true;
        }
    }
});

const itemClass = computed(() => {
    switch (props.depth) {
        case 0:
            return "text-[16px] font-semibold";
        case 1:
            return "text-[15px] font-medium text-secondary-700";
        default:
            return "text-[14px] font-normal text-secondary-600";
    }
});

const toggle = () => {
    if (hasChildren.value) {
        open.value = !open.value;
    }

    if (props.route.name) {
        router.push({ name: props.route.name }).catch(err => {
            console.error("Lỗi điều hướng theo tên:", err);
        });
    } else if (props.route.path) {
        router.push(props.route.path).catch(err => {
            console.error("Lỗi điều hướng theo đường dẫn:", err);
        });
    }
};

const onClickIcon = (e: MouseEvent) => {
    e.stopPropagation();
    open.value = !open.value;
};
</script>

<template>
    <div class="w-full">
        <div class="flex items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 group select-none"
            :class="[
                itemClass,
                isActive
                    ? 'bg-secondary-200 font-bold shadow-sm text-blue-500'
                    : 'hover:bg-secondary-200/60 text-secondary-800'
            ]" :style="{ paddingLeft: `${12 + depth * 14}px` }" @click="toggle">

            <span v-if="hasChildren"
                class="mr-2 flex h-5 w-5 items-center justify-center rounded hover:bg-secondary-300/50 transition-colors"
                @click.stop="onClickIcon">
                <ChevronDown v-if="open" :size="16" />
                <ChevronRight v-else :size="16" />
            </span>

            <span class="leading-snug flex-1 truncate">
                {{ route.title }}
            </span>
        </div>

        <div v-if="hasChildren && open" class="overflow-hidden">
            <SidebarItem v-for="child in route.children" :key="child.path || child.name || ''" :route="child"
                :depth="depth + 1" />
        </div>
    </div>
</template>