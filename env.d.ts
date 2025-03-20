/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="vite-plugin-vue-layouts/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'vue' {
    import type { DefineComponent } from '@vue/runtime-core'
    export { DefineComponent }
    export * from '@vue/runtime-core'
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $vuetify: any
    }
}
