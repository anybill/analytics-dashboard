// @ts-nocheck
<template>
  <div class="clv-timeline">
    <v-card
      elevation="2"
      class="chart-card"
    >
      <v-card-title class="d-flex align-center">
        <v-icon
          icon="mdi-chart-line"
          class="mr-2"
          color="primary"
        />
        Customer Lifetime Value Timeline
      </v-card-title>
      <v-card-text>
        <div style="height: 300px">
          <canvas ref="chart" />
        </div>
        <div class="mt-2 text-caption text-medium-emphasis">
          {{ getClvGrowthInsight() }}
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Chart from 'chart.js/auto';
import type { AnalyticsData } from '@/composables/useAnalytics';

const props = defineProps({
  data: {
    type: Object as () => AnalyticsData | null,
    default: null
  }
});

const chart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

onMounted(() => {
  if (chart.value) {
    createChart();
  }
});

watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  createChart();
}, { deep: true });

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

function createChart() {
  if (!chart.value) return;
  
  const ctx = chart.value.getContext('2d');
  if (!ctx) return;
  
  const clv = props.data?.consumerMetrics.customerLifetimeValue || 1000;
  const avg = props.data?.consumerMetrics.monetaryAggregationMean || 100;
  const freq = props.data?.consumerMetrics.frequencyAggregation || 2;
  
  // Generate timeline data based on the relationship between CLV, avg purchase, and frequency
  const timeMonths = 36; // 3 years
  const avgPurchasesPerMonth = freq / 12;
  const monthlySpend = avg * avgPurchasesPerMonth;
  
  const labels = Array.from({ length: timeMonths }, (_, i) => `Month ${i+1}`);
  const cumulativeData = Array.from({ length: timeMonths }, (_, i) => {
    // Initial smaller value, growing over time with some variability
    return Math.round((monthlySpend * (i+1) * (1 + Math.sin(i/8) * 0.2)) * 100) / 100;
  });
  
  // Scale to match actual CLV
  const scaleFactor = clv / cumulativeData[timeMonths - 1];
  const scaledData = cumulativeData.map(val => Math.round(val * scaleFactor * 100) / 100);
  
  // Create different segments for different customer types
  const vipData = scaledData.map(val => val * 1.6);
  const regularData = scaledData;
  const atRiskData = scaledData.map((val, i) => {
    const dropRate = Math.max(0, 1 - (i / (timeMonths * 0.7)));
    return val * dropRate * 0.7;
  });
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'VIP Customers',
          data: vipData,
          borderColor: 'rgba(255, 193, 7, 0.8)',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Regular Customers',
          data: regularData,
          borderColor: 'rgba(33, 150, 243, 0.8)',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'At-Risk Customers',
          data: atRiskData,
          borderColor: 'rgba(244, 67, 54, 0.8)',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          fill: true,
          tension: 0.4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} €`;
            }
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 15
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxTicksLimit: 6
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          },
          ticks: {
            callback: function(value) {
              return value + ' €';
            }
          }
        }
      }
    }
  });
}

function getClvGrowthInsight() {
  if (!props.data) return "Visualizing customer revenue growth over 36 months";
  
  const clv = props.data.consumerMetrics.customerLifetimeValue;
  const avg = props.data.consumerMetrics.monetaryAggregationMean;
  const ratio = clv / avg;
  
  if (ratio > 12) {
    return "Strong customer retention leading to high lifetime value - focus on maintaining loyalty";
  } else if (ratio > 8) {
    return "Good CLV growth - consider implementing more frequent purchase incentives";
  } else {
    return "Opportunity to increase CLV through enhanced customer engagement and retention strategies";
  }
}
</script>

<style scoped>
.chart-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.chart-card:hover {
  transform: translateY(-4px);
}
</style> 