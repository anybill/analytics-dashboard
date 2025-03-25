<template>
  <div class="analytics-view">
    <AppBar
      @timeframe-change="handleTimeframeChange"
      @category-change="handleCategoryChange"
    />

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
          <!-- Charts and Lists Row -->
          <v-row>
            <v-col cols="12" lg="12">
              <DataSegment>
                <template #title>
                  TOP 5 PRODUCTS FAMILY NON-ALCOHOLIC BEVERAGES
                </template>
                <TopProductsPieChart :items="topCategoryData" type="product" />
              </DataSegment>
            </v-col>
            <v-col cols="12" lg="12">
              <v-row>
                <v-col cols="6" lg="6">
                  <ItemsList
                    title="TOP ITEMS:"
                    :items="getTopCategoryData()"
                    color="warning"
                    class="mb-6"
                  />
                </v-col>
                <v-col cols="6" lg="6">
                  <ItemsList
                    title="FLOP ITEMS:"
                    :items="getFlopCategoryData()"
                    color="error"
                  />
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
import TopProductsPieChart from "@/components/TopProductsPieChart.vue";
import ItemsList from "@/components/ItemsList.vue";
import AppBar from "@/components/AppBar.vue";
import DataSegment from "@/components/DataSegment.vue";
import { useAnalytics } from "@/composables/useAnalytics";
import type { AnalyticsData, CategoryProduct } from "@/types/analytics";

const { isLoading, error, fetchAnalytics } = useAnalytics();
const data = ref<AnalyticsData | null>(null);

const selectedCategory = ref<string | null>(null);

// Event handlers
async function handleTimeframeChange(timeframe: string) {
  data.value = await fetchAnalytics(timeframe);
}

function handleCategoryChange(category: string) {
  selectedCategory.value = category;
}

const topCategoryData = computed(() => {
  if (!selectedCategory.value) return [];
  return (
    data.value?.topProductsByCategory?.filter(
      (item: CategoryProduct) => item.category === selectedCategory.value
    ) ?? []
  );
});

function getTopCategoryData() {
  if (!selectedCategory.value) return [];
  return (
    data.value?.topProductsByCategory?.filter(
      (item: CategoryProduct) => item.category === selectedCategory.value
    ) ?? []
  ).map((item: CategoryProduct) => ({
    mappedProduct: item.product,
    productCount: item.productCount,
  }));
}

function getFlopCategoryData() {
  if (!selectedCategory.value) return [];
  return (
    data.value?.flopProductsByCategory?.filter(
      (item: CategoryProduct) => item.category === selectedCategory.value
    ) ?? []
  ).map((item: CategoryProduct) => ({
    mappedProduct: item.product,
    productCount: item.productCount,
  }));
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

/* Category metrics */
.category-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.metric-icon.blue {
  background-color: #3498db;
}

.metric-icon.purple {
  background-color: #9b59b6;
}

.metric-icon.green {
  background-color: #2ecc71;
}

.metric-icon.orange {
  background-color: #e67e22;
}

.metric-icon.cyan {
  background-color: #1abc9c;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.metric-title {
  font-size: 0.875rem;
  color: #7f8c8d;
}

/* Category insights */
.category-insights {
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
