<!-- src/App.vue -->
<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
// App.vue is the root component
// It wraps everything in v-app (required by Vuetify)
// router-view renders the current route component (LoginView, DashboardView, or NotFound)
</script>

<style>
/* Global styles */
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

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar for webkit browsers */
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

/* Vuetify overrides for consistent spacing */
.v-application {
  font-family: "Roboto", sans-serif !important;
}

/* Loading transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
