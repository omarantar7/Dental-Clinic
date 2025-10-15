// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#00ACC1',
          secondary: '#0288D1',
          accent: '#4DD0E1',
          error: '#E53935',
          info: '#29B6F6',
          success: '#66BB6A',
          warning: '#FFA726',
          background: '#F5F9FA',
        },
      },
    },
  },
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')