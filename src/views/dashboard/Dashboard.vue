<script setup lang="ts">
import BaseFormModal from '@/components/BaseFormModal.vue';
import EmptyPage from '@/components/EmptyPage.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import Input from '@/components/ui/Input.vue';
import SegmentLoader from '@/components/ui/SegmentLoader.vue';
import Select from '@/components/ui/Select.vue';
import AppTable, { type TableColumn } from '@/components/ui/Table.vue';
import TextField from '@/components/ui/TextField.vue';
import { useNotification } from '@/composables/useNotification';
import type { OptionItem } from '@/types/option';
import { Search } from 'lucide-vue-next';
import { ref } from 'vue';

interface UserItem {
    id: number
    username: string
    email: string
    status: boolean
}

const tableHeaders = ref<TableColumn[]>([
    { key: 'username', header: 'Tên tài khoản' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Trạng thái' },
])

const userList = ref<UserItem[]>([
    { id: 11, username: 'npp_admin', email: 'admin@notepad.com', status: true },
    { id: 12, username: 'vue_master', email: 'vue3@notepad.com', status: false },
])

const handleTableAction = (data: UserItem, type: 'edit' | 'delete') => {
    console.log(`Hành động: ${type} trên item:`, data)
}

const pluginOptions = ref<OptionItem[]>([
    { label: 'JSON Viewer Plugin', value: 'json_viewer' },
    { label: 'Compare Tool v2.0', value: 'compare_tool' },
    { label: 'MIME Tools', value: 'mime_tools' },
    { label: 'Python Script Host', value: 'python_script' },
    { label: 'XML Tools Pack', value: 'xml_tools' }
])
const pluginOption = ref<string[]>(['json_viewer'])

const langnOptions = ref<OptionItem[]>([
    { label: 'JSON Viewer Plugin', value: 'json_viewer' },
    { label: 'Compare Tool v2.0', value: 'compare_tool' },
    { label: 'MIME Tools', value: 'mime_tools' },
    { label: 'Python Script Host', value: 'python_script' },
    { label: 'XML Tools Pack', value: 'xml_tools' }
])
const notification = useNotification();
const langOption = ref<string[]>(['json_viewer'])
const isAgreed = ref(false);
const selectedFruits = ref([]);
const selectedPackage = ref<string | null>('basic');
const singleDate = ref('2026-07-08');
const dateRange = ref(['2026-07-08', '2026-07-08']);
const isOpenModal = ref(false)
const formData = ref({
    name: '',
    timeZone: '',
    code: ''
})

const timeZones = ref([
    { label: '(UTC+09:00) Asia/Seoul', value: 'seoul' },
    { label: '(UTC+08:00) Asia/Taipei', value: 'taipei' }
])

const openModal = () => {
    isOpenModal.value = true
}

const closeModal = () => {
    isOpenModal.value = false
    resetForm()
}

const handleSubmit = () => {
    console.log('Dữ liệu gửi lên server:', formData.value)
    closeModal()
}

const resetForm = () => {
    formData.value = {
        name: '',
        timeZone: '',
        code: ''
    }
}

const showNotification = () => {
    notification.info("Người dùng")
}
</script>

<template>
    <EmptyPage>
        <div class="text-xl mt-2">
            Example Component
        </div>

        <div class="flex gap-5">
            <div>
                <div class="mt-3">
                    <div class="text-xl mb-2 text-red-600">Text Field</div>
                    <div class="w-100 flex flex-1 flex-col overflow-y-auto">
                        <TextField label="Text" />
                        <TextField label="Search" placeholder="Tìm kiếm" is-search />
                        <TextField label="Number" type="number" />
                    </div>
                </div>

                <div class="mt-3">
                    <div class="text-xl text-red-600 mt-3">Button</div>
                    <div class="w-100 flex gap-2 overflow-y-auto">
                        <Button>Default</Button>
                        <Button :disabled="true">Disable</Button>
                        <Button variant="primary">Primary</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                        <Button variant="primary" :icon="Search">
                            Search
                        </Button>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="text-xl text-red-600 mt-3">Checkbox</div>
                    <div class="w-100 flex flex-1 flex-col gap-2 overflow-y-auto">
                        <Checkbox v-model="isAgreed" label="Ghi nhớ đăng nhập trên thiết bị này" />
                    </div>
                    -----------------
                    <div>
                        <Checkbox v-model="selectedFruits" value="apple" label="Quả Táo" />
                        <Checkbox v-model="selectedFruits" value="banana" label="Quả Chuối" />
                        <Checkbox v-model="selectedFruits" value="orange" label="Quả Cam" />
                    </div>
                    -----------------------
                    <div>
                        <Checkbox v-model="selectedPackage" value="basic" label="Gói Cơ Bản (Basic)" />
                        <Checkbox v-model="selectedPackage" value="premium" label="Gói Cao Cấp (Premium)" />
                        <Checkbox v-model="selectedPackage" value="enterprise" label="Gói Doanh Nghiệp (Enterprise)" />
                    </div>
                </div>
                <div class="mt-3">
                    <div class="text-xl text-red-600 mt-3 mb-2">Loading</div>
                    <div class="w-100 flex flex-1 flex-col gap-2 overflow-y-auto">
                        <SegmentLoader />
                    </div>
                </div>
                <div class="mt-3">
                    <div class="text-xl text-red-600 mt-2 mb-2">Badge</div>
                    <div class="w-100 flex flex-1 flex-col gap-2 overflow-y-auto">
                        <Badge type="danger">Badge danger</Badge>
                        <Badge type="info">Badge info</Badge>
                        <Badge type="primary">Badge primary</Badge>
                        <Badge type="secondary">Badge secondary</Badge>
                        <Badge type="success">Badge success</Badge>
                        <Badge type="warning">Badge warning</Badge>
                    </div>
                </div>
            </div>
            <div>
                <div class="text-xl text-red-600 mt-3 mb-2">Table</div>
                <div class="w-full">
                    <AppTable title="Danh Sách Tài Khoản" :data="userList" :columns="tableHeaders" use-can-mutation
                        @choose="handleTableAction">
                        <template #col-status="{ value }">
                            <span :class="[
                                'px-2 py-0.5 rounded text-xs font-medium',
                                value ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            ]">
                                {{ value ? 'Hoạt động' : 'Khóa' }}
                            </span>
                        </template>

                        <template>
                            <div class="text-xs text-gray-400 text-right">
                                Tổng số: {{ userList.length }} bản ghi
                            </div>
                        </template>
                    </AppTable>
                    <div class="flex gap-5">
                        <div class="mt-3">
                            <div class="text-xl text-red-600 mt-3 mb-2">DatePicker</div>
                            <div class="w-100 gap-2">
                                <DatePicker v-model="singleDate" label="Chọn ngày báo cáo" />
                                <DatePicker v-model="dateRange" label="Khoảng thời gian tìm kiếm" />
                            </div>
                        </div>
                        <div class="mt-3">
                            <div class="text-xl text-red-600 mt-3 mb-2">Select</div>
                            <div class="w-100 flex flex-1 flex-col gap-2">
                                <Select v-model="pluginOption" :items="pluginOptions" label="Ngôn ngữ" required
                                    error="Vui lòng chọn ít nhất một ngôn ngữ" placeholder="--- Chọn ngôn ngữ ---" />
                                <Select v-model="pluginOption" :items="pluginOptions" label="Ngôn ngữ"
                                    placeholder="--- Chọn ngôn ngữ ---" />
                                <Select v-model="langOption" :items="langnOptions" label="Ngôn ngữ" multiple required
                                    error="Vui lòng chọn ít nhất một ngôn ngữ" />
                                <Select v-model="langOption" :items="langnOptions" label="Ngôn ngữ" />
                            </div>
                        </div>
                    </div>

                    <Button class="mt-2" variant="primary" size="default" @click="openModal">
                        + New Project
                    </Button>
                    <BaseFormModal v-if="isOpenModal" title="New Project Informations" @close="closeModal"
                        @submit="handleSubmit">
                        <div class="grid grid-cols-4 gap-2 items-center">
                            <div class="col-span-1">
                                <Label label="Project Name" size="base" :required="true" />
                            </div>
                            <div class="col-span-3">
                                <Input v-model="formData.name" placeHolder="Please enter Project Name." />
                            </div>
                        </div>

                        <Select label="Time Zone" :required="true" :items="timeZones" v-model="formData.timeZone" />

                        <div class="grid grid-cols-4 gap-2 items-center">
                            <div class="col-span-1">
                                <Label label="Project Code" size="base" :required="true" />
                            </div>
                            <div class="col-span-3">
                                <Input v-model="formData.code" placeholder="Please enter Project Code." />
                            </div>
                        </div>
                    </BaseFormModal>
                </div>
            </div>
            <div>
                <div class="mt-3">
                    <div class="text-xl mb-2 text-red-600">Notification</div>
                    <div class="w-100 flex flex-1 flex-col overflow-y-auto">
                        <Button @click="showNotification" >Info</Button>
                    </div>
                </div>
            </div>
        </div>
    </EmptyPage>
</template>