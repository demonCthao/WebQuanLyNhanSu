import type { SidebarMenu } from '@/types/sidebar'
import type { RouteRecordRaw } from 'vue-router'

export type SidebarRoute = RouteRecordRaw & {
    fullPath: string
    children?: SidebarRoute[]
}

export function buildSidebarMenus(
    routes: readonly RouteRecordRaw[],
    parent = ''
): SidebarMenu[] {
    return routes.map((route) => {
        const path =
            route.path === ''
                ? parent || '/'
                : `${parent}/${route.path}`.replace(/\/+/g, '/')

        return {
            title: String(route.meta?.title ?? ''),
            icon: route.meta?.icon as string | undefined,
            path,
            name: route.name,
            route,
            meta: route.meta,
            children: route.children
                ? buildSidebarMenus(route.children, path)
                : []
        }
    })
}