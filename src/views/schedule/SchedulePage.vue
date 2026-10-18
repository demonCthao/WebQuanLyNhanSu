<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronLeft, ChevronRight, Search } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { formatDateStr, useCalendarMatrix } from '@/lib/date'
import DatePicker from '@/components/ui/DatePicker.vue'
import type { Lane } from '@/types/lane.type'
import EmptyPage from '@/components/EmptyPage.vue'
import { buildEntryTitle, type ScheduleEntry } from '@/lib/day-action'
import type { Approval } from '@/enums/approval.enum'
import LeaveTypeModal from './LeaveTypeModal.vue'
import DayActionMenu from './DayActionMenu.vue'

const filters = ref([
    { id: 'all', label: 'All', color: 'bg-blue-600', checked: true },
    { id: 'my', label: 'My Calendar', color: 'bg-indigo-600', checked: true },
    { id: 'project', label: 'Project Schedule', color: 'bg-purple-500', checked: true },
    { id: 'cx', label: 'CX Schedule', color: 'bg-cyan-400', checked: true },
    { id: 'dev', label: 'Dev Schedule', color: 'bg-blue-500', checked: true },
    { id: 'ar', label: 'AR Schedule', color: 'bg-amber-800', checked: true },
    { id: 'meeting', label: 'Meeting', color: 'bg-pink-500', checked: true },
    { id: 'regular', label: 'Regular Meeting', color: 'bg-emerald-500', checked: true },
])

const myAttendanceOnly = ref(false)
const searchQuery = ref('')

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const todayObj = new Date()
const currentYear = ref(todayObj.getFullYear())
const currentMonth = ref(todayObj.getMonth())

const todayStr = formatDateStr(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate())

const selectedDate = ref(todayStr)

watch(selectedDate, (newVal) => {
    if (newVal) {
        const targetDate = Array.isArray(newVal) ? newVal[0] : newVal
        const d = new Date(targetDate)
        if (!isNaN(d.getTime())) {
            currentYear.value = d.getFullYear()
            currentMonth.value = d.getMonth()
        }
    }
})

const currentYearMonth = computed(() => {
    const mm = String(currentMonth.value + 1).padStart(2, '0')
    return `${currentYear.value}-${mm}`
})

const calendarDays = useCalendarMatrix(currentYear, currentMonth)

const holidays: Record<string, string> = {
    '2026-12-25': 'Christmas Day',
    '2027-01-01': "New Year's Day"
}

// Các mục người dùng tự đăng ký qua menu ba chấm (nghỉ phép, làm thêm giờ, làm việc ngoài văn phòng)
const registeredEntries = ref<ScheduleEntry[]>([])

const schedules = computed(() => {
    const year = currentYear.value
    const month = currentMonth.value

    const format = (d: number) => {
        const mm = String(month + 1).padStart(2, '0')
        const dd = String(d).padStart(2, '0')
        return `${year}-${mm}-${dd}`
    }

    const prevMonthStr = () => {
        const pm = month === 0 ? 12 : month
        const py = month === 0 ? year - 1 : year
        return `${py}-${String(pm).padStart(2, '0')}-28`
    }
    const nextMonthStr = () => {
        const nm = month === 11 ? 1 : month + 2
        const ny = month === 11 ? year + 1 : year
        return `${ny}-${String(nm).padStart(2, '0')}-04`
    }

    const base: ScheduleEntry[] = [
        { id: '1', title: 'AR Feature Development', startDate: prevMonthStr(), endDate: format(5), filterId: 'ar' },
        { id: '2', title: 'CX UI/UX Review Stage 1', startDate: format(3), endDate: format(10), filterId: 'cx' },
        { id: '3', title: 'Project Kickoff Phase 2', startDate: format(14), endDate: format(20), filterId: 'project' },
        { id: '4', title: 'Dev Sprint 3 Planning', startDate: format(14), endDate: format(15), filterId: 'dev' },
        { id: '5', title: 'Weekly Alignment Meeting', startDate: format(21), endDate: format(21), filterId: 'meeting' },
        { id: '6', title: 'Company Year-End Gala', startDate: format(24), endDate: format(26), filterId: 'regular' },
        { id: '7', title: 'Personal Mentoring Sync', startDate: format(25), endDate: format(25), filterId: 'my' },
        { id: '8', title: 'Code Refactoring Session', startDate: format(28), endDate: nextMonthStr(), filterId: 'dev' }
    ]

    return [...base, ...registeredEntries.value]
})

const eventLanes = computed(() => {
    const days = calendarDays.value
    if (days.length === 0) return []

    const activeFilters = filters.value.filter(f => f.checked).map(f => f.id)
    const hasAllFilter = filters.value.find(f => f.id === 'all')?.checked ?? false

    const filtered = schedules.value.filter(item => {
        if (searchQuery.value && !item.title.toLowerCase().includes(searchQuery.value.toLowerCase())) {
            return false
        }
        if (!hasAllFilter) {
            if (!activeFilters.includes(item.filterId)) return false
        }
        return true
    })

    const sorted = [...filtered].sort((a, b) => {
        const durationA = new Date(a.endDate).getTime() - new Date(a.startDate).getTime()
        const durationB = new Date(b.endDate).getTime() - new Date(b.startDate).getTime()
        if (durationB !== durationA) return durationB - durationA
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })

    type Lane = typeof sorted;
    const lanes: Lane[] = []

    sorted.forEach(event => {
        let assignedLane = -1

        for (let i = 0; i < lanes.length; i++) {
            const currentLane = lanes[i]

            if (!currentLane) continue

            const hasOverlap = currentLane.some(existing => {
                return (new Date(event.startDate) <= new Date(existing.endDate) &&
                    new Date(event.endDate) >= new Date(existing.startDate))
            })

            if (!hasOverlap) {
                assignedLane = i
                break
            }
        }

        if (assignedLane === -1) {
            lanes.push([event])
        } else {
            const targetLane = lanes[assignedLane]
            if (targetLane) {
                targetLane.push(event)
            } else {
                lanes.push([event])
            }
        }
    })

    return lanes
})

const daysWithEvents = computed(() => {
    return calendarDays.value.map(cell => {
        const dayLanes = Array.from({ length: 4 }, (_, laneIdx) => {
            const lane = eventLanes.value[laneIdx]
            if (!lane) return null

            const event = lane.find(e => cell.dateStr >= e.startDate && cell.dateStr <= e.endDate)
            if (!event) return null

            const filter = filters.value.find(f => f.id === event.filterId)
            const colorClass = filter ? filter.color : 'bg-gray-400'

            const isStart = event.startDate === cell.dateStr
            const isEnd = event.endDate === cell.dateStr

            const dayOfWeek = new Date(cell.dateStr).getDay()
            const shouldShowText = isStart || dayOfWeek === 0

            return {
                id: event.id,
                title: event.title,
                colorClass,
                isStart,
                isEnd,
                shouldShowText
            }
        })

        return {
            ...cell,
            lanes: dayLanes
        }
    })
})

// ---------- Menu ba chấm của từng ngày ----------
interface DayMenuState {
    dateStr: string
    trigger: HTMLElement
    rect: { top: number; right: number; bottom: number; left: number }
}

const dayMenu = ref<DayMenuState | null>(null)
const leaveModal = ref({ open: false, dateStr: '' })

const openDayMenu = (dateStr: string, event: MouseEvent) => {
    // Bấm lại đúng nút đang mở thì đóng menu
    if (dayMenu.value?.dateStr === dateStr) {
        closeDayMenu()
        return
    }
    const trigger = event.currentTarget as HTMLElement
    const r = trigger.getBoundingClientRect()
    dayMenu.value = {
        dateStr,
        trigger,
        rect: { top: r.top, right: r.right, bottom: r.bottom, left: r.left },
    }
}

const closeDayMenu = (restoreFocus = false) => {
    const trigger = dayMenu.value?.trigger
    dayMenu.value = null
    if (restoreFocus) trigger?.focus()
}

const handleDayAction = (kind: Approval) => {
    const dateStr = dayMenu.value?.dateStr
    if (!dateStr) return
    closeDayMenu()

    // Nghỉ phép cần chọn thêm loại nghỉ nên mở modal; hai mục còn lại đăng ký ngay
    if (kind === 'leave') {
        leaveModal.value = { open: true, dateStr }
        return
    }
    registerEntry(dateStr, kind)
}

const handleLeaveConfirm = (type: Approval) => {
    registerEntry(leaveModal.value.dateStr, 'leave', type)
    leaveModal.value.open = false
}

const closeLeaveModal = () => {
    leaveModal.value.open = false
}

// Mỗi ngày chỉ giữ 1 mục cùng loại: đăng ký lại sẽ thay thế mục cũ
const registerEntry = (dateStr: string, kind: Approval, leaveType?: Approval) => {
    registeredEntries.value = [
        ...registeredEntries.value.filter(e => !(e.startDate === dateStr && e.kind === kind)),
        {
            id: `${kind}-${dateStr}`,
            title: buildEntryTitle(kind, leaveType),
            startDate: dateStr,
            endDate: dateStr,
            filterId: 'my', // hiện cùng màu "My Calendar"; muốn màu riêng thì thêm filter mới ở trên
            kind,
        },
    ]
    // TODO: gọi API lưu lịch, ví dụ POST /schedule { date: dateStr, kind, leaveType }
}

const prevMonth = () => {
    closeDayMenu()
    if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
    } else {
        currentMonth.value--
    }
}

const nextMonth = () => {
    closeDayMenu()
    if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
    } else {
        currentMonth.value++
    }
}

const selectToday = () => {
    closeDayMenu()
    const now = new Date()
    currentYear.value = now.getFullYear()
    currentMonth.value = now.getMonth()
    selectedDate.value = formatDateStr(now.getFullYear(), now.getMonth(), now.getDate())
}
</script>

<template>
    <EmptyPage>
        <div class="flex w-full bg-white font-sans text-base text-secondary-800 select-none">
            <aside class="w-60 flex flex-col shrink-0 min-h-0 overflow-y-auto custom-scrollbar gap-3 px-2 pt-10">
                <Button variant="primary">
                    Register Schedule
                </Button>
                <div class="flex items-center justify-between py-1 border-b border-secondary-200 pb-3">
                    <span class="font-medium text-[var(--color-secondary-700)]">My Attendance Schedule</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="myAttendanceOnly" class="sr-only peer">
                        <div
                            class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-primary-700)]">
                        </div>
                    </label>
                </div>

                <div class="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
                    <label v-for="filter in filters" :key="filter.id"
                        class="flex items-center gap-3 cursor-pointer group text-[14px]">
                        <input type="checkbox" v-model="filter.checked"
                            class="rounded text-[var(--color-primary-700)] focus:ring-[var(--color-primary-600)] w-4 h-4 border-gray-300 cursor-pointer" />
                        <span class="w-3.5 h-3.5 rounded flex-shrink-0" :class="filter.color"></span>
                        <span
                            class="font-medium text-[var(--color-secondary-700)] group-hover:text-[var(--color-secondary-900)] transition-colors">
                            {{ filter.label }}
                        </span>
                    </label>
                </div>

                <hr class="border-secondary-200 my-1" />

                <div class="relative w-full">
                    <input type="text" v-model="searchQuery" placeholder="Search Others"
                        class="w-full h-9 pl-3 pr-8 rounded-lg border border-secondary-300 bg-secondary-5 focus:outline-none focus:border-[var(--color-primary-600)] text-[13px]" />
                    <Search class="absolute right-2.5 top-2.5 h-4 w-4 text-[var(--color-secondary-400)]" />
                </div>

                <div class="flex flex-col gap-1">
                    <DatePicker v-model="selectedDate" containerClass="w-full" />
                </div>
            </aside>

            <main class="flex-1 flex flex-col min-h-0 bg-white px-2">
                <div class="flex items-center justify-center gap-4 mb-1 shrink-0 relative py-1">
                    <div class="flex items-center gap-6">
                        <Button variant="default" @click="prevMonth">
                            <ChevronLeft :size="18" />
                        </Button>
                        <h2 class="text-xl font-extrabold text-secondary-800 tracking-tight">{{ currentYearMonth }}</h2>
                        <Button variant="default" @click="nextMonth">
                            <ChevronRight :size="18" />
                        </Button>
                    </div>
                    <Button variant="default" @click="selectToday" class="absolute right-2 top-1">
                        Today
                    </Button>
                </div>

                <div class="flex-1 flex flex-col border border-secondary-300 rounded-xl overflow-hidden shadow-2xs">
                    <div
                        class="grid grid-cols-7 border-b border-secondary-300 bg-secondary-50 text-center font-bold text-[14px] text-[var(--color-secondary-800)] h-11 items-center divide-x divide-[var(--color-secondary-300)]">
                        <div v-for="day in daysOfWeek" :key="day" :class="{
                            'text-red-500': day === 'Sun',
                            'text-blue-500': day === 'Sat'
                        }">
                            {{ day }}
                        </div>
                    </div>

                    <div
                        class="flex-1 grid grid-cols-7 grid-rows-6 divide-x divide-y divide-secondary-200 border-t border-transparent">
                        <div v-for="(cell, index) in daysWithEvents" :key="index"
                            class="py-1.5 px-0 flex flex-col justify-between bg-white transition-all hover:bg-secondary-50/50 relative group min-h-0"
                            :class="[
                                !cell.isCurrentMonth ? 'bg-gray-50/40' : '',
                                cell.dateStr === todayStr ? 'bg-amber-50/30 font-bold' : ''
                            ]">

                            <div class="flex items-start justify-between w-full shrink-0 px-2">
                                <span
                                    class="text-[13px] font-semibold w-6 h-6 flex items-center justify-center rounded-full"
                                    :class="[
                                        cell.isCurrentMonth ? 'text-[var(--color-secondary-800)]' : 'text-[var(--color-secondary-400)] opacity-50',
                                        cell.isCurrentMonth && cell.isSunday ? 'text-red-500 font-bold' : '',
                                        cell.isCurrentMonth && cell.isSaturday ? 'text-blue-500 font-bold' : '',
                                        cell.dateStr === todayStr ? 'bg-[var(--color-primary-700)] text-white font-bold' : ''
                                    ]">
                                    {{ cell.day }}
                                </span>

                                <div class="flex min-w-0 items-center gap-0.5">
                                    <span v-if="holidays[cell.dateStr]"
                                        class="text-[11px] font-medium text-amber-600/90 tracking-tight text-right truncate pl-1">
                                        {{ holidays[cell.dateStr] }}
                                    </span>

                                    <!-- Nút ba chấm: hiện khi rê chuột vào ô (luôn hiện trên màn hình cảm ứng) -->
                                    <button type="button" data-day-menu-trigger aria-haspopup="menu"
                                        :aria-expanded="dayMenu?.dateStr === cell.dateStr"
                                        :aria-label="`Tùy chọn cho ngày ${cell.dateStr}`"
                                        class="grid size-6 shrink-0 place-items-center rounded-full text-[var(--color-secondary-500)] transition-opacity hover:bg-secondary-200 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[var(--color-primary-600)]"
                                        :class="dayMenu?.dateStr === cell.dateStr
                                            ? 'opacity-100 bg-secondary-200'
                                            : 'opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100'"
                                        @click.stop="openDayMenu(cell.dateStr, $event)">
                                        <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                                            <circle cx="5" cy="12" r="1.8" />
                                            <circle cx="12" cy="12" r="1.8" />
                                            <circle cx="19" cy="12" r="1.8" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="flex-1 mt-1 overflow-y-auto custom-scrollbar space-y-1 w-full">
                                <div v-for="(laneEvent, laneIdx) in cell.lanes" :key="laneIdx" class="h-5 relative">
                                    <template v-if="laneEvent">
                                        <div :class="[
                                            laneEvent.colorClass,
                                            'h-full text-[11px] font-semibold text-white flex items-center shadow-xs transition-all',
                                            laneEvent.isStart && laneEvent.isEnd ? 'rounded-md mx-1 px-1.5' : '',
                                            laneEvent.isStart && !laneEvent.isEnd ? 'rounded-l-md rounded-r-none ml-1 pl-1.5 mr-0' : '',
                                            laneEvent.isEnd && !laneEvent.isStart ? 'rounded-r-md rounded-l-none mr-1 pr-1.5 ml-0' : '',
                                            !laneEvent.isStart && !laneEvent.isEnd ? 'rounded-none mx-0 px-1.5' : ''
                                        ]" :title="laneEvent.title">
                                            <span v-if="laneEvent.shouldShowText" class="truncate w-full block">
                                                {{ laneEvent.title }}
                                            </span>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="h-full bg-transparent"></div>
                                    </template>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <!-- Menu chọn loại đăng ký cho ngày được bấm -->
            <DayActionMenu v-if="dayMenu" :anchor="dayMenu.rect" :date="dayMenu.dateStr" @select="handleDayAction"
                @close="closeDayMenu" />

            <!-- Modal nhỏ chọn loại nghỉ phép: cả ngày / sáng / chiều -->
            <LeaveTypeModal :open="leaveModal.open" :date="leaveModal.dateStr" @confirm="handleLeaveConfirm"
                @close="closeLeaveModal" />
        </div>
    </EmptyPage>
</template>

<style scoped>
.grid-rows-6>div {
    border-top: none !important;
    border-left: none !important;
}
</style>
