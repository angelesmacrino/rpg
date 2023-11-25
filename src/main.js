import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import "nes.css/css/nes.min.css";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')

