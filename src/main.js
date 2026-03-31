import { createApp } from 'vue'
import App from './App.vue'
import { initSampleData } from './utils/storage'

// 初始化示例数据
initSampleData()

const app = createApp(App)
app.mount('#app')
