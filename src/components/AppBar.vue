<template>
  <div class="app-bar pa-4">
    <div
      class="d-flex align-end flex-grow-1 gap-8 px-8"
      style="max-width: 1440px; margin: 0 auto"
    >
      <div class="input-group">
        <div class="text-caption text-grey-darken-1 mb-1">Timeframe</div>
        <v-text-field
          v-model="selectedTimeframe"
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-calendar"
          bg-color="white"
          @click="showDatePicker = true"
        />

        <v-dialog v-model="showDatePicker" max-width="300">
          <v-date-picker
            v-model="dateRange"
            range
            :max="new Date().toISOString().split('T')[0]"
            @update:model-value="handleDateChange"
          />
        </v-dialog>
      </div>

      <v-btn color="black" variant="flat" class="compare-btn ms-8">
        <v-icon size="18" class="mr-2"> mdi-compare </v-icon>
        Compare
      </v-btn>

      <v-spacer />

      <v-btn icon variant="text" class="notification-btn">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";

const emit = defineEmits<{
  (e: "timeframe-change", timeframe: string): void;
}>();

const showDatePicker = ref(false);
const dateRange = ref<string[]>(["2024-01-05", "2025-01-05"]);

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
