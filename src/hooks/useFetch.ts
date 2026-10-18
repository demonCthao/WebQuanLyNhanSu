import { api } from "@/api/axios";
import {
    useQuery,
    type UseQueryOptions,
} from "@tanstack/vue-query";
import {
    computed,
    toValue,
    type MaybeRefOrGetter,
} from "vue";

export interface DataResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: unknown;
}

class ApiError extends Error {
    errors?: unknown;

    constructor(message: string, errors?: unknown) {
        super(message);
        this.name = "ApiError";
        this.errors = errors;
    }
}

export const useFetch = <
    TQueryFnData,
    TData = TQueryFnData
>({
    url,
    key,
    options,
}: {
    url: MaybeRefOrGetter<string>;
    key: MaybeRefOrGetter<readonly unknown[]>;
    options?: Omit<
        UseQueryOptions<TQueryFnData, ApiError, TData>,
        "queryKey" | "queryFn"
    >;
}) => {
    return useQuery<TQueryFnData, ApiError, TData>({
        queryKey: computed(() => toValue(key)),

        queryFn: async (): Promise<TQueryFnData> => {
            const response = await api.get<DataResponse<TQueryFnData>>(
                toValue(url)
            );

            const res = response.data;

            if (res.success) {
                return res.data as TQueryFnData;
            }

            throw new ApiError(
                res.message || "Request failed",
                res.errors
            );
        },

        refetchOnWindowFocus: false,

        ...options,
    });
};