import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './index.css'

import api from './api'
import en from './messages/en'
import de from './messages/de'

const i18n = createI18n({
  locale: navigator.language,
  fallbackLocale: 'de',
  messages: { en, de }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')

if (!localStorage['uid']) {
  localStorage['uid'] = Math.random().toString(36).slice(2)
}
