// Vue composition API declarations
declare module 'vue' {
    export const ref: any;
    export const computed: any;
    export const watch: any;
    export const onMounted: any;
    export const onBeforeUnmount: any;
    export const createApp: any;
}

// Declare Chart.js component support
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// Declare Chart.js module
declare module 'chart.js/auto';
declare module 'chartjs-plugin-annotation'; 