import { createApp } from 'vue'
import './assets/base.css'
import App from './App.vue'
import { router } from './router.js'
import { initAuth } from './user.js'

// Validate any stored token / load the user before mounting (non-blocking).
initAuth()

createApp(App).use(router).mount('#app')
