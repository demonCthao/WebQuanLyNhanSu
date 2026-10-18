import type { Approval } from "@/enums/approval.enum";

// Các lựa chọn trong menu ba chấm của từng ngày
export const DAY_ACTIONS: { kind: Approval; label: string }[] = [
    { kind: 'leave', label: 'Nghỉ phép' },
    { kind: 'overtime', label: 'Làm thêm giờ' },
    { kind: 'out_of_office', label: 'Làm việc ngoài văn phòng' },
]

// Các loại nghỉ trong modal "Nghỉ phép". `short` dùng làm tên hiển thị trên lịch
export const LEAVE_TYPES: { value: Approval; label: string; short: string }[] = [
    { value: 'full_day', label: 'Nghỉ cả ngày', short: 'Cả ngày' },
    { value: 'morning', label: 'Nghỉ sáng', short: 'Sáng' },
    { value: 'afternoon', label: 'Nghỉ chiều', short: 'Chiều' },
]

// Một mục trên lịch (cùng dạng với mảng `schedules` của trang)
export interface ScheduleEntry {
    id: string
    title: string
    startDate: string
    endDate: string
    filterId: string
    kind?: Approval // chỉ có ở các mục người dùng tự đăng ký
}

// "Nghỉ phép (Sáng)", "Làm thêm giờ", ...
export function buildEntryTitle(kind: Approval, leaveType?: Approval): string {
    const action = DAY_ACTIONS.find((a) => a.kind === kind)?.label ?? kind
    if (kind !== 'leave' || !leaveType) return action

    const short = LEAVE_TYPES.find((t) => t.value === leaveType)?.short
    return short ? `${action} (${short})` : action
}
