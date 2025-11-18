<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import PatientsTable from "@/components/PatientsTable.vue";
import PatientFormDialog from "@/components/PatientFormDialog.vue";
import PatientDetailsDialog from "@/components/PatientDetailsDialog.vue";
import patientService from "@/services/patient";
import type {
  Patient,
  PatientFormData,
  SessionFormData,
} from "@/types/Patient";

// State
const patients = ref<Patient[]>([]);
const loading = ref(false);
const statistics = ref({
  totalPatients: 0,
  totalRevenue: 0,
  totalPending: 0,
  totalSessions: 0,
});

const patientFormDialog = ref(false);
const patientDetailsDialog = ref(false);
const editingPatient = ref<Patient | null>(null);
const selectedPatient = ref<Patient | null>(null);

// Load data on mount
onMounted(async () => {
  await loadPatients();
  await loadStatistics();
});

// Load patients from API
const loadPatients = async () => {
  loading.value = true;
  try {
    patients.value = await patientService.getPatients();
  } catch (error) {
    console.error("Error loading patients:", error);
    alert("Failed to load patients");
  } finally {
    loading.value = false;
  }
};

// Load statistics from API
const loadStatistics = async () => {
  try {
    statistics.value = await patientService.getStatistics();
  } catch (error) {
    console.error("Error loading statistics:", error);
  }
};

// Computed statistics (fallback to calculated if API fails)
const totalRevenue = computed(() => {
  return (
    statistics.value.totalRevenue ||
    patients.value.reduce((sum, p) => sum + p.finalPrice, 0)
  );
});

const totalPending = computed(() => {
  return (
    statistics.value.totalPending ||
    patients.value.reduce((sum, p) => sum + p.remainingBalance, 0)
  );
});

const totalSessions = computed(() => {
  return (
    statistics.value.totalSessions ||
    patients.value.reduce((sum, p) => sum + p.sessions.length, 0)
  );
});

// Patient CRUD operations
const handleAddPatient = () => {
  editingPatient.value = null;
  patientFormDialog.value = true;
};

const handleEditPatient = (patient: Patient) => {
  editingPatient.value = patient;
  patientFormDialog.value = true;
  patientDetailsDialog.value = false;
};

const handleViewPatient = (patient: Patient) => {
  selectedPatient.value = patient;
  patientDetailsDialog.value = true;
};

const handleDeletePatient = async (patientId: string) => {
  try {
    await patientService.deletePatient(patientId);
    await loadPatients();
    await loadStatistics();
  } catch (error) {
    console.error("Error deleting patient:", error);
    alert("Failed to delete patient");
  }
};

const handleSavePatient = async (data: PatientFormData) => {
  try {
    if (editingPatient.value) {
      await patientService.updatePatient(editingPatient.value.id, data);
    } else {
      await patientService.createPatient(data as any);
    }
    await loadPatients();
    await loadStatistics();
  } catch (error) {
    console.error("Error saving patient:", error);
    alert("Failed to save patient");
  }
};

// Session CRUD operations
const handleSaveSession = (data: {
  patientId: string;
  sessionData: SessionFormData;
}) => {
  const patient = patients.value.find((p) => p.id === data.patientId);
  if (!patient) return;

  const newSession = {
    id: `S${Date.now()}`,
    patient_id: data.patientId,
    date: data.sessionData.date,
    description: data.sessionData.description,
    price: data.sessionData.price,
    notes: data.sessionData.notes,
  };

  patient.sessions.unshift(newSession);
  updatePatientFinancials(patient);
};

const handleUpdateSession = (data: {
  patientId: string;
  sessionId: string;
  sessionData: SessionFormData;
}) => {
  const patient = patients.value.find((p) => p.id === data.patientId);
  if (!patient) return;

  const session = patient.sessions.find((s) => s.id === data.sessionId);
  if (!session) return;

  session.date = data.sessionData.date;
  session.description = data.sessionData.description;
  session.price = data.sessionData.price;
  session.notes = data.sessionData.notes;

  updatePatientFinancials(patient);
};

const handleDeleteSession = (data: {
  patientId: string;
  sessionId: string;
}) => {
  const patient = patients.value.find((p) => p.id === data.patientId);
  if (!patient) return;

  const index = patient.sessions.findIndex((s) => s.id === data.sessionId);
  if (index > -1) {
    patient.sessions.splice(index, 1);
    updatePatientFinancials(patient);
  }
};

const updatePatientFinancials = (patient: Patient) => {
  patient.finalPrice = patient.sessions.reduce((sum, s) => sum + s.price, 0);
  patient.remainingBalance = patient.finalPrice - patient.deliveredPrice;
};
</script>

<template>
  <v-app>
    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-6">
        <!-- Statistics Cards -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card" rounded="lg" elevation="2">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-avatar color="primary" size="56" class="mr-4">
                    <v-icon color="white" size="30"
                      >mdi-account-multiple</v-icon
                    >
                  </v-avatar>
                  <div>
                    <div class="text-h4 font-weight-bold">
                      {{ statistics.totalPatients || patients.length }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Total Patients
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card" rounded="lg" elevation="2">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-avatar color="success" size="56" class="mr-4">
                    <v-icon color="white" size="30">mdi-currency-usd</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h4 font-weight-bold">
                      ${{ totalRevenue.toLocaleString() }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Total Revenue
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card" rounded="lg" elevation="2">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-avatar color="warning" size="56" class="mr-4">
                    <v-icon color="white" size="30">mdi-clock-outline</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h4 font-weight-bold">
                      ${{ totalPending.toLocaleString() }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Pending Payments
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card" rounded="lg" elevation="2">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-avatar color="info" size="56" class="mr-4">
                    <v-icon color="white" size="30">mdi-calendar-check</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h4 font-weight-bold">
                      {{ totalSessions }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Total Sessions
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Patients Table -->
        <PatientsTable
          :patients="patients"
          :loading="loading"
          @add="handleAddPatient"
          @view="handleViewPatient"
          @edit="handleEditPatient"
          @delete="handleDeletePatient"
        />
      </v-container>
    </v-main>

    <!-- Patient Form Dialog -->
    <PatientFormDialog
      v-model="patientFormDialog"
      :patient="editingPatient"
      @save="handleSavePatient"
    />

    <!-- Patient Details Dialog -->
    <PatientDetailsDialog
      v-model="patientDetailsDialog"
      :patient="selectedPatient"
      @edit-patient="handleEditPatient"
      @save-session="handleSaveSession"
      @update-session="handleUpdateSession"
      @delete-session="handleDeleteSession"
    />
  </v-app>
</template>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}
</style>
