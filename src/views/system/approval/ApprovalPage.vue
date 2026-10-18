<script setup lang="ts">
import SegmentLoader from '@/components/ui/SegmentLoader.vue';
import Table, { type TableColumn } from "@/components/ui/Table.vue";
import type { Action } from '@/enums/action.enum';
import { useFetch } from '@/hooks/useFetch';
import type { ApprovalItem } from '@/types/approval.type';
import { computed, ref } from 'vue';
import ApprovalDetailPanel from './ApprovalDetailPanel.vue';
import { MOCK_APPROVAL_DETAIL } from '@/mock/approval.ts';

const activeParams = ref("");
const apiUrl = "/approval";
const url = computed(() =>
    activeParams.value
        ? `${apiUrl}?${activeParams.value}`
        : apiUrl
);
const queryKey = computed(() => [
    "approval",
    activeParams.value,
]);

interface ApprovalListData {
    list: ApprovalItem[];
    total: number;
}

const tableColumns = ref<TableColumn[]>([
    {
        key: "title",
        header: "Tiêu đề",
    },
    {
        key: "status",
        header: "Trạng thái",
    },
]);

const { data, isLoading, refetch } = useFetch<ApprovalListData>({
    url,
    key: queryKey,
});

// Phiếu đang được xem ở khung chi tiết bên phải
const selectedId = ref<string | number | null>(null);

const handleTableAction = (
    item: ApprovalItem,
    _type: Action
) => {
    // Bấm vào bảng thì mở chi tiết. Nếu bảng còn nút khác (xóa...), lọc theo `_type` ở đây.
    // Khoá chính không tên `id` thì đổi dòng dưới cho đúng (ví dụ item.approvalId).
    selectedId.value = item.id;
}

// Duyệt/từ chối xong thì tải lại danh sách để cập nhật cột trạng thái
const handleDecided = () => {
    refetch();
}

</script>

<template>
    <div class="h-full w-full">
        <div class="h-full grid grid-cols-2 gap-4">
            <div>
                <Table :data="data?.list ?? []" :columns="tableColumns" title="Danh Sách phê duyệt"
                    @choose="handleTableAction" class="w-full" />
            </div>
            <div class="min-h-0 overflow-y-auto">
                <ApprovalDetailPanel v-if="MOCK_APPROVAL_DETAIL" :key="selectedId || ''" :id="selectedId || ''"
                    @decided="handleDecided" />

                <div v-else
                    class="grid min-h-60 place-items-center rounded-xl border border-dashed border-gray-300 bg-white/60 p-6 text-center text-sm text-gray-500">
                    Chọn một phiếu ở danh sách bên trái để xem chi tiết phê duyệt
                </div>
            </div>
        </div>
    </div>
</template>
