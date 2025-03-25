<template>
  <div class="analytics-view">
    <AppBar @timeframe-change="handleTimeframeChange" />

    <!-- Dashboard Content -->
    <div class="content-wrapper">
      <v-container class="pa-8" style="max-width: 1440px">
        <v-row v-if="isLoading" class="mb-8">
          <v-col cols="12" class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary" />
          </v-col>
        </v-row>

        <v-row v-else-if="error" class="mb-8">
          <v-col cols="12">
            <v-alert type="error" :text="error" />
          </v-col>
        </v-row>

        <template v-else-if="data">
          <v-row>
            <v-col cols="12">
              <DataSegment>
                <template #title> KEY PERFORMANCE INDICATORS </template>
                <div class="kpi-grid">
                  <div class="kpi-card">
                    <div class="kpi-header">
                      <div class="kpi-icon blue">
                        <v-icon>mdi-cart-outline</v-icon>
                      </div>
                      <div class="kpi-change positive">+12.5%</div>
                    </div>
                    <div class="kpi-value">
                      {{ formatCurrency(data?.metrics?.monetaryMean) }}
                    </div>
                    <div class="kpi-title">Average Order Value</div>
                  </div>

                  <div class="kpi-card">
                    <div class="kpi-header">
                      <div class="kpi-icon purple">
                        <v-icon>mdi-basket</v-icon>
                      </div>
                      <div class="kpi-change positive">+8.2%</div>
                    </div>
                    <div class="kpi-value">
                      {{ formatItems(data?.metrics?.basketItemCountMean) }}
                    </div>
                    <div class="kpi-title">Average Basket Size</div>
                  </div>

                  <div class="kpi-card">
                    <div class="kpi-header">
                      <div class="kpi-icon green">
                        <v-icon>mdi-cash-multiple</v-icon>
                      </div>
                      <div class="kpi-change positive">+15.3%</div>
                    </div>
                    <div class="kpi-value">
                      {{
                        formatCurrency(data?.consumerMetrics?.customerLifetimeValue || 0)
                      }}
                    </div>
                    <div class="kpi-title">Customer Lifetime Value</div>
                  </div>

                  <div class="kpi-card">
                    <div class="kpi-header">
                      <div class="kpi-icon orange">
                        <v-icon>mdi-clock-outline</v-icon>
                      </div>
                      <div class="kpi-change negative">-5.7%</div>
                    </div>
                    <div class="kpi-value">
                      {{ formatDays(data?.consumerMetrics?.recencyAggregation || 0) }}
                    </div>
                    <div class="kpi-title">Average Recency</div>
                  </div>

                  <div class="kpi-card">
                    <div class="kpi-header">
                      <div class="kpi-icon cyan">
                        <v-icon>mdi-repeat</v-icon>
                      </div>
                      <div class="kpi-change positive">+3.2%</div>
                    </div>
                    <div class="kpi-value">
                      {{
                        formatFrequency(data?.consumerMetrics?.frequencyAggregation || 0)
                      }}
                    </div>
                    <div class="kpi-title">Purchase Frequency</div>
                  </div>
                </div>
              </DataSegment>
            </v-col>
          </v-row>

          <!-- Charts and Lists Row -->
          <v-row>
            <v-col cols="12" lg="12">
              <StoreCard title="TOP STORES:" :items="data.topStores" />
              <!-- <DataSegment>
                <template #title>
                  TOP 5 PRODUCTS FAMILY NON-ALCOHOLIC BEVERAGES
                </template>
                <TopProductsPieChart />
              </DataSegment>
              <DataSegment>
                <template #title> CLASS SHARE OVER TIME </template>
                <ClassShareChart />
              </DataSegment> -->
            </v-col>
            <v-col cols="12" lg="12">
              <v-row>
                <v-col cols="6" lg="6">
                  <ItemsList
                    title="TOP ITEMS:"
                    :items="data.topItems"
                    color="warning"
                    class="mb-6"
                  />
                </v-col>
                <v-col cols="6" lg="6">
                  <ItemsList title="FLOP ITEMS:" :items="data.flopItems" color="error" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import ItemsList from "@/components/ItemsList.vue";
import AppBar from "@/components/AppBar.vue";
import DataSegment from "@/components/DataSegment.vue";
import StoreCard from "@/components/StoreCard.vue";
import { useAnalytics } from "@/composables/useAnalytics";
import type { AnalyticsData } from "@/types/analytics";

const { isLoading, error, fetchAnalytics } = useAnalytics();
const data = ref<AnalyticsData | null>(null);

// Format helpers
function formatCurrency(value?: number): string {
  const num = parseFloat(value?.toString() || "0") || 0;
  return `${num.toFixed(2)} €`;
}

function formatItems(value?: number): string {
  const num = parseFloat(value?.toString() || "0") || 0;
  return `${num.toFixed(1)} items`;
}

function formatDays(value?: number): string {
  const num = parseFloat(value?.toString() || "0") || 0;
  return `${num.toFixed(1)} days`;
}

function formatFrequency(value?: number): string {
  const num = parseFloat(value?.toString() || "0") || 0;
  return `${num.toFixed(2)} per month`;
}

// Event handlers
async function handleTimeframeChange(timeframe: string) {
  data.value = await fetchAnalytics(timeframe);
}

// Initial data fetch
onMounted(async () => {
  data.value = await fetchAnalytics();
});
</script>

<style scoped>
.analytics-view {
  min-height: 100vh;
  background-color: #f8fafc;
}

.content-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.kpi-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.kpi-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.kpi-icon.blue {
  background-color: #3498db;
}

.kpi-icon.purple {
  background-color: #9b59b6;
}

.kpi-icon.green {
  background-color: #2ecc71;
}

.kpi-icon.orange {
  background-color: #e67e22;
}

.kpi-icon.cyan {
  background-color: #1abc9c;
}

.kpi-change {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.kpi-change.positive {
  color: #2ecc71;
  background: rgba(46, 204, 113, 0.1);
}

.kpi-change.negative {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.kpi-title {
  font-size: 0.875rem;
  color: #7f8c8d;
}

/* Product insights */
.product-insights-container {
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 1.5rem;
}

.chart-container {
  min-height: 300px;
}

.insights-data {
  display: flex;
  flex-direction: column;
}

.insight-item {
  padding: 1rem 0;
}

.insight-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.insight-metrics {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

.insight-metric {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.metric-label {
  font-size: 0.875rem;
  color: #7f8c8d;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 1rem 0;
}

.diversity-indicator {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.diversity-score,
.concentration-index {
  display: flex;
  flex-direction: column;
}

.score-value,
.index-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.score-label,
.index-label {
  font-size: 0.875rem;
  color: #7f8c8d;
}

.insight-description {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #34495e;
  line-height: 1.6;
}

/* Category breakdown */
.category-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.category-name {
  font-weight: 500;
  color: #2c3e50;
}

.category-count {
  font-size: 0.875rem;
  color: #7f8c8d;
}

/* Geographic distribution */
.geo-distribution {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.country-item {
  margin-bottom: 0.75rem;
}

.country-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.country-name {
  font-weight: 500;
  color: #2c3e50;
}

.country-value {
  font-size: 0.875rem;
  color: #7f8c8d;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.city-item {
  padding: 0.75rem;
  background-color: #f5f7fa;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}

.city-name {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.city-count {
  font-size: 0.75rem;
  color: #7f8c8d;
}

/* Basket analysis */
.basket-analysis {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.basket-metrics {
  display: flex;
  gap: 2rem;
}

.metric-column {
  flex: 1;
}

.metric-box {
  background-color: #f5f7fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.basket-insight,
.spending-insight {
  font-size: 0.875rem;
  color: #34495e;
  line-height: 1.6;
  background-color: #f5f7fa;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #3498db;
}

.basket-distribution-chart,
.spending-distribution-chart {
  min-height: 200px;
}

/* Spending patterns */
.spending-patterns {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pattern-metrics {
  display: flex;
  justify-content: space-between;
}

.pattern-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
