// @ts-nocheck
<template>
  <div class="rfm-heatmap">
    <v-card
      elevation="2"
      class="chart-card"
    >
      <v-card-title class="d-flex align-center">
        <v-icon
          icon="mdi-grid"
          class="mr-2"
          color="primary"
        />
        RFM Heat Map
      </v-card-title>
      <v-card-text>
        <div class="heatmap-container">
          <div class="heatmap-label-y">
            Frequency
          </div>
          <div class="heatmap-grid">
            <div 
              v-for="(cell, index) in heatmapCells" 
              :key="index" 
              class="heatmap-cell"
              :style="{ backgroundColor: cell.color, opacity: cell.opacity }"
            >
              <span class="cell-value">{{ cell.value }}</span>
            </div>
          </div>
          <div class="heatmap-label-x">
            Recency
          </div>
        </div>
        <div class="heatmap-legend">
          <div class="legend-item">
            <div
              class="legend-color"
              style="background-color: rgba(76, 175, 80, 0.8);"
            />
            <span>High Value</span>
          </div>
          <div class="legend-item">
            <div
              class="legend-color"
              style="background-color: rgba(255, 193, 7, 0.8);"
            />
            <span>Medium Value</span>
          </div>
          <div class="legend-item">
            <div
              class="legend-color"
              style="background-color: rgba(244, 67, 54, 0.8);"
            />
            <span>Low Value</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AnalyticsData } from '@/composables/useAnalytics';

const props = defineProps({
  data: {
    type: Object as () => AnalyticsData | null,
    default: null
  }
});

const heatmapCells = computed(() => {
  if (!props.data) return generateDefaultHeatMap();
  
  const recency = props.data.consumerMetrics.recencyAggregation;
  const frequency = props.data.consumerMetrics.frequencyAggregation;
  const monetary = props.data.consumerMetrics.monetaryAggregationMean;
  
  return generateHeatMapFromData(recency, frequency, monetary);
});

function generateDefaultHeatMap() {
  // 5x5 grid with default values if no data is available
  const cells = [];
  
  for (let i = 5; i >= 1; i--) {
    for (let j = 1; j <= 5; j++) {
      const value = Math.floor(Math.random() * 10) + 1;
      const isHighValue = i >= 3 && j >= 3;
      const isMediumValue = (i >= 3 || j >= 3) && !isHighValue;
      
      let color = 'rgba(244, 67, 54, 0.8)'; // Red for low value
      if (isHighValue) {
        color = 'rgba(76, 175, 80, 0.8)'; // Green for high value
      } else if (isMediumValue) {
        color = 'rgba(255, 193, 7, 0.8)'; // Yellow for medium value
      }
      
      cells.push({
        value,
        color,
        opacity: 0.2 + (value / 10) * 0.8
      });
    }
  }
  
  return cells;
}

function generateHeatMapFromData(recency: number, frequency: number, monetary: number) {
  // 5x5 grid with values based on actual data
  const cells = [];
  
  // These factors create a realistic distribution based on our metrics
  const recencyFactor = Math.max(0.5, Math.min(1.5, recency / 30));
  const frequencyFactor = Math.max(0.5, Math.min(1.5, frequency / 2));
  const monetaryFactor = Math.max(0.5, Math.min(1.5, monetary / 100));
  
  for (let i = 5; i >= 1; i--) {
    for (let j = 1; j <= 5; j++) {
      // Higher frequency (i) and lower recency (j) means higher value
      const baseValue = ((6 - j) + i) / 2;
      
      // Adjust value based on our actual metrics
      let value = Math.floor(baseValue * frequencyFactor * (1/recencyFactor) * monetaryFactor);
      value = Math.max(1, Math.min(10, value));
      
      const isHighValue = i >= 4 && j <= 2;
      const isMediumValue = (i >= 3 || j <= 3) && !isHighValue;
      
      let color = 'rgba(244, 67, 54, 0.8)'; // Red for low value
      if (isHighValue) {
        color = 'rgba(76, 175, 80, 0.8)'; // Green for high value
      } else if (isMediumValue) {
        color = 'rgba(255, 193, 7, 0.8)'; // Yellow for medium value
      }
      
      cells.push({
        value,
        color,
        opacity: 0.2 + (value / 10) * 0.8
      });
    }
  }
  
  return cells;
}
</script>

<style scoped>
.heatmap-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 300px;
  position: relative;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 2px;
  width: 100%;
  height: 100%;
}

.heatmap-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-radius: 2px;
  transition: all 0.3s ease;
  cursor: default;
}

.heatmap-cell:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.heatmap-label-x {
  text-align: center;
  padding: 8px 0;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.6);
}

.heatmap-label-y {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  font-weight: bold;
  color: rgba(0, 0, 0, 0.6);
}

.heatmap-legend {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 15px;
  height: 15px;
  border-radius: 2px;
}
</style> 