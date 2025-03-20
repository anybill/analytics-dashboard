<template>
  <v-card class="mb-6" flat>
    <div class="d-flex align-center px-6">
      <div class="text-subtitle-1 font-weight-bold mt-5">
        <slot name="title" />
      </div>
      <v-spacer v-if="$slots.actions" />
      <slot name="actions" />
    </div>
    <v-card-text class="px-6">
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Component is purely presentational, no props needed
</script>

<style scoped>
.v-card {
  background: white !important;
  border-radius: 12px;
}
</style>
