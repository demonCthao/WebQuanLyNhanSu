import { toast } from "vue-sonner";

export const useNotification = () => {
    const success = (
        message: string,
        description?: string
    ) => {
        toast.success(message, {
            description,
        });
    };

    const error = (
        message: string,
        description?: string
    ) => {
        toast.error(message, {
            description,
        });
    };

    const warning = (
        message: string,
        description?: string
    ) => {
        toast.warning(message, {
            description,
        });
    };

    const info = (
        message: string,
        description?: string
    ) => {
        toast.info(message, {
            description,
        });
    };

    const loading = (
        message: string
    ) => {
        return toast.loading(message);
    };

    const dismiss = (
        id?: string | number
    ) => {
        toast.dismiss(id);
    };

    const promise = <T>(
        promiseValue: Promise<T>,
        options: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(
            promiseValue,
            options
        );
    };

    return {
        success,
        error,
        warning,
        info,
        loading,
        dismiss,
        promise,
    };
};