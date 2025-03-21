<template>
  <v-app theme="light">
    <NavigationBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
</script>

<style>
:root {
  --v-border-opacity: 0.12;
}
</style>
