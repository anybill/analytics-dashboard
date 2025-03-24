import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register Chart.js components
Chart.register(...registerables, annotationPlugin);

// Create a type declaration file for Vue components
declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        BaseChart: typeof import('../components/charts/BaseChart.vue')['default'];
        RfmHeatMap: typeof import('../components/charts/RfmHeatMap.vue')['default'];
        ClvTimeline: typeof import('../components/charts/ClvTimeline.vue')['default'];
        FrequencyDistribution: typeof import('../components/charts/FrequencyDistribution.vue')['default'];
        BasketSizeComparison: typeof import('../components/charts/BasketSizeComparison.vue')['default'];
        RecencyFrequencyQuadrant: typeof import('../components/charts/RecencyFrequencyQuadrant.vue')['default'];
    }
}

// Fix for Vue composition API imports
export const VueCompositionFix = {
    // Re-export composition API from Vue
    ref: typeof import('vue').ref,
    computed: typeof import('vue').computed,
    watch: typeof import('vue').watch,
    onMounted: typeof import('vue').onMounted,
    onBeforeUnmount: typeof import('vue').onBeforeUnmount
}; 