export const APPROVAL = {
    OUT_OF_OFFICE: "out_of_office",
    OVERTIME: "overtime",
    LEAVE: "leave",
    FULL_DAY: "full_day",
    MORNING: "morning",
    AFTERNOON: "afternoon",
} as const;

export type Approval = typeof APPROVAL[keyof typeof APPROVAL];

export type ApprovalDecision = "approve" | "reject";