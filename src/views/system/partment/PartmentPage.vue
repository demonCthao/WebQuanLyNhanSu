<template>
    <div class="h-full w-full">
        <BasicPage page-title="Danh sách phòng ban" :is-loading="isLoading" @search="handleSearch"
            @reset="handleResetFilters" @export-excel="handleExportExcel" @add="isModalOpen = true">
            <template #filters>
                <TextField label="Tên phòng ban" v-model="filterForm.partmentName" placeholder="Tên phòng ban"
                    :is-search="true" />
            </template>
            <template #table>
                <Table :data="data?.list ?? []" :columns="tableColumns" use-can-mutation title="Danh Sách phòng ban"
                    @choose="handleTableAction" />
            </template>
        </BasicPage>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useFetch } from "@/hooks/useFetch";
import { convertObjectToParam } from "@/lib/utils";
import type {
    UserFormItem,
    UserItem,
} from "@/types/user.type";
import type { TableColumn } from "@/components/ui/Table.vue";
import Table from "@/components/ui/Table.vue";
import TextField from "@/components/ui/TextField.vue";
import BasicPage from "@/components/BasicPage.vue";
import { useMutationRequest } from "@/hooks/useMutationRequest.ts";
import { ACTION, type Action } from "@/enums/action.enum.ts";
import { isNil } from "lodash-es";
import { useNotification } from "@/composables/useNotification.ts";

interface UserListData {
    list: UserItem[];
    total: number;
}

const initialFilter = {
    partmentName: "",
    username: "",
    email: "",
};
const filterForm = ref({
    ...initialFilter,
});
const activeParams = ref("");
const userSelected = ref<UserItem | undefined>(undefined);
const notification = useNotification();
const apiUrl = "/users";
const url = computed(() =>
    activeParams.value
        ? `${apiUrl}?${activeParams.value}`
        : apiUrl
);
const urlMutation = isNil(userSelected.value)
    ? "users"
    : `users/${userSelected.value.id}`;

const method = isNil(userSelected.value)
    ? "post"
    : "put";
const queryKey = computed(() => [
    "users",
    activeParams.value,
]);

const tableColumns = ref<TableColumn[]>([
    {
        key: "full_name",
        header: "Họ và tên",
    },
    {
        key: "email",
        header: "Email",
    },
    {
        key: "phone",
        header: "Số điện thoại",
    },
    {
        key: "status",
        header: "Trạng thái",
    },
]);

const isModalOpen = ref(false);

const { data, isLoading, refetch } = useFetch<UserListData>({
    url,
    key: queryKey,
});

const { mutate } = useMutationRequest({
    key: ["create-user", "update-user"],
    url: urlMutation, method: method, options: {
        onSuccess: () => {
            notification.success("cập nhật người dùng thành công")
            isModalOpen.value = false
            refetch()
        },
        onError: () => {
            notification.error("cập nhật người dùng thất bại")
        }
    }
});

const closeModal = () => {
    isModalOpen.value = false
    userSelected.value = undefined
}

const handleSearch = () => {
    activeParams.value = convertObjectToParam(filterForm);
};

const handleResetFilters = () => {
    filterForm.value = {
        ...initialFilter,
    };

    activeParams.value = "";
};

const handleSubmit = (user: UserFormItem) => {
    mutate({user})
};

const handleExportExcel = () => {
    console.log(data.value?.list);
};

const handleTableAction = (
    item: UserItem,
    type: Action
) => {
    if (type === ACTION.EDIT) {
        isModalOpen.value = true
        userSelected.value = item
        return
    }

    if (type === ACTION.DELETE) {

        return
    }
}
</script>