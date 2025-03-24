// @ts-nocheck
<template>
  <div class="rfm-view">
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
          <!-- Page Title -->
          <v-row class="mb-8">
            <v-col cols="12">
              <h1 class="text-h4 font-weight-bold mb-2">RFM Analysis</h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                Customer behavior insights based on Recency, Frequency, and Monetary value
              </p>
            </v-col>
          </v-row>

          <!-- RFM Metrics Row -->
          <v-row class="mb-8 metrics-row">
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="Recency"
                subtitle="Average days since last purchase"
                :value="formatDays(data.consumerMetrics.recencyAggregation)"
                icon="mdi-clock-outline"
                icon-color="info"
                :trend="
                  getTrendIndicator(data.consumerMetrics.recencyAggregation, 'recency')
                "
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="Frequency"
                subtitle="Average visits per month"
                :value="formatFrequency(data.consumerMetrics.frequencyAggregation)"
                icon="mdi-repeat"
                icon-color="success"
                :trend="
                  getTrendIndicator(
                    data.consumerMetrics.frequencyAggregation,
                    'frequency'
                  )
                "
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="Monetary"
                subtitle="Average purchase value"
                :value="formatCurrency(data.consumerMetrics.monetaryAggregationMean)"
                icon="mdi-currency-eur"
                icon-color="warning"
                :trend="
                  getTrendIndicator(
                    data.consumerMetrics.monetaryAggregationMean,
                    'monetary'
                  )
                "
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="Customer Lifetime Value"
                subtitle="Total value per customer"
                :value="formatCurrency(data.consumerMetrics.customerLifetimeValue)"
                icon="mdi-account-cash"
                icon-color="primary"
                :trend="
                  getTrendIndicator(data.consumerMetrics.customerLifetimeValue, 'clv')
                "
              />
            </v-col>
          </v-row>

          <!-- Heat Map and CLV Timeline -->
          <v-row class="mb-8">
            <v-col cols="12" md="6">
              <RfmHeatMap :data="data" />
            </v-col>
            <v-col cols="12" md="6">
              <ClvTimeline :data="data" />
            </v-col>
          </v-row>

          <!-- Frequency Distribution and Basket Comparison -->
          <v-row class="mb-8">
            <v-col cols="12" md="6">
              <FrequencyDistribution :data="data" />
            </v-col>
            <v-col cols="12" md="6">
              <BasketSizeComparison :data="data" />
            </v-col>
          </v-row>

          <!-- Recency-Frequency Quadrant -->
          <v-row class="mb-8">
            <v-col cols="12">
              <RecencyFrequencyQuadrant :data="data" />
            </v-col>
          </v-row>

          <!-- Customer Segments -->
          <v-row>
            <v-col cols="12">
              <v-card class="chart-card">
                <v-card-title class="d-flex align-center">
                  <v-icon icon="mdi-account-group" class="mr-2" color="warning" />
                  Customer Segments
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6" md="3">
                      <div class="text-center">
                        <v-icon icon="mdi-star" color="warning" size="32" class="mb-2" />
                        <div class="text-h6 mb-1">VIP Customers</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ getVipCustomerDescription() }}
                        </div>
                        <div class="text-body-2 mt-2">
                          {{ getVipCustomerCount() }}% of customers
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <div class="text-center">
                        <v-icon icon="mdi-alert" color="error" size="32" class="mb-2" />
                        <div class="text-h6 mb-1">At Risk</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ getAtRiskCustomerDescription() }}
                        </div>
                        <div class="text-body-2 mt-2">
                          {{ getAtRiskCustomerCount() }}% of customers
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <div class="text-center">
                        <v-icon
                          icon="mdi-trending-up"
                          color="success"
                          size="32"
                          class="mb-2"
                        />
                        <div class="text-h6 mb-1">Growth Potential</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ getGrowthPotentialDescription() }}
                        </div>
                        <div class="text-body-2 mt-2">
                          {{ getGrowthPotentialCount() }}% of customers
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <div class="text-center">
                        <v-icon
                          icon="mdi-cash-multiple"
                          color="primary"
                          size="32"
                          class="mb-2"
                        />
                        <div class="text-h6 mb-1">Bulk Buyers</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ getBulkBuyerDescription() }}
                        </div>
                        <div class="text-body-2 mt-2">
                          {{ getBulkBuyerCount() }}% of customers
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import AppBar from "@/components/AppBar.vue";
import MetricCard from "@/components/MetricCard.vue";
import RfmHeatMap from "@/components/charts/RfmHeatMap.vue";
import ClvTimeline from "@/components/charts/ClvTimeline.vue";
import FrequencyDistribution from "@/components/charts/FrequencyDistribution.vue";
import BasketSizeComparison from "@/components/charts/BasketSizeComparison.vue";
import RecencyFrequencyQuadrant from "@/components/charts/RecencyFrequencyQuadrant.vue";
import { useAnalytics } from "@/composables/useAnalytics";
import { ref, onMounted } from "vue";

const { isLoading, error, fetchAnalytics } = useAnalytics();
const data = ref(null);

// Event handlers
async function handleTimeframeChange(timeframe) {
  data.value = await fetchAnalytics(timeframe);
}

// Initial data fetch
onMounted(async () => {
  data.value = await fetchAnalytics();
});

function formatDays(value) {
  return `${value.toFixed(1)} days`;
}

function formatFrequency(value) {
  return `${value.toFixed(1)} per month`;
}

function formatCurrency(value) {
  return `${value.toFixed(2)} €`;
}

function formatItems(value) {
  return `${value.toFixed(1)} items`;
}

function getTrendIndicator(value, metric) {
  // This is a placeholder - in a real app, you'd compare with previous period
  const thresholds = {
    recency: { good: 30, bad: 90 },
    frequency: { good: 2, bad: 1 },
    monetary: { good: 100, bad: 50 },
    clv: { good: 500, bad: 200 },
    basket: { good: 3, bad: 1 },
  };

  const threshold = thresholds[metric];
  if (metric === "recency") {
    // For recency, lower is better
    if (value <= threshold.good) return "↑";
    if (value >= threshold.bad) return "↓";
  } else {
    // For all other metrics, higher is better
    if (value >= threshold.good) return "↑";
    if (value <= threshold.bad) return "↓";
  }
  return "→";
}

function getBasketSizeInsight(mean, median) {
  const diff = mean - median;
  if (diff > 2) {
    return "Large gap between average and median suggests bulk buyers skewing the data";
  } else if (diff > 1) {
    return "Moderate variation in basket sizes across customers";
  }
  return "Consistent basket sizes across customer base";
}

function getEngagementInsight(recency, frequency) {
  if (recency > 60 && frequency < 1) {
    return "High risk of customer churn - consider re-engagement campaigns";
  } else if (recency < 30 && frequency > 2) {
    return "Strong customer engagement - focus on retention";
  }
  return "Monitor engagement patterns for optimization opportunities";
}

function getVipCustomerDescription() {
  if (!data.value) return "High CLV & Frequency";
  const clv = data.value.consumerMetrics.customerLifetimeValue;
  const freq = data.value.consumerMetrics.frequencyAggregation;
  return `CLV > ${formatCurrency(clv * 0.8)} & ${formatFrequency(freq * 1.2)} visits`;
}

function getAtRiskCustomerDescription() {
  if (!data.value) return "Long Recency";
  const recency = data.value.consumerMetrics.recencyAggregation;
  const freq = data.value.consumerMetrics.frequencyAggregation;
  return `> ${formatDays(recency * 1.5)} & < ${formatFrequency(freq * 0.5)} visits`;
}

function getGrowthPotentialDescription() {
  if (!data.value) return "High Frequency, Low Basket";
  const freq = data.value.consumerMetrics.frequencyAggregation;
  const basket = data.value.consumerMetrics.basketItemCountAggregationMean;
  return `${formatFrequency(freq * 1.2)} visits, < ${formatItems(basket * 0.8)} items`;
}

function getBulkBuyerDescription() {
  if (!data.value) return "High Value, Low Frequency";
  const clv = data.value.consumerMetrics.customerLifetimeValue;
  const freq = data.value.consumerMetrics.frequencyAggregation;
  return `CLV > ${formatCurrency(clv * 0.8)}, < ${formatFrequency(freq * 0.5)} visits`;
}

function getVipCustomerCount() {
  if (!data.value) return 0;
  const clv = data.value.consumerMetrics.customerLifetimeValue;
  const freq = data.value.consumerMetrics.frequencyAggregation;
  const recency = data.value.consumerMetrics.recencyAggregation;

  // VIP customers have high CLV, high frequency, and low recency
  if (clv > 1000 && freq > 2 && recency < 30) return 15;
  if (clv > 800 && freq > 1.5 && recency < 45) return 10;
  return 5;
}

function getAtRiskCustomerCount() {
  if (!data.value) return 0;
  const recency = data.value.consumerMetrics.recencyAggregation;
  const freq = data.value.consumerMetrics.frequencyAggregation;

  // At-risk customers have high recency and low frequency
  if (recency > 90 && freq < 1) return 20;
  if (recency > 60 && freq < 1.5) return 15;
  return 10;
}

function getGrowthPotentialCount() {
  if (!data.value) return 0;
  const freq = data.value.consumerMetrics.frequencyAggregation;
  const basket = data.value.consumerMetrics.basketItemCountAggregationMean;

  // Growth potential customers have high frequency but low basket size
  if (freq > 2 && basket < 2) return 25;
  if (freq > 1.5 && basket < 2.5) return 20;
  return 15;
}

function getBulkBuyerCount() {
  if (!data.value) return 0;
  const clv = data.value.consumerMetrics.customerLifetimeValue;
  const freq = data.value.consumerMetrics.frequencyAggregation;
  const basket = data.value.consumerMetrics.basketItemCountAggregationMean;

  // Bulk buyers have high CLV, low frequency, and high basket size
  if (clv > 800 && freq < 1.5 && basket > 3) return 15;
  if (clv > 600 && freq < 2 && basket > 2.5) return 10;
  return 5;
}
</script>

<style scoped>
.rfm-view {
  min-height: 100vh;
  background-color: #f8fafc;
}

.content-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Metrics row spacing */
.metrics-row {
  justify-content: space-between;
}

.metrics-row .v-col {
  flex: 0 0 auto;
  width: calc(25% - 24px);
}

.chart-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.chart-card:hover {
  transform: translateY(-4px);
}

/* Adjust container padding on smaller screens */
@media (max-width: 1440px) {
  .v-container {
    padding-inline: 24px !important;
  }
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .metrics-row .v-col {
    width: calc(50% - 24px);
  }
}

@media (max-width: 600px) {
  .metrics-row .v-col {
    width: 100%;
  }
}
</style>
