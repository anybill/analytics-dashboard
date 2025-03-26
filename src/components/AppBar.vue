<template>
  <div class="app-bar pa-4">
    <div
      class="d-flex align-end flex-grow-1 gap-8 px-8"
      style="max-width: 1440px; margin: 0 auto"
    >
      <!-- Month Selector -->
      <div class="input-group">
        <div class="text-caption text-grey-darken-1 mb-1">Monat</div>
        <v-select
          v-model="selectedMonth"
          :items="availableMonths"
          variant="outlined"
          density="compact"
          hide-details
          bg-color="white"
          item-title="label"
          item-value="value"
          @update:model-value="handleMonthChange"
        />
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
import type { CategoryProduct, AnalyticsData, Product } from "@/types/analytics";

const emit = defineEmits<{
  (e: "month-change", month: { year: number; month: number }): void;
  (e: "category-change", category: string): void;
}>();

const route = useRoute();
const analytics = useAnalytics();
const analyticsData = ref<AnalyticsData | null>(null);

const selectedMonth = ref<{ year: number; month: number } | null>(null);
const selectedCategory = ref<string | null>(null);

const isCategoryView = computed(() => route.path === "/category");

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
  emit("month-change", selectedMonthObj);
}

function handleCategoryChange(category: string) {
  selectedCategory.value = category;
  emit("category-change", category);
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
      emit("month-change", selectedMonth.value);
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
