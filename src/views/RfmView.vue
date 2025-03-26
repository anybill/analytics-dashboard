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
          <v-row class="mb-5">
            <v-col cols="12">
              <h1 class="text-h4 font-weight-bold mb-2">RFM-Analyse</h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                Kundenerkenntnisse basierend auf Aktualität, Häufigkeit und monetärem Wert
              </p>
            </v-col>
          </v-row>

          <!-- Customer Segments -->
          <v-row class="mb-8">
            <v-col cols="12">
              <v-card elevation="2" class="chart-card">
                <v-card-title class="d-flex align-center">
                  <v-icon icon="mdi-account-group" class="mr-2" color="warning" />
                  Kundensegmente
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6" md="3">
                      <div class="text-center">
                        <v-icon icon="mdi-star" color="warning" size="32" class="mb-2" />
                        <div class="text-h6 mb-1">VIP-Kunden</div>
                        <div class="text-caption text-medium-emphasis">
                          Hoher Kunden Gesamteinkaufswert & Häufigkeit
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <div class="text-center">
                        <v-icon icon="mdi-alert" color="error" size="32" class="mb-2" />
                        <div class="text-h6 mb-1">Risikokunden</div>
                        <div class="text-caption text-medium-emphasis">
                          Lange Aktualität
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
                        <div class="text-h6 mb-1">Wachstumspotenzial</div>
                        <div class="text-caption text-medium-emphasis">
                          Hohe Häufigkeit, Niedriger Warenkorb
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
                        <div class="text-h6 mb-1">Großkäufer</div>
                        <div class="text-caption text-medium-emphasis">
                          Hoher Wert, Niedrige Häufigkeit
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- RFM Metrics Row -->
          <v-row class="mb-8 metrics-row">
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="Aktualität"
                subtitle="Durchschnittliche Tage seit dem letzten Kauf"
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
                title="Häufigkeit"
                subtitle="Durchschnittliche Besuche pro Monat"
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
                title="Monetär"
                subtitle="Durchschnittlicher Kaufwert"
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
                title="Kunden Gesamteinkaufswert"
                subtitle="Gesamtwert pro Kunde"
                :value="formatCurrency(data.consumerMetrics.customerLifetimeValue)"
                icon="mdi-account-cash"
                icon-color="primary"
                :trend="
                  getTrendIndicator(data.consumerMetrics.customerLifetimeValue, 'clv')
                "
              />
            </v-col>
          </v-row>

          <!-- Charts Row -->
          <v-row class="mb-8">
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="Durchschnittliche Warenkorbgröße"
                subtitle="Durchschnittliche Anzahl Artikel pro Einkauf"
                :value="formatItems(data.consumerMetrics.basketItemCountAggregationMean)"
                icon="mdi-basket"
                icon-color="primary"
                :trend="
                  getTrendIndicator(
                    data.consumerMetrics.basketItemCountAggregationMean,
                    'basket'
                  )
                "
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3">
              <MetricCard
                title="Median Warenkorbgröße"
                subtitle="Der mittlere Wert der Artikel pro Kauf"
                :value="
                  formatItems(data.consumerMetrics.basketItemCountAggregationMedian)
                "
                icon="mdi-basket-outline"
                icon-color="primary"
                :trend="
                  getTrendIndicator(
                    data.consumerMetrics.basketItemCountAggregationMedian,
                    'basket'
                  )
                "
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
import { useAnalytics } from "@/composables/useAnalytics";
import type { AnalyticsData } from "@/types/analytics";

const { isLoading, error, fetchAnalytics } = useAnalytics();
const data = ref<AnalyticsData | null>(null);

// Event handlers
async function handleTimeframeChange(timeframe: string) {
  data.value = await fetchAnalytics(timeframe);
}

// Initial data fetch
onMounted(async () => {
  data.value = await fetchAnalytics();
});

function formatDays(value: number): string {
  return `${value.toFixed(1)} Tage`;
}

function formatFrequency(value: number): string {
  return `${value.toFixed(1)} pro Monat`;
}

function formatCurrency(value: number): string {
  return `${value.toFixed(2)} €`;
}

function formatItems(value: number): string {
  return `${value.toFixed(1)} Artikel`;
}

function getTrendIndicator(
  value: number,
  metric: "recency" | "frequency" | "monetary" | "clv" | "basket"
): string {
  // This is a placeholder - in a real app, you'd compare with previous period
  const thresholds = {
    recency: { good: 30, bad: 90 },
    frequency: { good: 2, bad: 1 },
    monetary: { good: 100, bad: 50 },
    clv: { good: 500, bad: 200 },
    basket: { good: 3, bad: 1 },
  };

  const threshold = thresholds[metric];
  if (value >= threshold.good) return "↑";
  if (value <= threshold.bad) return "↓";
  return "→";
}
</script>

<style scoped>
.rfm-view {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 0px 7em;
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
  border-radius: 10px;
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
