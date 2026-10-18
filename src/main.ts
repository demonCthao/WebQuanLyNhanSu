import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from './plugins/vue-query'
import './assets/main.css'

import App from './App.vue'
import router from './router/index.ts'
import pinia from './store/index.ts'

createApp(App)
    .use(VueQueryPlugin, {
        queryClient
    })
    .use(pinia)
    .use(router)
    .mount('#app')