import type { TabItem } from "@/types/tab-item.type"
import { defineStore } from "pinia"

export const useTabsStore = defineStore('tabs', {
    state: () => ({
        tabs: [] as TabItem[],
        activePath: '/',
    }),

    persist: {
        storage: localStorage
    },

    actions: {
        addTab(tab: TabItem) {
            const exist = this.tabs.find(t => t.path === tab.path)

            if (!exist) {
                this.tabs.push(tab)
            }

            this.activePath = tab.path
        },

        removeTab(path: string) {
            const index = this.tabs.findIndex(t => t.path === path)

            if (index === -1) return

            this.tabs.splice(index, 1)

            if (this.activePath === path) {
                const next = this.tabs[index] ?? this.tabs[index - 1]

                this.activePath = next?.path ?? '/'

            }
        },

        reorderTabs(fromIndex: number, toIndex: number) {
            if (fromIndex === 0 || toIndex === 0 || fromIndex === toIndex) return

            const draggedItem = this.tabs[fromIndex]

            if (draggedItem) {
                this.tabs.splice(fromIndex, 1)
                this.tabs.splice(toIndex, 0, draggedItem)
            }
        }
    }
})