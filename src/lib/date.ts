import { computed } from 'vue';

// Hàm helper để tạo chuỗi định dạng YYYY-MM-DD
export const formatDateStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
};

/**
 * Hàm sinh ma trận 42 ngày (6 tuần) cho một tháng/năm bất kỳ
 * @param yearRef Ref hoặc Computed chứa năm
 * @param monthRef Ref hoặc Computed chứa tháng (0-11)
 */
export const useCalendarMatrix = (yearRef: { value: number }, monthRef: { value: number }) => {
    return computed(() => {
        const year = yearRef.value;
        const month = monthRef.value;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const totalDaysPrev = new Date(year, month, 0).getDate();

        const matrix = [];

        // 1. Sinh các ngày thuộc tháng trước (màu mờ)
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const prevM = month === 0 ? 11 : month - 1;
            const prevY = month === 0 ? year - 1 : year;
            const d = totalDaysPrev - i;
            matrix.push({
                day: d,
                isCurrentMonth: false,
                dateStr: formatDateStr(prevY, prevM, d),
                isSunday: false,
                isSaturday: false
            });
        }

        // 2. Sinh các ngày thuộc tháng hiện tại
        for (let d = 1; d <= totalDays; d++) {
            const currentIdx = new Date(year, month, d).getDay();
            matrix.push({
                day: d,
                isCurrentMonth: true,
                dateStr: formatDateStr(year, month, d),
                isSunday: currentIdx === 0,
                isSaturday: currentIdx === 6
            });
        }

        // 3. Sinh các ngày thuộc tháng sau để lấp đầy grid 42 ô
        const remainingCells = 42 - matrix.length;
        for (let d = 1; d <= remainingCells; d++) {
            const nextM = month === 11 ? 0 : month + 1;
            const nextY = month === 11 ? year + 1 : year;
            matrix.push({
                day: d,
                isCurrentMonth: false,
                dateStr: formatDateStr(nextY, nextM, d),
                isSunday: false,
                isSaturday: false
            });
        }

        return matrix;
    });
};