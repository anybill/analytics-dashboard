<template>
  <v-card
    class="metric-card"
    elevation="2"
  >
    <v-card-text class="d-flex align-center">
      <v-icon
        :color="iconColor"
        size="32"
        class="me-4"
      >
        {{ icon }}
      </v-icon>
      <div>
        <div class="text-subtitle-2 text-medium-emphasis">
          {{ title }}
        </div>
        <div class="text-h6">
          {{ value }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string;
  icon: string;
  iconColor?: string;
}>();
</script>

<style scoped>
.metric-card {
  border-radius: 10px;
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.metric-card:hover {
  transform: translateY(-2px);
}
</style>
