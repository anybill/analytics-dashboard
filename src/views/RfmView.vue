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
          <!-- RFM Metrics Row -->
          <v-row class="mb-8 metrics-row">
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="RECENCY AGGREGATION"
                :value="formatDays(data.consumerMetrics.recencyAggregation)"
                icon="mdi-clock-outline"
                icon-color="info"
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="FREQUENCY AGGREGATION"
                :value="formatFrequency(data.consumerMetrics.frequencyAggregation)"
                icon="mdi-repeat"
                icon-color="success"
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="MONETARY AGGREGATION"
                :value="formatCurrency(data.consumerMetrics.monetaryAggregationMean)"
                icon="mdi-currency-eur"
                icon-color="warning"
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="CUSTOMER LIFETIME VALUE"
                :value="formatCurrency(data.consumerMetrics.customerLifetimeValue)"
                icon="mdi-account-cash"
                icon-color="primary"
              />
            </v-col>
          </v-row>

          <!-- Basket Item Count Cards -->
          <v-row class="mb-8">
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="BASKET ITEM COUNT MEAN"
                :value="
                  formatCurrency(data.consumerMetrics.basketItemCountAggregationMean)
                "
                icon="mdi-basket"
                icon-color="primary"
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="BASKET ITEM COUNT MEDIAN"
                :value="
                  formatCurrency(data.consumerMetrics.basketItemCountAggregationMedian)
                "
                icon="mdi-basket-outline"
                icon-color="primary"
              />
            </v-col>
          </v-row>
        </template>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBar from "@/components/AppBar.vue";
import MetricCard from "@/components/MetricCard.vue";
import { useAnalytics, type AnalyticsData } from "@/composables/useAnalytics";

const { isLoading, error, fetchAnalytics } = useAnalytics();

const data = ref<AnalyticsData | null>(null)

// Event handlers
async function handleTimeframeChange(timeframe: string) {
  data.value = await fetchAnalytics(timeframe);
}

// Initial data fetch
onMounted(async () => {
  data.value = await fetchAnalytics()
});

function formatDays(value: number): string {
  return `${value.toFixed(1)} days`;
}

function formatFrequency(value: number): string {
  return `${value.toFixed(1)} per month`;
}

function formatCurrency(value: number): string {
  return `${value.toFixed(2)} €`;
}

function formatItems(value: number): string {
  return `${value.toFixed(1)} items`;
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

.segment-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.segment-card:hover {
  transform: translateY(-4px);
}

/* Adjust container padding on smaller screens */
@media (max-width: 1440px) {
  .v-container {
    padding-inline: 24px !important;
  }
}
</style>
