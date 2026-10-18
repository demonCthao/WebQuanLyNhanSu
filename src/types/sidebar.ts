import type { RouteMeta, RouteRecordRaw } from 'vue-router'

export interface SidebarMenu {
    title: string
    icon?: string
    path: string
    name?: string | symbol
    children: SidebarMenu[]
    route: RouteRecordRaw
    meta?: RouteMeta;
}