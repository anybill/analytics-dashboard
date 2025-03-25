<template>
  <div class="app-bar pa-4">
    <div
      class="d-flex align-end flex-grow-1 gap-8 px-8"
      style="max-width: 1440px; margin: 0 auto"
    >
      <div class="input-group">
        <div class="text-caption text-grey-darken-1 mb-1">
          Zeitraum
        </div>
        <v-text-field
          v-model="selectedTimeframe"
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-calendar"
          bg-color="white"
          @click="showDatePicker = true"
        />

        <v-dialog
          v-model="showDatePicker"
          max-width="300"
        >
          <v-date-picker
            v-model="dateRange"
            range
            :max="new Date().toISOString().split('T')[0]"
            @update:model-value="handleDateChange"
          />
        </v-dialog>
      </div>

      <!-- Category Selector - Only visible on CategoryView -->
      <div
        v-if="isCategoryView"
        class="input-group ms-8"
      >
        <div class="text-caption text-grey-darken-1 mb-1">
          Kategorie
        </div>
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

      <v-btn
        color="black"
        variant="flat"
        class="compare-btn ms-8"
      >
        <v-icon
          size="18"
          class="mr-2"
        >
          mdi-compare
        </v-icon>
        Vergleichen
      </v-btn>

      <v-spacer />

      <v-btn
        icon
        variant="text"
        class="notification-btn"
      >
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { useRoute } from "vue-router";
import { useAnalytics } from "@/composables/useAnalytics";
import type { CategoryProduct, AnalyticsData } from "@/types/analytics";

const emit = defineEmits<{
  (e: "timeframe-change", timeframe: string): void;
  (e: "category-change", category: string): void;
}>();

const route = useRoute();
const analytics = useAnalytics();
const analyticsData = ref<AnalyticsData | null>(null);

const showDatePicker = ref(false);
const dateRange = ref<string[]>(["2024-01-05", "2025-01-05"]);
const selectedCategory = ref<string | null>(null);

const isCategoryView = computed(() => route.path === "/category");

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

const selectedTimeframe = computed(() => {
  if (dateRange.value.length === 2) {
    const [start, end] = dateRange.value;
    return `${format(new Date(start), "dd.MM.yyyy")} - ${format(
      new Date(end),
      "dd.MM.yyyy"
    )}`;
  }
  return "";
});

function handleDateChange(dates: string[]) {
  if (dates.length === 2) {
    showDatePicker.value = false;
    emit("timeframe-change", dates.join(","));
  }
}

function handleCategoryChange(category: string) {
  selectedCategory.value = category;
  emit("category-change", category);
}

// Set initial category if available
watch(
  () => analyticsData.value?.topProductsByCategory,
  (newValue: CategoryProduct[] | undefined) => {
    if (newValue && newValue.length > 0 && !selectedCategory.value) {
      selectedCategory.value = newValue[0].category;
      emit("category-change", selectedCategory.value);
    }
  },
  { immediate: true }
);

// Fetch initial data
onMounted(async () => {
  analyticsData.value = await analytics.fetchAnalytics();
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
</style>
