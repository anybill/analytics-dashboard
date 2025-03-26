/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins

// Components
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import { createPinia } from 'pinia';


const app = createApp(App)
app
    .use(vuetify)
    .use(router)
    .use(createPinia())


app.mount('#app')
