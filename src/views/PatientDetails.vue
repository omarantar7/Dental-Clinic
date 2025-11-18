<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import SessionFormDialog from "@/components/SessionFormDialog.vue";
import patientService from "@/services/patient";
import sessionService from "@/services/session";
import type { Patient, Session } from "@/types/Patient";

const route = useRoute();
const router = useRouter();

const patient = ref<Patient | null>(null);
const loading = ref(false);
const sessionDialog = ref(false);
const editingSession = ref<Session | null>(null);

onMounted(async () => {
  await loadPatient();
});

const loadPatient = async () => {
  loading.value = true;
  try {
    const patientId = route.params.pid as string;
    patient.value = await patientService.getPatient(patientId);
  } catch (error) {
    console.error("Error loading patient:", error);
    alert("Failed to load patient details");
    router.push("/");
  } finally {
    loading.value = false;
  }
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const handleAddSession = () => {
  editingSession.value = null;
  sessionDialog.value = true;
};

const handleEditSession = (session: Session) => {
  editingSession.value = session;
  sessionDialog.value = true;
};

const handleDeleteSession = async (sessionId: string) => {
  if (
    !patient.value ||
    !confirm("Are you sure you want to delete this session?")
  )
    return;

  try {
    await sessionService.deleteSession(patient.value.id, sessionId);
    await loadPatient();
  } catch (error) {
    console.error("Error deleting session:", error);
    alert("Failed to delete session");
  }
};

const handleSaveSession = async (sessionData: any) => {
  if (!patient.value) return;

  try {
    if (editingSession.value) {
      await sessionService.updateSession(
        patient.value.id,
        editingSession.value.id,
        sessionData
      );
    } else {
      console.log(sessionData);

      await sessionService.createSession(patient.value.id, sessionData);
    }
    await loadPatient();
  } catch (error) {
    console.error("Error saving session:", error);
    alert("Failed to save session");
  }
};

const goBack = () => {
  router.push("/");
};

const paymentStatusColor = computed(() => {
  if (!patient.value) return "grey";
  if (patient.value.remainingBalance === 0) return "success";
  if (patient.value.deliveredPrice > 0) return "warning";
  return "error";
});

const paymentStatusText = computed(() => {
  if (!patient.value) return "Unknown";
  if (patient.value.remainingBalance === 0) return "Fully Paid";
  if (patient.value.deliveredPrice > 0) return "Partially Paid";
  return "Unpaid";
});
</script>

<template>
  <v-app>
    <v-main>
      <v-container v-if="loading" class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-else-if="patient" fluid class="pa-6">
        <!-- Back Button -->
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="goBack"
          class="mb-4"
        >
          Back to Patients
        </v-btn>

        <!-- Patient Header Card -->
        <v-card rounded="lg" elevation="3" class="mb-6">
          <v-card-text class="pa-6">
            <v-row align="center">
              <v-col cols="auto">
                <v-avatar color="primary" size="80">
                  <span class="text-h4 text-white">{{
                    getInitials(patient.name)
                  }}</span>
                </v-avatar>
              </v-col>
              <v-col>
                <h1 class="text-h4 font-weight-bold mb-2">
                  {{ patient.name }}
                </h1>
                <div class="d-flex flex-wrap gap-3">
                  <v-chip prepend-icon="mdi-identifier" size="small">
                    ID: {{ patient.id }}
                  </v-chip>
                  <v-chip
                    :color="paymentStatusColor"
                    prepend-icon="mdi-cash-check"
                    size="small"
                  >
                    {{ paymentStatusText }}
                  </v-chip>
                </div>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-pencil"
                  variant="outlined"
                  @click="router.push(`/patients/${patient.id}/edit`)"
                >
                  Edit Patient
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-row>
          <!-- Left Column: Patient Info -->
          <v-col cols="12" md="4">
            <!-- Contact Information -->
            <v-card rounded="lg" elevation="2" class="mb-4">
              <v-card-title class="bg-primary text-white pa-4">
                <v-icon class="mr-2">mdi-card-account-details</v-icon>
                Contact Information
              </v-card-title>
              <v-card-text class="pa-4">
                <v-list density="compact">
                  <v-list-item>
                    <template #prepend>
                      <v-icon color="primary">mdi-phone</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium">
                      {{ patient.phone }}
                    </v-list-item-title>
                    <v-list-item-subtitle>Phone Number</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider class="my-2"></v-divider>
                  <v-list-item>
                    <template #prepend>
                      <v-icon color="primary">mdi-email</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium">
                      {{ patient.email || "N/A" }}
                    </v-list-item-title>
                    <v-list-item-subtitle>Email Address</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Financial Summary -->
            <v-card rounded="lg" elevation="2">
              <v-card-title class="bg-success text-white pa-4">
                <v-icon class="mr-2">mdi-cash-multiple</v-icon>
                Financial Summary
              </v-card-title>
              <v-card-text class="pa-4">
                <div class="mb-4">
                  <div class="text-caption text-medium-emphasis mb-1">
                    Total Amount
                  </div>
                  <div class="text-h4 font-weight-bold text-success">
                    ${{ patient.finalPrice.toLocaleString() }}
                  </div>
                </div>
                <v-divider class="my-3"></v-divider>
                <div class="mb-4">
                  <div class="text-caption text-medium-emphasis mb-1">
                    Paid Amount
                  </div>
                  <div class="text-h5 font-weight-bold text-info">
                    ${{ patient.deliveredPrice.toLocaleString() }}
                  </div>
                </div>
                <v-divider class="my-3"></v-divider>
                <div>
                  <div class="text-caption text-medium-emphasis mb-1">
                    Remaining Balance
                  </div>
                  <div class="text-h5 font-weight-bold text-warning">
                    ${{ patient.remainingBalance.toLocaleString() }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Right Column: Sessions -->
          <v-col cols="12" md="8">
            <v-card rounded="lg" elevation="2">
              <v-card-title class="pa-4 d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-clipboard-text</v-icon>
                <span class="text-h6 font-weight-bold">
                  Treatment Sessions ({{ patient.sessions.length }})
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  prepend-icon="mdi-plus"
                  @click="handleAddSession"
                >
                  Add Session
                </v-btn>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text class="pa-4">
                <div
                  v-if="patient.sessions.length === 0"
                  class="text-center py-8"
                >
                  <v-icon size="64" color="grey-lighten-1"
                    >mdi-clipboard-text-off</v-icon
                  >
                  <p class="text-h6 text-medium-emphasis mt-4">
                    No sessions yet
                  </p>
                  <p class="text-body-2 text-medium-emphasis">
                    Click "Add Session" to create the first treatment session
                  </p>
                </div>

                <v-timeline v-else side="end" density="compact">
                  <v-timeline-item
                    v-for="(session, index) in patient.sessions"
                    :key="session.id"
                    :dot-color="index === 0 ? 'success' : 'primary'"
                    size="small"
                  >
                    <v-card elevation="2" rounded="lg" class="mb-4">
                      <v-card-title class="bg-grey-lighten-4 pa-4">
                        <div class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <v-icon class="mr-2" color="primary"
                              >mdi-calendar</v-icon
                            >
                            <span class="font-weight-bold">
                              {{ formatDate(session.date) }}
                            </span>
                            <v-chip
                              v-if="index === 0"
                              color="success"
                              size="x-small"
                              class="ml-2"
                            >
                              Latest
                            </v-chip>
                          </div>
                          <div class="d-flex align-center">
                            <v-chip color="primary" size="small" class="mr-2">
                              ${{ session.price.toLocaleString() }}
                            </v-chip>
                            <v-btn
                              icon="mdi-pencil"
                              size="small"
                              variant="text"
                              color="primary"
                              @click="handleEditSession(session)"
                            ></v-btn>
                            <v-btn
                              icon="mdi-delete"
                              size="small"
                              variant="text"
                              color="error"
                              @click="handleDeleteSession(session.id)"
                            ></v-btn>
                          </div>
                        </div>
                      </v-card-title>
                      <v-card-text class="pa-4">
                        <div class="mb-3">
                          <div class="d-flex align-center mb-1">
                            <v-icon size="small" class="mr-2" color="primary">
                              mdi-stethoscope
                            </v-icon>
                            <strong>Treatment:</strong>
                          </div>
                          <p class="ml-6 mb-0">{{ session.description }}</p>
                        </div>
                        <div v-if="session.notes">
                          <div class="d-flex align-center mb-1">
                            <v-icon size="small" class="mr-2" color="info">
                              mdi-note-text
                            </v-icon>
                            <strong>Notes:</strong>
                          </div>
                          <p class="ml-6 mb-0 text-medium-emphasis">
                            {{ session.notes }}
                          </p>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Session Form Dialog -->
    <SessionFormDialog
      v-model="sessionDialog"
      :session="editingSession"
      :patient-name="patient?.name"
      @save="handleSaveSession"
    />
  </v-app>
</template>

<style scoped>
.gap-3 {
  gap: 12px;
}

.v-timeline {
  padding-top: 0;
}
</style>
