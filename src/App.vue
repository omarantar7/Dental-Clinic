<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import AppLayout from "@/components/AppLayout.vue";

const route = useRoute();
const { isAuthenticated } = useAuth();

const noLayoutPages = computed(() => {
  return route.meta.requiresAuth === false || route.name === "NotFound";
});
</script>

<template>
  <v-app>
    <AppLayout v-if="isAuthenticated && !noLayoutPages">
      <router-view />
    </AppLayout>

    <router-view v-else />
  </v-app>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  height: 100%;
  overflow-x: hidden;
}
html {
  scroll-behavior: smooth;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #00acc1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #0288d1;
}
.v-application {
  font-family: "Roboto", sans-serif !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
