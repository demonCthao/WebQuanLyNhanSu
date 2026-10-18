<script setup lang="ts">
import { useForm } from "vee-validate";
import BaseFormModal from "@/components/BaseFormModal.vue";
import TextField from "@/components/ui/TextField.vue";
import { watch } from "vue";
import { userFormSchema } from "@/schema/user.schema";
import type { UserFormItem, UserItem } from "@/types/user.type";

const props = defineProps<{
    isOpen: boolean;
    initialData?: UserItem;
}>();

const emit = defineEmits<{
    (e: "close"): void;
    (e: "submit", values: UserFormItem): void;
}>();

const { handleSubmit, resetForm } = useForm({
    validationSchema: userFormSchema,
    initialValues: {
        full_name: "",
        email: "",
        phone: "",
        role: "",
        lang: "",
    },
});

watch(
    [() => props.isOpen, () => props.initialData],
    ([isOpen, data]) => {
        const userData = data;
        
        if (isOpen && userData) {
            resetForm({
                values: {
                    full_name: userData.full_name || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    role: userData.role || "",
                    lang: userData.lang || "",
                }
            });
        } else if (!isOpen) {
            resetForm({
                values: {
                    full_name: "",
                    email: "",
                    phone: "",
                    role: "",
                    lang: ""
                }
            });
        }
    },
    { deep: true, immediate: true }
);

const onFormSubmit = handleSubmit((values) => {
    emit("submit", values);
});

</script>

<template>
    <BaseFormModal v-if="isOpen" :title="initialData ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng'"
        :submit-text="initialData ? 'Cập nhật' : 'Lưu lại'" @close="emit('close')" @submit="onFormSubmit">
        <div class="grid grid-cols-1 gap-2">
            <TextField required name="full_name" label="Họ và tên" placeholder="Nhập tên" />
            <TextField required name="email" label="Hộp thư (Email)" placeholder="Nhập email" />
            <TextField required name="phone" label="Số điện thoại" placeholder="Nhập số điện thoại" />
            <TextField required name="role" label="Quyền hạn (Role)" placeholder="Nhập vai trò" />
            <TextField required name="lang" label="Ngôn ngữ" placeholder="Nhập ngôn ngữ" />
        </div>
    </BaseFormModal>
</template>