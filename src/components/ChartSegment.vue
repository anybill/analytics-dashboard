<template>
  <v-card class="chart-segment pa-6" flat>
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="text-subtitle-1 font-weight-medium">{{ title }}</div>
      <v-icon color="grey-darken-1" size="18">mdi-information-outline</v-icon>
    </div>
    <slot></slot>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.chart-segment {
  background-color: white !important;
  border-radius: 12px;
}
</style> 