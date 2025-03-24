/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Chart.js setup
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

// Register Chart.js components and plugins
Chart.register(...registerables, annotationPlugin)

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light'
    }
})

const app = createApp(App)

registerPlugins(app)
app.use(vuetify)

app.mount('#app')
