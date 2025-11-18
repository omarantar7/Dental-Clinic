<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { tr } from "vuetify/locale";
import { useTheme } from "vuetify";

const router = useRouter();
const route = useRoute();
const { user, logout } = useAuth();
const theme = useTheme();
const isDark = ref(false);

const drawer = ref(true);
const rail = ref(false);

const navigationItems = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    to: "/",
    value: "dashboard",
  },
  {
    title: "Labs",
    icon: "mdi-flask",
    to: "/labs",
    value: "labs",
  },
];

const isActive = (path: string) => {
  return route.path === path;
};

const handleLogout = async () => {
  if (confirm("Are you sure you want to logout?")) {
    await logout();
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

const toggleRail = () => {
  rail.value = !rail.value;
};

const isMobile = computed(() => {
  rail.value = true;
  return window.innerWidth < 960;
});

watch(isDark, (val) => {
  const newTheme = val ? "dark" : "light";
  theme.global.name.value = newTheme;
  localStorage.setItem("currentTheme", newTheme);
});

onMounted(() => {
  const savedTheme = localStorage.getItem("currentTheme");
  isDark.value = savedTheme === "dark";
  theme.global.name.value = isDark.value ? "dark" : "light";
});
</script>

<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      app
      :style="{ width: rail ? '72px' : '256px' }"
      class="elevation-2"
    >
      <!-- Logo Section -->
      <v-list-item class="pa-4">
        <template v-if="!rail">
          <v-list-item-title class="text-h6 font-weight-bold text-primary">
            <v-icon color="primary" class="mr-2">mdi-tooth</v-icon>
            DentalCare
          </v-list-item-title>
        </template>
        <template v-else>
          <v-icon color="primary" size="32">mdi-tooth</v-icon>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Navigation Items -->
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in navigationItems"
          :key="item.value"
          :to="item.to"
          :active="isActive(item.to)"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          class="ma-2"
        >
        </v-list-item>
      </v-list>

      <!-- Spacer -->
      <template v-slot:append>
        <v-divider></v-divider>

        <!-- User Info -->
        <v-list density="compact" nav>
          <v-list-item v-if="!rail" class="ma-2" rounded="lg">
            <template #prepend>
              <v-avatar color="primary" size="32">
                <span class="text-caption text-white">
                  {{ user?.full_name?.charAt(0) || "U" }}
                </span>
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">
              {{ user?.full_name || "User" }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ user?.role || "Role" }}
            </v-list-item-subtitle>
          </v-list-item>
          <!-- Logout Button -->
          <v-list-item
            :prepend-icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            title="Theme"
            @click="toggleTheme"
            class="ma-2"
            rounded="lg"
          >
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            @click="handleLogout"
            class="ma-2"
            rounded="lg"
          >
          </v-list-item>
          <v-list-item
            :prepend-icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            title="Collapse"
            @click="toggleRail"
            class="ma-2"
            rounded="lg"
          >
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- App Bar (Mobile Only) -->
    <v-app-bar v-if="isMobile" elevation="2" color="white">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold text-primary">
        <v-icon color="primary">mdi-tooth</v-icon>
        DentalCare Manager
      </v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <slot></slot>
    </v-main>
  </v-app>
</template>

<style scoped>
:deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}

:deep(.v-list-item--active) {
  background-color: rgba(0, 172, 193, 0.1);
  color: #00acc1;
}

:deep(.v-list-item--active .v-icon) {
  color: #00acc1;
}
</style>
