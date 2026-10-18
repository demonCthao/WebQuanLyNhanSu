export type StatusKind = "approved" | "rejected" | "pending" | "unknown";

export interface StatusView {
  label: string;
  badge: string; // class cho nhãn trạng thái
  dot: string; // class cho chấm tròn ở dòng thời gian
  kind: StatusKind;
}

// Khoá (pending, approved...) phải khớp giá trị `status` backend trả về. Backend dùng số (0, 1, 2)
// hoặc chữ khác thì sửa tên khoá ở đây, giao diện không cần đổi.
const STATUS_VIEWS: Record<string, StatusView> = {
  pending: { label: "Chờ duyệt", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500 text-white", kind: "pending" },
  approved: { label: "Đã duyệt", badge: "bg-emerald-100 text-emerald-600", dot: "bg-emerald-500 text-white", kind: "approved" },
  rejected: { label: "Từ chối", badge: "bg-red-100 text-red-500", dot: "bg-red-500 text-white", kind: "rejected" },
};

export function getStatusView(status: string | number): StatusView {
  return (
    STATUS_VIEWS[String(status).toLowerCase()] ?? {
      label: String(status),
      badge: "bg-gray-100 text-gray-600",
      dot: "bg-gray-200 text-gray-500",
      kind: "unknown",
    }
  );
}

export const isPending = (status: string | number) => getStatusView(status).kind === "pending";
