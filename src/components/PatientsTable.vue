<script setup lang="ts">
import { ref } from "vue";
import type { Patient } from "@/types/Patient";
import router from "@/router";

interface Props {
  patients: Patient[];
  loading?: boolean;
}

interface Emits {
  (e: "view", patient: Patient): void;
  (e: "edit", patient: Patient): void;
  (e: "delete", patientId: string): void;
  (e: "add"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const search = ref("");

const headers = [
  { title: "Patient Name", key: "name", sortable: true },
  { title: "Phone", key: "phone", sortable: false },
  { title: "Email", key: "email", sortable: false },
  { title: "Total Price", key: "finalPrice", sortable: true },
  { title: "Paid", key: "deliveredPrice", sortable: true },
  { title: "Balance", key: "remainingBalance", sortable: true },
  { title: "Actions", key: "actions", sortable: false, align: "center" },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const handleDelete = (patient: Patient) => {
  if (confirm(`Are you sure you want to delete ${patient.name}?`)) {
    emit("delete", patient.id);
  }
};

const openPatient = (id: string) => {
  router.push(`/patients/${id}`);
};
</script>

<template>
  <v-card rounded="lg" elevation="2">
    <v-card-title class="pa-6 d-flex align-center">
      <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
      <span class="text-h5 font-weight-bold">Patient Records</span>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        class="mr-4"
        @click="emit('add')"
      >
        Add Patient
      </v-btn>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search patients..."
        single-line
        hide-details
        variant="outlined"
        density="compact"
        class="search-field"
        style="max-width: 300px"
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers as any"
      :items="patients"
      :search="search"
      :items-per-page="10"
      :loading="loading"
      class="elevation-0"
    >
      <!-- Name Column -->
      <template #item.name="{ item }">
        <div class="d-flex align-center py-2">
          <v-avatar color="primary" size="40" class="mr-3">
            <span class="text-white">{{ getInitials(item.name) }}</span>
          </v-avatar>
          <span class="font-weight-medium">{{ item.name }}</span>
        </div>
      </template>

      <!-- Phone Column -->
      <template #item.phone="{ item }">
        <v-chip size="small" variant="text" prepend-icon="mdi-phone">
          {{ item.phone }}
        </v-chip>
      </template>

      <!-- Email Column -->
      <template #item.email="{ item }">
        <v-chip size="small" variant="text" prepend-icon="mdi-email">
          {{ item.email }}
        </v-chip>
      </template>

      <!-- Final Price Column -->
      <template #item.finalPrice="{ item }">
        <span class="font-weight-bold text-success">
          ${{ item.finalPrice.toLocaleString() }}
        </span>
      </template>

      <!-- Delivered Price Column -->
      <template #item.deliveredPrice="{ item }">
        <span class="font-weight-medium">
          ${{ item.deliveredPrice.toLocaleString() }}
        </span>
      </template>

      <!-- Remaining Balance Column -->
      <template #item.remainingBalance="{ item }">
        <v-chip
          :color="item.remainingBalance === 0 ? 'success' : 'warning'"
          size="small"
          variant="flat"
        >
          ${{ item.remainingBalance.toLocaleString() }}
        </v-chip>
      </template>

      <!-- Actions Column -->
      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-eye"
          size="small"
          variant="text"
          color="primary"
          @click="openPatient(item.id)"
        ></v-btn>
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          color="info"
          @click="emit('edit', item)"
        ></v-btn>
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="handleDelete(item)"
        ></v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>
.search-field {
  max-width: 350px;
}

:deep(.v-data-table) {
  border-radius: 0 0 12px 12px;
}

:deep(.v-data-table-header) {
  background-color: #f5f5f5;
}

:deep(.v-data-table__td) {
  padding: 12px 16px !important;
}
</style>
