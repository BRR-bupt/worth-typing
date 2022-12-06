import { createApp } from 'vue'
import './style.css'
// import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
// import './styles/main.css'

const app = createApp(App)

app.use(ElementPlus, { size: 'large', zIndex: 3000 })

// app.use(createPinia())

app.mount('#app')
