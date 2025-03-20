<template>
  <DataSegment>
    <template #actions>
      <v-btn-group density="compact" variant="outlined" class="rounded-lg">
        <v-btn size="small" variant="text"> month </v-btn>
        <v-btn size="small" color="primary" variant="flat"> quarter </v-btn>
        <v-btn size="small" variant="text"> year </v-btn>
      </v-btn-group>
    </template>
    <div style="height: 300px">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </DataSegment>
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";
import type { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DataSegment from "./DataSegment.vue";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartData = ref({
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    {
      label: "Pfanner Ice Tea Peach 0.5l",
      data: [25, 20, 22, 20],
      backgroundColor: "#98D8C4",
      stack: "stack0",
      borderRadius: 0,
    },
    {
      label: "Volvic Naturelle 750ml",
      data: [15, 18, 16, 17],
      backgroundColor: "#A5DEF2",
      stack: "stack0",
      borderRadius: 0,
    },
    {
      label: "Coca Cola Classic 0.5l",
      data: [20, 22, 18, 19],
      backgroundColor: "#F5A7C4",
      stack: "stack0",
      borderRadius: 0,
    },
    {
      label: "Redbull Classic 0.33l",
      data: [15, 15, 17, 16],
      backgroundColor: "#BAB0F5",
      stack: "stack0",
      borderRadius: 0,
    },
    {
      label: "Other",
      data: [25, 25, 27, 28],
      backgroundColor: "#FFB5A6",
      stack: "stack0",
      borderRadius: 0,
    },
  ],
});

const chartOptions = ref<ChartOptions<"bar">>({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      max: 100,
      border: {
        display: false,
      },
      ticks: {
        callback: function (value) {
          return value + "%";
        },
        color: "#666666",
      },
      grid: {
        color: "#e0e0e0",
      },
    },
  },
  plugins: {
    legend: {
      position: "right",
      align: "start",
      labels: {
        boxWidth: 10,
        padding: 20,
        font: {
          size: 12,
        },
        color: "#666666",
      },
    },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#333333",
      bodyColor: "#666666",
      borderColor: "#e0e0e0",
      borderWidth: 1,
      padding: 12,
      boxPadding: 4,
      usePointStyle: true,
      callbacks: {
        label: function (context) {
          const value = context.raw as number;
          return ` ${value}%`;
        },
      },
    },
  },
});
</script>

<style scoped>
.v-btn-group {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.v-btn {
  text-transform: none;
  letter-spacing: normal;
}
</style>
