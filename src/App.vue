<template>
  <v-app theme="light">
    <NavigationBar />

    <!-- Main Content -->
    <v-main class="main-content">
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
            <!-- Metrics Row -->
            <v-row class="mb-8">
              <v-col cols="12" sm="6" lg="3">
                <MetricCard
                  title="MONETARY MEAN"
                  :value="formatCurrency(data?.metrics?.monetaryMean)"
                  icon="mdi-cart-outline"
                  icon-color="green"
                />
              </v-col>
              <v-col cols="12" sm="6" lg="3">
                <MetricCard
                  title="MONETARY MEDIAN"
                  :value="formatCurrency(data?.metrics?.monetaryMedian)"
                  icon="mdi-cart-outline"
                  icon-color="blue"
                />
              </v-col>
              <v-col cols="12" sm="6" lg="3">
                <MetricCard
                  title="BASKET ITEM COUNT MEAN"
                  :value="formatItems(data?.metrics?.basketItemCountMean)"
                  icon="mdi-arrow-expand"
                  icon-color="cyan"
                />
              </v-col>
              <v-col cols="12" sm="6" lg="3">
                <MetricCard
                  title="BASKET ITEM COUNT MEDIAN"
                  :value="formatItems(data?.metrics?.basketItemCountMedian)"
                  icon="mdi-arrow-expand"
                  icon-color="cyan"
                />
              </v-col>
            </v-row>

            <!-- Charts and Lists Row -->
            <v-row>
              <v-col cols="12" lg="8">
                <DataSegment>
                  <template #title>
                    TOP 5 PRODUCTS FAMILY NON-ALCOHOLIC BEVERAGES
                  </template>
                  <TopProductsPieChart />
                </DataSegment>
                <DataSegment>
                  <template #title> CLASS SHARE OVER TIME </template>
                  <ClassShareChart />
                </DataSegment>
              </v-col>
              <v-col cols="12" lg="4" class="d-flex flex-column">
                <ItemsList
                  title="TOP ITEMS:"
                  :items="data.topItems"
                  color="warning"
                  class="mb-6"
                />
                <!-- <ItemsList title="FLOP ITEMS:" :items="data.flopItems" color="error" /> -->
              </v-col>
            </v-row>
          </template>
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import TopProductsPieChart from '@/components/TopProductsPieChart.vue'
import ClassShareChart from '@/components/ClassShareChart.vue'
import ItemsList from '@/components/ItemsList.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import AppBar from '@/components/AppBar.vue'
import DataSegment from '@/components/DataSegment.vue'
import MetricCard from '@/components/MetricCard.vue'
import { useAnalytics, type AnalyticsData } from '@/composables/useAnalytics'

const { isLoading, error, fetchAnalytics } = useAnalytics()

const data = ref<AnalyticsData | null>(null);

// Format helpers
function formatCurrency(value?: number): string {
  return `${value?.toFixed(2) ?? "0"} €`
}

function formatItems(value?: number): string {
  return `${value?.toFixed(1) ?? "0"} items`
}

// Event handlers
async function handleTimeframeChange(timeframe: string) {
  data.value = await fetchAnalytics(timeframe)
}

// Initial data fetch
onMounted(async () => {
  data.value = await fetchAnalytics();
});
</script>

<style>
.main-content {
  min-height: 100vh;
  background-color: #f8fafc;
}

.content-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.v-text-field {
  font-size: 14px;
}

/* Adjust container padding on smaller screens */
@media (max-width: 1440px) {
  .v-container {
    padding-inline: 24px !important;
  }
}
</style>
