<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/router/routes'
import SidebarItem from './SidebarItem.vue'
import type { RouteRecordRaw } from 'vue-router'
import { buildSidebarMenus } from '@/router/sidebar.ts'
import type { SidebarMenu } from '@/types/sidebar'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)

const toggleSidebar = () => {
    collapsed.value = !collapsed.value
}

const appRoute = routes.find(r => r.path === '/') as RouteRecordRaw

const mapAbsolutePaths = (menuList: SidebarMenu[]): SidebarMenu[] => {
    return menuList.map(item => {
        let absolutePath = item.path

        if (item.name) {
            try {
                const resolved = router.resolve({ name: item.name })
                if (resolved && resolved.href !== '/') {
                    absolutePath = resolved.path
                }
            } catch (e) {
                console.warn(`Không resolve được route name: ${String(item.name)}`, e)
            }
        }

        let newChildren: SidebarMenu[] = []
        if (item.children && item.children.length > 0) {
            newChildren = mapAbsolutePaths(item.children)
        }

        return {
            ...item,
            path: absolutePath,
            children: newChildren
        }
    })
}

const rawHierarchyMenus = computed(() => {
    const children = appRoute?.children ?? []
    const activeLevel1 = children.find(r => r.path !== '' && route.path.startsWith(`/${r.path}`))

    if (activeLevel1 && activeLevel1.children) {
        const rawMenus = buildSidebarMenus(activeLevel1.children)
        return mapAbsolutePaths(rawMenus)
    }
    return []
})

const displayMenus = computed(() => {
    if (!collapsed.value) {
        return rawHierarchyMenus.value
    }

    const flattened: SidebarMenu[] = []
    rawHierarchyMenus.value.forEach(item => {
        if (item.children && item.children.length > 0) {
            flattened.push(...item.children)
        } else {
            flattened.push(item)
        }
    })
    return flattened
})

const currentMenuTitle = computed(() => {
    const children = appRoute?.children ?? []
    const activeLevel1 = children.find(r => r.path !== '' && route.path.startsWith(`/${r.path}`))
    return activeLevel1?.meta?.title || 'Project messages'
})

const isItemActive = (item: SidebarMenu) => {
    return route.path === item.path || route.path.startsWith(item.path + '/')
}
</script>

<template>
    <aside
        class="h-full bg-secondary-300 border-r border-gray-200 flex flex-col select-none font-sans text-[15px] text-gray-700 shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
        :class="collapsed ? 'w-[50px]' : 'w-[240px]'">

        <div class="w-full flex items-center justify-between px-4 py-4 shrink-0 h-14"
             :class="{ 'justify-center px-0': collapsed }">
            <span v-if="!collapsed" class="font-semibold text-gray-800 text-[16px] truncate pr-2">
                {{ currentMenuTitle }}
            </span>
            
            <button @click="toggleSidebar"
                class="p-1 hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded transition-all duration-200 cursor-pointer"
                :class="collapsed ? 'mx-auto' : 'ml-auto'">
                <ArrowLeft v-if="!collapsed" :size="18" />
                <ArrowRight v-else :size="18" />
            </button>
        </div>

        <div class="flex-1 overflow-y-auto min-h-0 custom-scrollbar flex flex-col"
             :class="collapsed ? 'px-0 items-center justify-start' : 'px-3 pb-4 gap-[2px]'">
            
            <template v-if="displayMenus.length > 0">
                <template v-for="menu in displayMenus" :key="menu.name || menu.path || ''">
                    
                    <div v-if="!collapsed" class="w-full">
                        <SidebarItem :route="menu" />
                    </div>

                    <div v-else 
                         class="vertical-menu-item"
                         :class="isItemActive(menu) ? 'active' : 'inactive'">
                        <SidebarItem :route="menu" :collapsed="true" />
                    </div>

                </template>
            </template>

            <div v-else-if="!collapsed" class="text-center pt-8 text-gray-400 text-xs italic">
                Không có danh mục
            </div>
        </div>
    </aside>
</template>