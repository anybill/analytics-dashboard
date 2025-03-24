// @ts-nocheck
<template>
  <div class="rf-quadrant">
    <v-card
      elevation="2"
      class="chart-card"
    >
      <v-card-title class="d-flex align-center">
        <v-icon
          icon="mdi-scatter-plot"
          class="mr-2"
          color="info"
        />
        Recency-Frequency Quadrant
      </v-card-title>
      <v-card-text>
        <div style="height: 300px">
          <canvas ref="chart" />
        </div>
        <div class="mt-2 text-caption text-medium-emphasis">
          {{ getQuadrantInsight() }}
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
  
  const recency = props.data?.consumerMetrics.recencyAggregation || 30;
  const frequency = props.data?.consumerMetrics.frequencyAggregation || 2;
  const monetary = props.data?.consumerMetrics.monetaryAggregationMean || 100;
  
  // Generate segmented customer data based on actual metrics
  const customerSegments = generateCustomerSegments(recency, frequency, monetary);
  
  // Create a scatter plot with customer segments
  chartInstance = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'VIP Customers',
          data: customerSegments.vip,
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1,
          pointRadius: point => 5 + (point.raw.m / 50),
          pointHoverRadius: point => 7 + (point.raw.m / 50)
        },
        {
          label: 'Regular Customers',
          data: customerSegments.regular,
          backgroundColor: 'rgba(33, 150, 243, 0.7)',
          borderColor: 'rgba(33, 150, 243, 1)',
          borderWidth: 1,
          pointRadius: point => 5 + (point.raw.m / 50),
          pointHoverRadius: point => 7 + (point.raw.m / 50)
        },
        {
          label: 'At Risk Customers',
          data: customerSegments.atRisk,
          backgroundColor: 'rgba(244, 67, 54, 0.7)',
          borderColor: 'rgba(244, 67, 54, 1)',
          borderWidth: 1,
          pointRadius: point => 5 + (point.raw.m / 50),
          pointHoverRadius: point => 7 + (point.raw.m / 50)
        },
        {
          label: 'New Customers',
          data: customerSegments.new,
          backgroundColor: 'rgba(255, 193, 7, 0.7)',
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 1,
          pointRadius: point => 5 + (point.raw.m / 50),
          pointHoverRadius: point => 7 + (point.raw.m / 50)
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw as { x: number, y: number, m: number };
              return [
                `Recency: ${point.x} days`,
                `Frequency: ${point.y} purchases/month`,
                `Monetary: ${point.m.toFixed(2)} €`
              ];
            }
          }
        },
        legend: {
          position: 'bottom'
        },
        annotation: {
          annotations: {
            xLine: {
              type: 'line',
              xMin: recency,
              xMax: recency,
              borderColor: 'rgba(0, 0, 0, 0.2)',
              borderWidth: 1,
              borderDash: [5, 5]
            },
            yLine: {
              type: 'line',
              yMin: frequency,
              yMax: frequency,
              borderColor: 'rgba(0, 0, 0, 0.2)',
              borderWidth: 1,
              borderDash: [5, 5]
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Days Since Last Purchase (Recency)'
          },
          reverse: true,  // Lower recency (more recent) to the right
          min: 0,
          suggestedMax: recency * 2
        },
        y: {
          title: {
            display: true,
            text: 'Purchases Per Month (Frequency)'
          },
          min: 0,
          suggestedMax: frequency * 2
        }
      }
    }
  });
}

function generateCustomerSegments(recency: number, frequency: number, monetary: number) {
  // Simulate customer clusters based on the average metrics
  const vip = [];
  const regular = [];
  const atRisk = [];
  const new_customers = [];
  
  // Number of simulated customers per segment
  const numCustomers = 15;
  
  // Create VIP customers (high frequency, low recency, high monetary)
  for (let i = 0; i < numCustomers; i++) {
    const variability = 0.3; // Add some natural variability
    const rand = () => 1 + (Math.random() * variability * 2 - variability);
    
    vip.push({
      x: Math.max(1, recency * 0.5 * rand()),  // Recent purchases
      y: frequency * 1.5 * rand(),  // High frequency
      m: monetary * 1.3 * rand()  // High value
    });
  }
  
  // Create regular customers (medium frequency, medium recency)
  for (let i = 0; i < numCustomers; i++) {
    const variability = 0.3;
    const rand = () => 1 + (Math.random() * variability * 2 - variability);
    
    regular.push({
      x: recency * rand(),
      y: frequency * rand(),
      m: monetary * rand()
    });
  }
  
  // Create at-risk customers (low frequency, high recency)
  for (let i = 0; i < numCustomers; i++) {
    const variability = 0.3;
    const rand = () => 1 + (Math.random() * variability * 2 - variability);
    
    atRisk.push({
      x: recency * 1.5 * rand(),  // Less recent purchases
      y: frequency * 0.5 * rand(),  // Low frequency
      m: monetary * 0.8 * rand()  // Lower value
    });
  }
  
  // Create new customers (very low recency, low frequency)
  for (let i = 0; i < numCustomers; i++) {
    const variability = 0.3;
    const rand = () => 1 + (Math.random() * variability * 2 - variability);
    
    new_customers.push({
      x: recency * 0.3 * rand(),  // Very recent first purchase
      y: frequency * 0.7 * rand(),  // Low frequency (new)
      m: monetary * 0.9 * rand()  // Average value
    });
  }
  
  return {
    vip,
    regular,
    atRisk,
    new: new_customers
  };
}

function getQuadrantInsight() {
  if (!props.data) return "Visualizing customer distribution based on purchase recency and frequency";
  
  const recency = props.data.consumerMetrics.recencyAggregation;
  const frequency = props.data.consumerMetrics.frequencyAggregation;
  
  if (recency < 30 && frequency > 1.5) {
    return "Strong concentration of engaged customers - focus on maintaining this relationship";
  } else if (recency > 60 && frequency < 1) {
    return "Significant number of at-risk customers - reactivation campaigns recommended";
  } else {
    return "Balanced customer distribution - opportunity to move more customers into the high-value quadrant";
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