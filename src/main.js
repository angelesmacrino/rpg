import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import "nes.css/css/nes.min.css";


import './assets/main.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')

