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


const app = createApp(App)
app
    .use(vuetify)
    .use(router);


app.mount('#app')
