import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isRef, type Ref } from "vue";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isEmail(val: string): Boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
}

export function convertObjectToParam<T extends object>(obj: T | Ref<T>) {
    const rawObj = isRef(obj) ? obj.value : obj;

    return new URLSearchParams(
        Object.entries(rawObj as Record<string, unknown>)
            .filter(([, v]) => v !== undefined && v !== null && v !== '')
            .map(([k, v]) => [k, String(v).trim()])
    ).toString();
}

// "2026-07-08T09:30:00" -> "09:30 08/07/2026"
export function formatDateTime(value?: string | null): string {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}