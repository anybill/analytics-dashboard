<template>
  <DataSegment>
    <template #title>
      {{ title }}
    </template>
    <v-list class="pa-0" max-width="400">
      <v-list-item v-for="(item, index) in items" :key="index" class="px-0">
        <v-list-item-subtitle>
          <div class="d-flex justify-space-between align-center mb-2">
            <div class="text-subtitle-2 font-weight-medium text-grey-darken-1">
              {{ item.mappedProduct }}
            </div>
          </div>
          <v-progress-linear
            :model-value="(item.productCount / maxCount) * 100"
            :color="color"
            height="6"
            rounded
            class="mb-1"
          />
          <div class="text-caption text-grey-darken-1 text-right">
            {{ item.productCount.toLocaleString() }} purchases
          </div>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </DataSegment>
</template>

<script setup lang="ts">
import type { Product } from "@/composables/useAnalytics";
import DataSegment from "./DataSegment.vue";

interface Props {
  title: string;
  items: Product[];
  color?: string;
}

const maxCount = computed(() => {
  if (!props.items.length) return 0;
  return Math.max(...props.items.map((item: Product) => item.productCount));
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
