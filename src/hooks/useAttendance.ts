import { calcWorkTime, toDateKey, type AttendanceStatus } from '@/lib/attendance-time'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'attendance:today'

interface StoredAttendance {
    date: string
    checkInAt: string
    checkOutAt: string | null
}

interface AttendanceTimes {
    checkInAt: Date | null
    checkOutAt: Date | null
}

const isValid = (d: Date) => !Number.isNaN(d.getTime())

// Tải dữ liệu hôm nay đã lưu (để tải lại trang không mất). Sang ngày mới thì bắt đầu lại từ đầu.
function loadToday(): AttendanceTimes {
    const empty: AttendanceTimes = { checkInAt: null, checkOutAt: null }
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return empty

        const saved = JSON.parse(raw) as StoredAttendance
        if (saved.date !== toDateKey(new Date())) return empty

        const checkInAt = new Date(saved.checkInAt)
        const checkOutAt = saved.checkOutAt ? new Date(saved.checkOutAt) : null
        if (!isValid(checkInAt) || (checkOutAt && !isValid(checkOutAt))) return empty
        return { checkInAt, checkOutAt }
    } catch {
        return empty
    }
}

function saveToday({ checkInAt, checkOutAt }: AttendanceTimes) {
    try {
        if (!checkInAt) {
            localStorage.removeItem(STORAGE_KEY)
            return
        }
        const data: StoredAttendance = {
            date: toDateKey(checkInAt),
            checkInAt: checkInAt.toISOString(),
            checkOutAt: checkOutAt ? checkOutAt.toISOString() : null,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
        // trình duyệt chặn localStorage (chế độ riêng tư...): bỏ qua, chỉ mất khả năng giữ lại khi tải lại trang
    }
}

export function useAttendance() {
    const stored = loadToday()
    const checkInAt = ref<Date | null>(stored.checkInAt)
    const checkOutAt = ref<Date | null>(stored.checkOutAt)

    // Đồng hồ chạy mỗi giây để giờ làm việc cập nhật trực tiếp khi chưa check out
    const now = ref(new Date())
    let timer: ReturnType<typeof setInterval> | undefined
    onMounted(() => {
        timer = setInterval(() => {
            now.value = new Date()
        }, 1000)
    })
    onBeforeUnmount(() => clearInterval(timer))

    watch([checkInAt, checkOutAt], () => saveToday({ checkInAt: checkInAt.value, checkOutAt: checkOutAt.value }))

    const status = computed<AttendanceStatus>(() => {
        if (!checkInAt.value) return 'idle'
        return checkOutAt.value ? 'done' : 'working'
    })

    // Check in đúng 1 lần/ngày; check out chỉ khi đã check in và bấm được nhiều lần
    const canCheckIn = computed(() => checkInAt.value === null)
    const canCheckOut = computed(() => checkInAt.value !== null)

    const checkIn = () => {
        if (!canCheckIn.value) return
        checkInAt.value = new Date()
        checkOutAt.value = null
        // TODO: gọi API check in
    }

    // Mỗi lần bấm sẽ cập nhật giờ ra thành thời điểm hiện tại (giờ ra cuối cùng là giờ được tính)
    const checkOut = () => {
        if (!canCheckOut.value) return
        checkOutAt.value = new Date()
        // TODO: gọi API check out
    }

    // Đã check out thì tính đến giờ ra; chưa thì tính đến hiện tại
    const work = computed(() => {
        if (!checkInAt.value) return null
        return calcWorkTime(checkInAt.value, checkOutAt.value ?? now.value)
    })

    // Chỉ dùng để thử nghiệm
    const reset = () => {
        checkInAt.value = null
        checkOutAt.value = null
    }

    return { now, checkInAt, checkOutAt, status, canCheckIn, canCheckOut, work, checkIn, checkOut, reset }
}
