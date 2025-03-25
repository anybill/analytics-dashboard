<template>
  <v-app theme="light">
    <NavigationBar class="navigation-overlay" />
    <v-main class="main-content">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
</script>

<style scoped>
.navigation-overlay {
  position: relative;
  z-index: 1000; /* Ensure it's above other content */
}

.main-content {
  --v-layout-left: 0px !important; /* Adjust based on your navigation bar height */
}
:root {
  --v-border-opacity: 0.12;
}
</style>
