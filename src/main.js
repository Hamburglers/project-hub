import { createApp } from 'vue'
import App from './App.vue'
import { registerScrollSpy } from 'vue3-scroll-spy'

const app = createApp(App)
registerScrollSpy(app)
app.mount('#app')
