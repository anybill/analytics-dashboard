// Re-export Vue composition API functions
import * as Vue from 'vue';

// Export the composition API functions
export const ref = Vue.ref;
export const computed = Vue.computed;
export const watch = Vue.watch;
export const onMounted = Vue.onMounted;
export const onBeforeUnmount = Vue.onBeforeUnmount;
export const defineProps = Vue.defineProps;
export const defineEmits = Vue.defineEmits;

// Re-export types too
export type {
    Ref,
    ComputedRef,
    WatchStopHandle
} from 'vue'; 