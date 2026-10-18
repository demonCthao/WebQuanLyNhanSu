import { api } from "@/api/axios";
import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";

type Method = "get" | "post" | "put" | "delete";
type ResponseType = "json" | "blob";

export const useMutationRequest = <TData, TVariables = unknown>({
    key,
    url,
    method = "post",
    responseType = "json",
    options,
}: {
    key: readonly unknown[];
    url: string;
    method: Exclude<Method, "get">;
    responseType?: ResponseType;
    options?: UseMutationOptions<TData, Error, TVariables>;
}) => {
    return useMutation<TData, Error, TVariables>({
        mutationKey: key,

        mutationFn: async (variables: TVariables): Promise<TData> => {
            const isFormData = variables instanceof FormData;

            const response = await api.request({
                url,
                method,
                data: isFormData ? variables : variables,
                headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
                responseType: responseType === "blob" ? "blob" : "json",
            });

            if (responseType === "blob") {
                return response.data as TData;
            }

            return response.data as TData;
        },

        ...options,
    });
};