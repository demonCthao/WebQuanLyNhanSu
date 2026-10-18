export type AttendanceStatus = 'idle' | 'working' | 'done'

// Nghỉ trưa cố định 1 tiếng, tự động trừ khỏi giờ làm. Muốn đổi thì sửa ở đây.
export const LUNCH_BREAK_MS = 60 * 60 * 1000

export interface WorkTime {
    totalMs: number // từ lúc check in đến lúc check out (hoặc đến hiện tại)
    lunchMs: number // phần nghỉ trưa bị trừ
    workedMs: number // giờ làm việc thực tế = total - lunch
}

export function calcWorkTime(start: Date, end: Date): WorkTime {
    const totalMs = Math.max(0, end.getTime() - start.getTime())
    // Chưa làm đủ 1 tiếng thì chỉ trừ tối đa bằng thời gian đã có mặt, để giờ làm không bị âm
    const lunchMs = Math.min(LUNCH_BREAK_MS, totalMs)
    return { totalMs, lunchMs, workedMs: totalMs - lunchMs }
}

const pad = (n: number) => String(n).padStart(2, '0')

// "2026-10-18"
export const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// "08:05:09" hoặc "--:--:--" khi chưa có
export function formatClock(d: Date | null): string {
    if (!d) return '--:--:--'
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// "Chủ Nhật, 18/10/2026"
export function formatDateLong(d: Date): string {
    return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
}

// 30_600_000 -> "08:30:00"
export function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000)
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${pad(h)}:${pad(m)}:${pad(s)}`
}

// 30_600_000 -> "8 giờ 30 phút"
export function formatHoursText(ms: number): string {
    const totalMinutes = Math.floor(ms / 60000)
    return `${Math.floor(totalMinutes / 60)} giờ ${totalMinutes % 60} phút`
}

// 30_600_000 -> "8,50"
export function toDecimalHours(ms: number): string {
    return (ms / 3_600_000).toFixed(2).replace('.', ',')
}

export const STATUS_VIEW: Record<AttendanceStatus, { label: string; badge: string }> = {
    idle: { label: 'Chưa check in', badge: 'bg-gray-100 text-gray-600' },
    working: { label: 'Đang làm việc', badge: 'bg-emerald-100 text-emerald-700' },
    done: { label: 'Đã check out', badge: 'bg-amber-100 text-amber-700' },
}
