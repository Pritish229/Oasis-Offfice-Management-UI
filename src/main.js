import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { useAuthStore } from '@/stores/auth'

library.add(fas)

const app = createApp(App)

const pinia = createPinia()
app.use(pinia) // ✅ Use Pinia before accessing any store
app.use(router)

app.component('FontAwesomeIcon', FontAwesomeIcon)

const auth = useAuthStore()
auth.initialize?.() // optional: if you have an initialize() action

app.mount('#app')
