<template>
  <DataSegment>
    <template #title>
      {{ title }}
    </template>
    <v-row>
      <Map :stores="items" style="max-width: 50%" />
      <v-list class="pa-0" max-width="400">
        <v-list-item v-for="(item, index) in items" :key="index" class="px-0">
          <template #prepend>
            <v-icon icon="mdi-store" size="50" />
          </template>
          <v-list-item-subtitle>
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-subtitle-2 font-weight-medium text-grey-darken-1">
                {{ index + 1 }}. {{ item.storeName }}
              </div>
            </div>
            <v-progress-linear
              :model-value="(item.storeVisits / totalCount) * 100"
              :color="color"
              height="6"
              rounded
              class="mb-1"
            />
            <div class="text-caption text-grey-darken-1 text-right">
              {{ item.storeVisits.toLocaleString() }} visits
            </div>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-row>
  </DataSegment>
</template>

<script setup lang="ts">
import type { Store } from "@/composables/useAnalytics";
import "leaflet/dist/leaflet.css";
import DataSegment from "./DataSegment.vue";

interface Props {
  title: string;
  items: Store[];
  color?: string;
}

const totalCount = computed(() => {
  if (!props.items.length) return 0;
  return props.items.reduce((sum: number, item: Store) => sum + item.storeVisits, 0);
});

const props = withDefaults(defineProps<Props>(), {
  color: "warning",
});
</script>

<style scoped>
.v-list-item {
  min-height: unset !important;
}

.v-list-item:last-child {
  margin-bottom: 0 !important;
}
</style>
