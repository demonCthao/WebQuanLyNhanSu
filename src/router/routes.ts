import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        children: [
            // ======================
            // DASHBOARD (LEVEL 1)
            // ======================
            {
                path: '',
                name: 'dashboard',
                component: () => import('@/views/dashboard/Dashboard.vue'),
                meta: {
                    title: 'Dashboard',
                    icon: 'mdi:view-dashboard',
                    closable: false,
                    keepAlive: true,
                }
            },

            // ======================
            // Hệ thống chấm công (LEVEL 1)
            // ======================
            {
                path: 'time-tracking',
                name: 'Time tracking',
                component: () => import('@/views/time-tracking/TimeTracking.vue'),
                meta: {
                    title: 'Chấm công',
                    icon: 'mdi:view-dashboard',
                    closable: false,
                    keepAlive: true,
                }
            },

            // ======================
            // Hệ Thống (LEVEL 1 GROUP)
            // ======================
            {
                path: 'system',
                // BẮT BUỘC CÓ: RouterView làm trung gian để kích hoạt định tuyến con
                component: () => import('vue-router').then(m => m.RouterView),
                redirect: '/system/user/list',
                meta: {
                    title: 'Hệ thống',
                    icon: 'mdi:cog'
                },
                children: [
                    // ======================
                    // USER LIST (LEVEL 3 PAGE)
                    // ======================
                    {
                        path: 'partment',
                        name: 'partment',
                        component: () => import('@/views/system/partment/PartmentPage.vue'),
                        meta: {
                            title: 'Phòng ban',
                            closable: true,
                            keepAlive: true,
                            favorite: true
                        }
                    },

                    // ======================
                    // USER LIST (LEVEL 3 PAGE)
                    // ======================
                    {
                        path: 'list',
                        name: 'user-list',
                        component: () => import('@/views/system/user/UserPage.vue'),
                        meta: {
                            title: 'Danh sách nhân viên',
                            closable: true,
                            keepAlive: true,
                            favorite: true
                        }
                    },

                    // ======================
                    // ROLE (LEVEL 3 PAGE)
                    // ======================
                    {
                        path: 'role',
                        name: 'role-list',
                        component: () => import('@/views/system/role/RolePage.vue'),
                        meta: {
                            title: 'Quyền',
                            closable: true,
                            keepAlive: true
                        }
                    },

                    // ======================
                    // ROLE (LEVEL 3 PAGE)
                    // ======================
                    {
                        path: 'approval',
                        name: 'approval-list',
                        component: () => import('@/views/system/approval/ApprovalPage.vue'),
                        meta: {
                            title: 'Phê duyệt',
                            closable: true,
                            keepAlive: true
                        }
                    }
                ]
            },
            {
                path: 'schedule',
                name: 'Schedule',
                component: () => import('@/views/schedule/SchedulePage.vue'),
                meta: {
                    title: 'Lịch của tôi',
                    icon: 'mdi:view-dashboard',
                    closable: false,
                    keepAlive: true,
                }
            },
        ]
    }
]