<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";

const { user, logout } = useAuth();

const handleLogout = async () => {
  if (confirm("Are you sure you want to logout?")) {
    await logout();
  }
};
</script>

<template>
  <v-app-bar elevation="2">
    <template #prepend>
      <v-avatar color="primary" class="ml-4">
        <v-icon color="white">mdi-tooth</v-icon>
      </v-avatar>
    </template>

    <v-app-bar-title class="font-weight-bold">
      DentalCare Manager
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-menu>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          prepend-icon="mdi-account-circle"
          variant="text"
          class="mr-4"
        >
          {{ user?.full_name || 'User' }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>{{ user?.full_name }}</v-list-item-title>
          <v-list-item-subtitle>{{ user?.email }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-chip :color="user?.role === 'doctor' ? 'success' : 'info'" size="small">
            {{ user?.role }}
          </v-chip>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="handleLogout">
          <template #prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>