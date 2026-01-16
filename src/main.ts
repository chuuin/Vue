/**
 * 檔案用途：應用程式進入點，初始化 Vue App、Pinia 與 Router。
 * 依賴：Vue `createApp`、Pinia、Vue Router、全域樣式。
 * 輸入/輸出：無輸入；副作用是掛載到 `#app` 並註冊全域插件。
 */
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from '@/app/App.vue'
import router from '@/router'
import '@/styles/tailwind.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
