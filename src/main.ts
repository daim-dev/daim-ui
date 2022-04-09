import { install } from 'vue-demi'
import { createApp } from 'vue'
import '@unocss/reset/tailwind.css' // preflights from tailwind
import 'uno.css'
import App from './App.vue'
// import installEditor from './config'

install()
// installEditor(Vue, {})

createApp(App).mount('#app')
