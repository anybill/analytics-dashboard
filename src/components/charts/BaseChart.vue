<template>
  <div :style="{ height: height }">
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  },
  height: {
    type: String,
    default: '300px'
  }
});

const canvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

onMounted(() => {
  if (canvas.value) {
    chart = new Chart(canvas.value, {
      type: props.type as any,
      data: props.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...props.options
      }
    });
  }
});

watch(() => props.data, (newData) => {
  if (chart) {
    chart.data = newData;
    chart.update();
  }
}, { deep: true });

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style> 