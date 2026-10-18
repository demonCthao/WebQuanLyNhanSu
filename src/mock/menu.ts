import type { AppMenu } from '@/types/menu.type'

export const menus: AppMenu[] = [
    {
        title: 'Dashboard',
        icon: 'mdi:view-dashboard',
        path: '/'
    },

    {
        title: 'System',
        icon: 'mdi:cog',

        children: [
            {
                title: 'User',

                children: [
                    {
                        title: 'User List',
                        path: '/users'
                    },

                    {
                        title: 'Roles',
                        path: '/roles'
                    },

                    {
                        title: 'Permission',
                        path: '/permissions'
                    }
                ]
            },

            {
                title: 'Department',

                children: [
                    {
                        title: 'Department List',
                        path: '/departments'
                    }
                ]
            }
        ]
    },

    {
        title: 'Setting',

        children: [
            {
                title: 'General',
                path: '/settings'
            }
        ]
    }
]