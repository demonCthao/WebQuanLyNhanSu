import { APPROVAL } from "@/enums/approval.enum";
import type { ApprovalItem } from "@/types/approval.type";

// Dữ liệu giả để xem trước giao diện (dùng với <ApprovalDetailView :detail="MOCK_APPROVAL_DETAIL" />)
export const MOCK_APPROVAL_DETAIL: ApprovalItem = {
    id: "434hjhj-434-434",
    code: "PD-2026-0012",
    title: "Đề nghị mua sắm thiết bị văn phòng quý 3",
    status: "pending",
    type: APPROVAL.OUT_OF_OFFICE,
    user: {
        id: "dsdsad",
        email: "nv.dsd@gmail.com",
        created_at: "dasdsd",
        fullname: "Bui Dat",
        username: "dsdsd",
        failed_attempts: 1,
        locked_until: "",
        password: "",
        updated_at: ""
    },
    createdAt: "2026-07-08T09:30:00",
    dueDate: "2026-07-15T17:00:00",
    description:
        "Đề nghị phê duyệt mua sắm 10 bộ bàn ghế làm việc và 5 màn hình 27 inch cho nhân sự mới.\nTổng kinh phí dự kiến: 85.000.000đ, nguồn ngân sách hành chính quý 3.",
    steps: [
        {
            id: "78dsdsdsd-dsd78sd",
            name: "Trưởng phòng",
            user: {
                id: "dsdsad",
                email: "nv.dsd@gmail.com",
                created_at: "dasdsd",
                fullname: "Bui Dat",
                username: "dsdsd",
                failed_attempts: 1,
                locked_until: "",
                password: "",
                updated_at: ""
            },
            status: "approved",
            actedAt: "2026-07-08T11:05:00",
            comment: "Đồng ý, đúng kế hoạch đã duyệt.",
        },
        {
            id: "78dsdsdsd-dsd78sd", name: "Kế toán trưởng", user: {
                id: "dsdsad",
                email: "nv.dsd@gmail.com",
                created_at: "dasdsd",
                fullname: "Bui Dat",
                username: "dsdsd",
                failed_attempts: 1,
                locked_until: "",
                password: "",
                updated_at: ""
            }, status: "pending"
        },
        {
            id: "78dsdsdsd-dsd78sd", name: "Giám đốc", user: {
                id: "dsdsad",
                email: "nv.dsd@gmail.com",
                created_at: "dasdsd",
                fullname: "Bui Dat",
                username: "dsdsd",
                failed_attempts: 1,
                locked_until: "",
                password: "",
                updated_at: ""
            }, status: "pending"
        },
    ],
    canApprove: true,
};
