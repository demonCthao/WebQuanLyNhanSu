export const ACTION = {
    ADD: 'add',
    EDIT: 'edit',
    DELETE: 'delete',
} as const;

export type Action = typeof ACTION[keyof typeof ACTION];