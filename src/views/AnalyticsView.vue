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
          <!-- Enhanced Header with Summary -->
          <v-row class="mb-6">
            <v-col cols="12">
              <h1 class="text-h4 font-weight-bold mb-2">Retail Analytics Dashboard</h1>
              <p class="text-subtitle-1 text-grey-darken-1">
                Complete overview of product performance, customer behavior, and store
                analytics
              </p>
            </v-col>
          </v-row>

          <!-- Key Performance Indicators Row -->
          <v-row class="mb-8">
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

          <!-- Product Performance Analysis -->
          <v-row>
            <v-col cols="12" lg="8">
              <StoreCard title="TOP PERFORMING STORES" :items="data.topStores" />
              <DataSegment>
                <template #title>
                  TOP 5 PRODUCTS FAMILY NON-ALCOHOLIC BEVERAGES
                </template>
                <TopProductsPieChart />
              </DataSegment>
            </v-col>
            <v-col cols="12" lg="4">
              <ItemsList
                title="TOP PRODUCTS"
                :items="data.topItems"
                color="success"
                class="mb-6"
              />
              <DataSegment class="pb-6">
                <template #title> GEOGRAPHIC DISTRIBUTION </template>
                <div class="geo-distribution">
                  <div v-if="storeCountries.length > 1" class="country-distribution">
                    <h3 class="text-subtitle-1 mb-3">Sales by Country</h3>
                    <div
                      v-for="(country, index) in storeCountries"
                      :key="index"
                      class="country-item"
                    >
                      <div class="country-info">
                        <span class="country-name">{{ country.name }}</span>
                        <span class="country-value">{{ country.count }} stores</span>
                      </div>
                      <v-progress-linear
                        :model-value="(country.count / data.topStores.length) * 100"
                        :color="getCountryColor(index)"
                        height="6"
                        rounded
                        class="mb-2"
                      />
                    </div>
                  </div>

                  <div class="city-distribution">
                    <h3 class="text-subtitle-1 mb-3">Top Cities</h3>
                    <div class="city-grid">
                      <div
                        v-for="(city, index) in topCities.slice(0, 6)"
                        :key="index"
                        class="city-item"
                      >
                        <span class="city-name">{{ city.name }}</span>
                        <span class="city-count">{{ city.count }} stores</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DataSegment>
            </v-col>
          </v-row>
          <v-col>
            <DataSegment>
              <template #title> CLASS SHARE OVER TIME </template>
              <ClassShareChart />
            </DataSegment>
          </v-col>
        </template>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopProductsPieChart from '@/components/TopProductsPieChart.vue'
import ClassShareChart from '@/components/ClassShareChart.vue'
import ItemsList from '@/components/ItemsList.vue'
import AppBar from '@/components/AppBar.vue'
import DataSegment from '@/components/DataSegment.vue'
import MetricCard from '@/components/MetricCard.vue'
import StoreCard from '@/components/StoreCard.vue'
import { useAnalytics, type AnalyticsData } from '@/composables/useAnalytics'

const { isLoading, error, fetchAnalytics } = useAnalytics()
const data = ref<AnalyticsData | null>(null)

// Format helpers
function formatCurrency(value?: number): string {
  const num = parseFloat(value?.toString() || "0") || 0
  return `${num.toFixed(2)} €`
}

function formatItems(value?: number): string {
  const num = parseFloat(value?.toString() || "0") || 0
  return `${num.toFixed(1)} items`
}

function formatDays(value?: number): string {
  const num = parseFloat(value?.toString() || "0") || 0
  return `${num.toFixed(1)} days`
}

function formatFrequency(value?: number): string {
  const num = parseFloat(value?.toString() || "0") || 0
  return `${num.toFixed(2)} per month`
}

// Computed properties
const topProduct = computed(() => {
  if (!data.value?.topItems?.length) return null
  return data.value.topItems.reduce((max, product) =>
    product.productCount > max.productCount ? product : max,
    data.value.topItems[0]
  )
})

const productCategories = computed(() => {
  if (!data.value?.topItems?.length) return []

  // This is a mock implementation since we don't have actual categories in the data
  // In a real implementation, this would extract categories from product data
  return [
    { name: 'Beverages', count: Math.round(data.value.topItems.length * 0.3) },
    { name: 'Food Items', count: Math.round(data.value.topItems.length * 0.25) },
    { name: 'Household', count: Math.round(data.value.topItems.length * 0.2) },
    { name: 'Health & Beauty', count: Math.round(data.value.topItems.length * 0.15) },
    { name: 'Others', count: Math.round(data.value.topItems.length * 0.1) }
  ]
})

const storeCountries = computed(() => {
  if (!data.value?.topStores?.length) return []

  const countries = {}
  data.value.topStores.forEach(store => {
    const country = store.country || 'Unknown'
    if (!countries[country]) {
      countries[country] = { name: country, count: 0 }
    }
    countries[country].count++
  })

  return Object.values(countries).sort((a, b) => b.count - a.count)
})

const topCities = computed(() => {
  if (!data.value?.topStores?.length) return []

  const cities = {}
  data.value.topStores.forEach(store => {
    const city = store.city || 'Unknown'
    if (!cities[city]) {
      cities[city] = { name: city, count: 0 }
    }
    cities[city].count++
  })

  return Object.values(cities).sort((a, b) => b.count - a.count)
})

// Utility functions
function calculateSharePercentage(product) {
  if (!product || !data.value?.topItems?.length) return '0.0'

  const totalCount = data.value.topItems.reduce((sum, item) => sum + item.productCount, 0)
  return ((product.productCount / totalCount) * 100).toFixed(1)
}

function calculateConcentrationIndex() {
  if (!data.value?.topItems?.length) return '0.00'

  // This is a simplified Herfindahl-Hirschman Index (HHI) calculation
  const totalCount = data.value.topItems.reduce((sum, item) => sum + item.productCount, 0)
  const sumOfSquares = data.value.topItems.reduce((sum, item) => {
    const marketShare = item.productCount / totalCount
    return sum + (marketShare * marketShare)
  }, 0)

  return (sumOfSquares * 10000).toFixed(2)
}

function getCategoryColor(index) {
  const colors = ['primary', 'success', 'info', 'warning', 'error']
  return colors[index % colors.length]
}

function getCountryColor(index) {
  const colors = ['deep-purple', 'teal', 'blue', 'cyan', 'indigo']
  return colors[index % colors.length]
}

// Generate insights
function generateProductInsight() {
  if (!data.value?.topItems?.length) return 'No product data available.'

  const totalCount = data.value.topItems.reduce((sum, item) => sum + item.productCount, 0)
  const top3Share = data.value.topItems.slice(0, 3).reduce((sum, item) => sum + item.productCount, 0) / totalCount

  if (top3Share > 0.5) {
    return 'Sales are heavily concentrated among top products. The top 3 products account for more than 50% of all sales, indicating strong customer preference for specific items.'
  } else if (top3Share > 0.3) {
    return 'Sales distribution shows moderate concentration. The top 3 products account for 30-50% of sales, indicating a good balance between popular items and product diversity.'
  } else {
    return 'Sales are well distributed across products. No single product dominates, indicating diverse customer preferences and a balanced product portfolio.'
  }
}

function generateBasketInsight() {
  if (!data.value?.metrics) return 'No basket data available.'

  const mean = data.value.metrics.basketItemCountMean || 0
  const median = data.value.metrics.basketItemCountMedian || 0
  const ratio = mean / median

  if (ratio > 1.5) {
    return 'The significant difference between mean and median basket size indicates some customers make very large purchases, which skews the average upward. Consider targeting these high-volume shoppers with special promotions.'
  } else if (ratio < 0.8) {
    return 'The median basket size being larger than the mean suggests most customers purchase more items than the average. This indicates consistent purchasing behavior across your customer base.'
  } else {
    return 'The mean and median basket sizes are relatively close, indicating a balanced distribution of basket sizes. Most customers have similar shopping patterns.'
  }
}

function generateSpendingInsight() {
  if (!data.value?.metrics) return 'No spending data available.'

  const mean = data.value.metrics.monetaryMean || 0
  const median = data.value.metrics.monetaryMedian || 0

  if (mean > median * 1.5) {
    return 'The average order value is significantly higher than the median, indicating a small segment of high-value transactions. Focus on identifying and retaining these high-value customers while encouraging others to increase their spending.'
  } else if (mean < median) {
    return 'The median order value exceeds the average, suggesting most transactions are higher value. This indicates a strong core customer base with consistent spending habits.'
  } else {
    return 'Spending is relatively evenly distributed, with the average and median values being similar. This suggests a consistent customer base with similar spending patterns.'
  }
}

// Event handlers
async function handleTimeframeChange(timeframe: string) {
  data.value = await fetchAnalytics(timeframe)
}

// Initial data fetch
onMounted(async () => {
  data.value = await fetchAnalytics()
})
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
