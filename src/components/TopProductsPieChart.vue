<template>
  <DataSegment>
    <div style="height: 300px">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </DataSegment>
</template>

<script setup lang="ts">
import { Pie } from "vue-chartjs";
import type { ChartOptions } from "chart.js";
import type { ChartData } from "chart.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DataSegment from "./DataSegment.vue";
import type { CategoryProduct, CategoryBrand } from "@/types/analytics";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  items: (CategoryProduct | CategoryBrand)[];
  type: "product" | "brand";
}

const props = defineProps<Props>();

// Function to generate a unique color based on index
function getUniqueColor(index: number): string {
  const colors = [
    "#FF6B6B", // Coral Red
    "#4ECDC4", // Turquoise
    "#45B7D1", // Sky Blue
    "#96CEB4", // Sage Green
    "#FFEEAD", // Cream Yellow
    "#D4A5A5", // Dusty Rose
    "#9B59B6", // Purple
    "#3498DB", // Blue
    "#E67E22", // Orange
    "#2ECC71", // Green
    "#F1C40F", // Yellow
    "#E74C3C", // Red
    "#1ABC9C", // Teal
    "#34495E", // Dark Blue
    "#7F8C8D", // Gray
    "#16A085", // Dark Teal
    "#27AE60", // Dark Green
    "#2980B9", // Dark Blue
    "#8E44AD", // Dark Purple
    "#C0392B", // Dark Red
  ];
  return colors[index % colors.length];
}

const chartData = computed<ChartData<"pie">>(() => {
  const labels = props.items.map((item: CategoryProduct | CategoryBrand) => {
    if (props.type === "product" && "product" in item) {
      return item.product;
    } else if (props.type === "brand" && "brand" in item) {
      return item.brand;
    }
    return "";
  });
  const data = props.items.map(
    (item: CategoryProduct | CategoryBrand) => item.productCount
  );
  const backgroundColor = props.items.map(
    (_: CategoryProduct | CategoryBrand, index: number) => getUniqueColor(index)
  );

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };
});

const chartOptions = computed<ChartOptions<"pie">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
      labels: {
        boxWidth: 15,
        padding: 15,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: { raw: number; label: string; dataset: { data: number[] } }) => {
          const value = context.raw;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${percentage}% Marktanteil`;
        },
      },
    },
  },
}));
</script>
