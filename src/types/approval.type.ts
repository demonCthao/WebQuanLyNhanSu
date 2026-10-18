import type { Approval } from "@/enums/approval.enum";
import type { StatusKind } from "@/lib/approval-status";
import type { UserAccount } from "./user.type";

export interface ApprovalStep {
  id: string;
  name: string; // tên bước, ví dụ "Trưởng phòng"
  user: UserAccount;
  status: StatusKind; // pending | approved | rejected | waiting
  actedAt?: string; // thời điểm xử lý (ISO)
  comment?: string;
}

export interface ApprovalItem {
    id: string;
    user: UserAccount;
    code: string;
    title: string;
    description: string;
    type: Approval;
    createdAt: string;
    dueDate: string;
    status: StatusKind;
    steps: ApprovalStep[];
    canApprove: boolean;
}