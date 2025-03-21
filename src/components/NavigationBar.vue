<template>
  <v-navigation-drawer permanent elevation="2" width="80" class="navigation-drawer">
    <div class="d-flex flex-column align-center py-7">
      <div class="cube-icon mb-8">
        <img src="/logo.svg" alt="Logo" width="36" height="36" />
      </div>

      <v-list class="navigation-list">
        <v-list-item
          v-for="(item, i) in navigationItems"
          :key="i"
          :to="item.path"
          :value="item.value"
          :active="currentRoute === item.path"
          class="mb-2"
        >
          <v-icon :icon="item.icon" size="24" />
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const currentRoute = computed(() => route.path);

const navigationItems = [
  {
    icon: "mdi-view-dashboard-outline",
    value: "dashboard",
    path: "/",
  },
  {
    icon: "mdi-account-group-outline",
    value: "rfm",
    path: "/rfm",
  },
  {
    icon: "mdi-clock-outline",
    value: "history",
    path: "/history",
  },
  {
    icon: "mdi-account-outline",
    value: "profile",
    path: "/profile",
  },
];
</script>

<style scoped>
.navigation-drawer {
  background: white !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 10px;
  margin: 10px;
  max-height: 70%;
}

.navigation-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.cube-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

:deep(.v-list-item) {
  min-height: 44px !important;
  padding-inline: 0;
}

:deep(.v-list-item--active) {
  background: #f5f5f5;
}

:deep(.v-list-item--active .v-icon) {
  color: #1867c0;
}

:deep(.v-list-item__prepend) {
  padding-inline-start: 0;
  justify-content: center;
}
</style>
