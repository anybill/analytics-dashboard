<template>
  <div class="app-bar pa-4">
    <div
      class="d-flex align-end flex-grow-1 gap-8 px-8"
      style="max-width: 1440px; margin: 0 auto"
    >
      <!-- Month Selector -->
      <div class="month-selector d-flex align-center">
        <v-btn
          icon
          variant="text"
          :disabled="!canGoToPreviousMonth"
          @click="selectPreviousMonth"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <div class="month-picker">
          <div class="text-caption text-grey-darken-1 mb-1">Monat</div>
          <v-menu v-model="monthMenu" :close-on-content-click="false" location="bottom">
            <template #activator="{ props }">
              <v-btn
                variant="outlined"
                v-bind="props"
                class="month-display-btn"
                :min-width="200"
              >
                {{ formatSelectedMonth }}
                <v-icon class="ms-2"> mdi-calendar </v-icon>
              </v-btn>
            </template>

            <v-card min-width="300" class="month-selection-card">
              <v-card-text>
                <div class="d-flex justify-space-between align-center mb-4">
                  <v-btn icon @click="changeYear(-1)">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <div class="text-h6">
                    {{ currentYear }}
                  </div>
                  <v-btn icon @click="changeYear(1)">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>
                <div class="month-grid">
                  <v-btn
                    v-for="(month, index) in monthsInYear"
                    :key="index"
                    variant="text"
                    :color="isMonthSelected(index) ? 'primary' : undefined"
                    :disabled="!isMonthAvailable(index)"
                    @click="selectMonth(index)"
                  >
                    {{ month }}
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </div>

        <v-btn icon variant="text" :disabled="!canGoToNextMonth" @click="selectNextMonth">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <!-- Category Selector - Only visible on CategoryView -->
      <div v-if="isCategoryView" class="input-group ms-8">
        <div class="text-caption text-grey-darken-1 mb-1">Kategorie</div>
        <v-select
          v-model="selectedCategory"
          :items="availableCategories"
          variant="outlined"
          density="compact"
          hide-details
          bg-color="white"
          @update:model-value="handleCategoryChange"
        />
      </div>

      <v-btn color="black" variant="flat" class="compare-btn ms-8">
        <v-icon size="18" class="mr-2"> mdi-compare </v-icon>
        Vergleichen
      </v-btn>

      <v-spacer />

      <v-btn icon variant="text" class="notification-btn">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAnalytics } from "@/composables/useAnalytics";
import { useAppBarStore } from "@/stores/appBarStore";
import type { CategoryProduct, AnalyticsData, Product } from "@/types/analytics";

const route = useRoute();
const analytics = useAnalytics();
const analyticsData = ref<AnalyticsData | null>(null);
const appBarStore = useAppBarStore();
const selectedMonth = ref<{ year: number; month: number } | null>(null);
const selectedCategory = ref<string | null>(null);

const isCategoryView = computed(() => route.path === "/category");

const monthMenu = ref(false);
const currentYear = ref(new Date().getFullYear());

const monthsInYear = [
  "Jan",
  "Feb",
  "März",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];

// Format the selected month for display
const formatSelectedMonth = computed(() => {
  if (!selectedMonth.value) return "Monat auswählen";
  return new Date(
    selectedMonth.value.year,
    selectedMonth.value.month - 1
  ).toLocaleString("de-DE", { month: "long", year: "numeric" });
});

// Create a sorted array of available dates for navigation
const availableDates = computed(() => {
  if (!analyticsData.value?.topItems) return [];

  return analyticsData.value.topItems
    .map((item) => ({
      year: item.year,
      month: item.month,
      timestamp: new Date(item.year, item.month - 1).getTime(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
});

// Navigation controls
const canGoToPreviousMonth = computed(() => {
  if (!selectedMonth.value || availableDates.value.length === 0) return false;
  const currentTimestamp = new Date(
    selectedMonth.value.year,
    selectedMonth.value.month - 1
  ).getTime();
  return availableDates.value[0].timestamp < currentTimestamp;
});

const canGoToNextMonth = computed(() => {
  if (!selectedMonth.value || availableDates.value.length === 0) return false;
  const currentTimestamp = new Date(
    selectedMonth.value.year,
    selectedMonth.value.month - 1
  ).getTime();
  return (
    availableDates.value[availableDates.value.length - 1].timestamp > currentTimestamp
  );
});

// Helper functions
function isMonthAvailable(monthIndex: number) {
  return availableDates.value.some(
    (date) => date.year === currentYear.value && date.month === monthIndex + 1
  );
}

function isMonthSelected(monthIndex: number) {
  return (
    selectedMonth.value?.year === currentYear.value &&
    selectedMonth.value?.month === monthIndex + 1
  );
}

// Actions
function selectMonth(monthIndex: number) {
  if (!isMonthAvailable(monthIndex)) return;

  handleMonthChange({
    year: currentYear.value,
    month: monthIndex + 1,
  });
  monthMenu.value = false;
}

function changeYear(delta: number) {
  currentYear.value += delta;
}

function selectPreviousMonth() {
  if (!selectedMonth.value || !canGoToPreviousMonth.value) return;

  const currentDate = new Date(selectedMonth.value.year, selectedMonth.value.month - 1);
  const previousDate = new Date(currentDate.getTime());
  previousDate.setMonth(previousDate.getMonth() - 1);

  handleMonthChange({
    year: previousDate.getFullYear(),
    month: previousDate.getMonth() + 1,
  });
}

function selectNextMonth() {
  if (!selectedMonth.value || !canGoToNextMonth.value) return;

  const currentDate = new Date(selectedMonth.value.year, selectedMonth.value.month - 1);
  const nextDate = new Date(currentDate.getTime());
  nextDate.setMonth(nextDate.getMonth() + 1);

  handleMonthChange({
    year: nextDate.getFullYear(),
    month: nextDate.getMonth() + 1,
  });
}

// Compute available months from analytics data
const availableMonths = computed(() => {
  if (!analyticsData.value?.topItems || analyticsData.value?.topItems.length === 0)
    return [];

  // Assuming metrics contains unique year-month combinations
  const monthSet = new Set(
    analyticsData.value?.topItems?.map(
      (item: Product) => `${item.year}-${item.month.toString().padStart(2, "0")}`
    )
  );
  return Array.from(monthSet)
    .sort((a, b) => String(b).localeCompare(String(a)))
    .map((monthStr) => {
      const [year, month] = String(monthStr).split("-").map(Number);
      return {
        label: new Date(year, month - 1).toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        value: { year, month },
      };
    });
});

const availableCategories = computed(() => {
  if (!analyticsData.value?.topProductsByCategory) return [];
  return [
    ...new Set(
      analyticsData.value.topProductsByCategory.map(
        (item: CategoryProduct) => item.category
      )
    ),
  ];
});

function handleMonthChange(selectedMonthObj: { year: number; month: number }) {
  selectedMonth.value = selectedMonthObj;
  appBarStore.setMonth(selectedMonthObj.month ?? 3);
}

function handleCategoryChange(category: string) {
  selectedCategory.value = category;
  appBarStore.setCategory(category);
}

// Set initial month and category if available
watch(
  () => analyticsData.value?.topItems,
  (items: Product[]) => {
    if (items && items.length > 0 && !selectedMonth.value) {
      // Select the most recent month
      const sorteditems = [...items].sort((a, b) => b.year - a.year || b.month - a.month);
      const latestMonth = sorteditems[0];
      selectedMonth.value = {
        year: latestMonth.year,
        month: latestMonth.month,
      };
      appBarStore.setMonth(selectedMonth.value.month ?? 3);
    }
  },
  { immediate: true }
);

// Set initial category if available
watch(
  () => analyticsData.value?.topProductsByCategory,
  (newValue: CategoryProduct[] | undefined) => {
    if (newValue && newValue.length > 0 && !selectedCategory.value) {
      selectedCategory.value = newValue[0].category;
      appBarStore.setCategory(selectedCategory.value);
    }
  },
  { immediate: true }
);

// Fetch initial data
onMounted(async () => {
  analyticsData.value = await analytics.fetchAnalytics();
  appBarStore.setMonth(selectedMonth.value?.month ?? 3);
  appBarStore.setCategory(selectedCategory.value);
});
</script>

<style scoped>
.app-bar {
  background-color: transparent;
  height: 80px;
}

.input-group {
  display: flex;
  min-width: 255px;
  flex-direction: column;
}

:deep(.v-field) {
  border-radius: 8px;
  background: white;
}

:deep(.v-field__input) {
  min-height: 36px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

:deep(.v-field__prepend-inner) {
  padding-inline-start: 12px;
}

.compare-btn {
  height: 36px;
  padding: 0 16px;
  font-weight: 500;
  letter-spacing: normal;
  text-transform: none;
  border-radius: 8px;
}

.notification-btn {
  color: #64748b;
  height: 36px;
  margin-bottom: 1px;
}

.month-selector {
  min-width: 300px;
  gap: 8px;
}

.month-picker {
  flex: 1;
}

.month-display-btn {
  width: 100%;
  justify-content: space-between;
  text-transform: none;
  letter-spacing: normal;
}

.month-selection-card {
  padding: 8px;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

:deep(.v-btn--disabled) {
  opacity: 0.3;
}
</style>
