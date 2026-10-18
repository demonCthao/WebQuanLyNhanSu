<script setup lang="ts">
import type { Approval } from '@/enums/approval.enum';
import { DAY_ACTIONS } from '@/lib/day-action';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

interface AnchorRect {
    top: number
    right: number
    bottom: number
    left: number
}

// Menu được tạo (v-if) khi người dùng bấm ba chấm và huỷ khi đóng
const props = defineProps<{ anchor: AnchorRect; date: string }>()
const emit = defineEmits<{
    (e: 'select', kind: Approval): void
    (e: 'close', restoreFocus?: boolean): void
}>()

const MARGIN = 8
const menuRef = ref<HTMLElement | null>(null)
const placed = ref(false)
const position = ref({ top: 0, left: 0 })

// Dùng position: fixed + Teleport để không bị ô lịch (overflow-hidden) cắt mất
const place = () => {
    const el = menuRef.value
    if (!el) return
    const { width, height } = el.getBoundingClientRect()

    // căn mép phải menu với mép phải nút ba chấm, không để tràn khỏi màn hình
    let left = props.anchor.right - width
    left = Math.min(Math.max(left, MARGIN), window.innerWidth - width - MARGIN)

    // mặc định mở xuống dưới; hết chỗ thì mở lên trên
    let top = props.anchor.bottom + 4
    if (top + height > window.innerHeight - MARGIN) top = props.anchor.top - height - 4
    top = Math.max(top, MARGIN)

    position.value = { top, left }
}

const items = () =>
    Array.from(menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])

const onPointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement
    if (menuRef.value?.contains(target)) return
    // Bấm vào nút ba chấm thì để chính nút đó đóng/mở, tránh vừa đóng vừa mở lại
    if (target.closest('[data-day-menu-trigger]')) return
    emit('close')
}

const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        e.preventDefault()
        emit('close', true) // đóng và trả focus về nút ba chấm
        return
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const list = items()
        if (list.length === 0) return
        const current = list.indexOf(document.activeElement as HTMLElement)
        const next = e.key === 'ArrowDown' ? (current + 1) % list.length : (current - 1 + list.length) % list.length
        list[next]?.focus()
    }
}

const onDismiss = () => emit('close')

onMounted(async () => {
    await nextTick()
    place()
    placed.value = true
    items()[0]?.focus()

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onDismiss)
    window.addEventListener('scroll', onDismiss, true)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onPointerDown, true)
    document.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('resize', onDismiss)
    window.removeEventListener('scroll', onDismiss, true)
})
</script>

<template>
    <Teleport to="body">
        <div ref="menuRef" role="menu" :aria-label="`Tùy chọn cho ngày ${date}`"
            class="fixed z-50 w-60 rounded-xl border border-secondary-200 bg-white p-1.5 shadow-lg"
            :class="{ invisible: !placed }" :style="{ top: `${position.top}px`, left: `${position.left}px` }">
            <p class="px-3 pb-1.5 pt-1 text-xs font-semibold text-[var(--color-secondary-500)]">{{ date }}</p>

            <button v-for="action in DAY_ACTIONS" :key="action.kind" type="button" role="menuitem"
                class="flex w-full items-center rounded-lg px-3 py-2 text-left text-[14px] font-medium text-[var(--color-secondary-700)] transition-colors hover:bg-secondary-50 focus:bg-secondary-50 focus:outline-none"
                @click="emit('select', action.kind)">
                {{ action.label }}
            </button>
        </div>
    </Teleport>
</template>
