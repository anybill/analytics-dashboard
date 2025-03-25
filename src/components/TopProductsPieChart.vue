<template>
  <DataSegment>
    <div style="height: 300px">
      <Pie
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </DataSegment>
</template>

<script setup lang="ts">
import { Pie } from "vue-chartjs";
import type { ChartOptions } from "chart.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DataSegment from "./DataSegment.vue";
import type { CategoryProduct, CategoryBrand } from "@/types/analytics";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  items: (CategoryProduct | CategoryBrand)[];
  type: "product" | "brand";
}

const props = defineProps<Props>();

const chartData = computed(() => {
  const labels = props.items.map((item: CategoryProduct | CategoryBrand) =>
    props.type === "product"
      ? (item as CategoryProduct).product
      : (item as CategoryBrand).brand
  );

  const data = props.items.map(
    (item: CategoryProduct | CategoryBrand) => item.categoryShare
  );

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "#98D8C4", // Mint green
          "#A5DEF2", // Light blue
          "#F5A7C4", // Pink
          "#BAB0F5", // Light purple
          "#FFB5A6", // Light coral
        ],
        borderWidth: 0,
      },
    ],
  };
});

const chartOptions = ref<ChartOptions<"pie">>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      align: "center",
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
        label: function (context: { raw: number }) {
          const value = context.raw;
          return ` ${value.toFixed(1)}%`;
        },
      },
    },
  },
});
</script>
