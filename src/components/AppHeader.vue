<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import {
    Minimize,
    Maximize,
    HelpCircle,
    CircleUserRound,
    ExternalLink
} from "lucide-vue-next";
import { routes } from "@/router/routes";
import BaseConfirmModal from "./BaseConfirmModal.vue";

interface MenuItem {
    label: string;
    href?: string;
    isExternal?: boolean;
    disabled?: boolean;
    action?: () => void;
}

const route = useRoute();
const showUserMenu = ref(false);
const showHelpMenu = ref(false);
const isFullscreen = ref(false);

const showLogoutConfirm = ref(false);

const headerMenus = routes[0]?.children?.filter(r => r.meta && r.meta.title) || [];

const isMenuActive = (menu: any) => {
    if (menu.path === '') {
        return route.path === '/';
    }
    return route.path.startsWith(`/${menu.path}`);
};

const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value;
    if (showUserMenu.value) showHelpMenu.value = false;
};

const toggleHelpMenu = () => {
    showHelpMenu.value = !showHelpMenu.value;
    if (showHelpMenu.value) showUserMenu.value = false;
};

const handleRequestLogout = () => {
    showUserMenu.value = false;
    showLogoutConfirm.value = true;
};

const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
};

const userMenuItems: MenuItem[] = [
    { label: "Multi-Dashboard", href: "#", isExternal: true, disabled: true },
    { label: "Privacy Policy", href: "#", isExternal: true },
    { label: "Service Setting", href: "#" },
    { label: "Personal Setting", href: "#" },
    { label: "Logout", action: handleRequestLogout }
];

const helpMenuItems: MenuItem[] = [
    { label: "FAQ", href: "#" },
    { label: "Terms", href: "#" },
    { label: "User Guide", href: "#", isExternal: true }
];

const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!target.closest(".avatar-box")) {
        showUserMenu.value = false;
    }
    if (!target.closest(".help-box")) {
        showHelpMenu.value = false;
    }
};

const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        isFullscreen.value = true;
    } else {
        await document.exitFullscreen();
        isFullscreen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
    <header
        class="relative flex h-[64px] items-center justify-between bg-[var(--color-primary-900)] px-10 select-none font-sans text-white border-b border-[var(--color-primary-800)] shadow-sm">

        <!-- LOGO BRANDING -->
        <div class="font-bold text-white text-lg tracking-tight z-10">
            Logo
        </div>

        <!-- NAVIGATION: MENU CHÍNH GIỮA (ĐÃ PHÓNG TO VÀ THIẾT KẾ ĐẸP HƠN) -->
        <nav class="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-10 hidden md:flex h-full">
            <router-link v-for="menu in headerMenus" :key="menu.name || menu.path"
                :to="menu.path === '' ? '/' : `/${menu.path}`"
                class="relative text-[17px] tracking-wide font-medium transition-all duration-200 h-full flex items-center cursor-pointer group"
                :class="[
                    isMenuActive(menu)
                        ? 'text-white font-semibold'
                        : 'text-white/75 hover:text-white'
                ]">
                <span>{{ menu.meta?.title }}</span>

                <!-- Thanh line chỉ báo active tinh tế ở viền dưới header -->
                <span
                    class="absolute bottom-0 left-0 w-full h-[3px] bg-white rounded-t-full transition-transform duration-200 origin-bottom"
                    :class="isMenuActive(menu) ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50 bg-white/50'">
                </span>
            </router-link>
        </nav>

        <!-- RIGHT UTILITIES -->
        <div class="flex items-center gap-4 z-10">

            <!-- Fullscreen Button -->
            <button
                class="p-2 cursor-pointer text-white/75 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center justify-center"
                @click="toggleFullscreen" title="Độ phóng màn hình">
                <Maximize v-if="!isFullscreen" class="h-5 w-5" />
                <Minimize v-else class="h-5 w-5" />
            </button>

            <!-- Help Dropdown Box -->
            <div class="relative help-box">
                <button @click="toggleHelpMenu"
                    class="p-2 cursor-pointer text-white/75 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center justify-center focus:outline-none">
                    <HelpCircle class="h-5 w-5" />
                </button>

                <Transition enter-active-class="transition duration-150 ease-out"
                    enter-from-class="opacity-0 translate-y-1 scale-95"
                    enter-to-class="opacity-100 translate-y-0 scale-100"
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100 translate-y-0 scale-100"
                    leave-to-class="opacity-0 translate-y-1 scale-95">
                    <div v-if="showHelpMenu"
                        class="absolute right-0 mt-2.5 w-52 rounded-xl border border-[var(--color-secondary-200)] bg-white shadow-xl z-50 overflow-hidden p-1.5 text-left animate-in">
                        <template v-for="(item, index) in helpMenuItems" :key="index">
                            <component :is="item.disabled ? 'span' : 'a'" :href="item.disabled ? undefined : item.href"
                                @click="item.action ? item.action() : null" :class="[
                                    'flex items-center justify-between px-3.5 py-2 text-[14px] font-medium rounded-lg transition-colors',
                                    item.disabled
                                        ? 'text-[var(--color-secondary-400)] cursor-not-allowed bg-transparent select-none'
                                        : 'text-[var(--color-secondary-800)] hover:bg-[var(--color-secondary-100)] hover:text-[var(--color-primary-900)] cursor-pointer'
                                ]">
                                <span>{{ item.label }}</span>
                                <ExternalLink v-if="item.isExternal" class="h-3.5 w-3.5 opacity-60 text-current" />
                            </component>
                        </template>
                    </div>
                </Transition>
            </div>

            <!-- User Avatar Dropdown Box -->
            <div class="relative avatar-box">
                <button
                    class="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 text-white border border-white/10 cursor-pointer hover:bg-white/25 transition-all focus:outline-none"
                    @click="toggleUserMenu">
                    <CircleUserRound class="h-5 w-5" />
                </button>

                <Transition enter-active-class="transition duration-150 ease-out"
                    enter-from-class="opacity-0 translate-y-1 scale-95"
                    enter-to-class="opacity-100 translate-y-0 scale-100"
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100 translate-y-0 scale-100"
                    leave-to-class="opacity-0 translate-y-1 scale-95">
                    <div v-if="showUserMenu"
                        class="absolute right-0 mt-2.5 w-56 rounded-xl border border-[var(--color-secondary-200)] bg-white shadow-xl z-50 overflow-hidden p-1.5 text-left">
                        <template v-for="(item, index) in userMenuItems" :key="index">

                            <!-- Dải phân cách mỏng thay cho màu xám cũ thô -->
                            <div v-if="index === 4" class="h-px bg-[var(--color-secondary-200)] my-1.5 mx-2"></div>

                            <component :is="item.disabled ? 'span' : 'a'" :href="item.disabled ? undefined : item.href"
                                @click="item.action ? item.action() : null" :class="[
                                    'flex items-center justify-between px-3.5 py-2 text-[14px] font-medium rounded-lg transition-all',
                                    item.disabled
                                        ? 'text-[var(--color-secondary-400)] cursor-not-allowed bg-transparent'
                                        : item.label === 'Logout'
                                            ? 'text-red-600 hover:bg-red-50 cursor-pointer'
                                            : 'text-[var(--color-secondary-800)] hover:bg-[var(--color-secondary-100)] hover:text-[var(--color-primary-900)] cursor-pointer'
                                ]">
                                <span>{{ item.label }}</span>
                                <ExternalLink v-if="item.isExternal" class="h-3.5 w-3.5 opacity-60 text-current" />
                            </component>
                        </template>
                    </div>
                </Transition>
            </div>

        </div>
    </header>

    <BaseConfirmModal v-model="showLogoutConfirm" title="Bạn có chắc chắn muốn đăng xuất không?" cancel-text="Hủy bỏ"
        confirm-text="Xác nhận" @confirm="logout" />
</template>