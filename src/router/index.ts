import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useTabsStore } from '@/store/tabs'

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach((to) => {
    if (!to.name || !to.meta || !to.meta.title) {
        return;
    }

    const tabs = useTabsStore()

    tabs.addTab({
        name: String(to.name),
        title: String(to.meta.title),
        path: to.fullPath,
        closable: to.meta.closable !== false
    })
})

export default router