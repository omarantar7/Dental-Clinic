<script setup lang="ts">
import { ref } from "vue";
import type { Patient, Session, SessionFormData } from "@/types/Patient";
import SessionFormDialog from "./SessionFormDialog.vue";

interface Props {
  modelValue: boolean;
  patient: Patient | null;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "edit-patient", patient: Patient): void;
  (e: "add-session", patientId: string): void;
  (e: "edit-session", data: { patientId: string; session: Session }): void;
  (e: "delete-session", data: { patientId: string; sessionId: string }): void;
  (
    e: "save-session",
    data: { patientId: string; sessionData: SessionFormData }
  ): void;
  (
    e: "update-session",
    data: { patientId: string; sessionId: string; sessionData: SessionFormData }
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const sessionDialog = ref(false);
const editingSession = ref<Session | null>(null);

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

const handleClose = () => {
  emit("update:modelValue", false);
};

const handleEditPatient = () => {
  if (props.patient) {
    emit("edit-patient", props.patient);
  }
};

const handleAddSession = () => {
  editingSession.value = null;
  sessionDialog.value = true;
};

const handleEditSession = (session: Session) => {
  editingSession.value = session;
  sessionDialog.value = true;
};

const handleDeleteSession = (sessionId: string) => {
  if (
    props.patient &&
    confirm("Are you sure you want to delete this session?")
  ) {
    emit("delete-session", { patientId: props.patient.id, sessionId });
  }
};

const handleSaveSession = (sessionData: SessionFormData) => {
  if (!props.patient) return;

  if (editingSession.value) {
    emit("update-session", {
      patientId: props.patient.id,
      sessionId: editingSession.value.id,
      sessionData,
    });
  } else {
    emit("save-session", { patientId: props.patient.id, sessionData });
  }
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="handleClose"
    max-width="900px"
    scrollable
  >
    <v-card v-if="patient" rounded="lg">
      <v-card-title class="pa-6 bg-primary text-white d-flex">
        <div class="d-flex align-center">
          <v-avatar color="white" size="60" class="mr-4">
            <span class="text-primary text-h5">{{
              getInitials(patient.name)
            }}</span>
          </v-avatar>
          <div>
            <div class="text-h5 font-weight-bold">{{ patient.name }}</div>
            <div class="text-subtitle-2">Patient ID: {{ patient.id }}</div>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-pencil"
          variant="text"
          @click="handleEditPatient"
          class="mr-2"
        ></v-btn>
        <v-btn icon="mdi-close" variant="text" @click="handleClose"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <!-- Contact Information -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-card-account-details</v-icon>
            Contact Information
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-list density="compact" class="bg-grey-lighten-5 rounded">
                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-phone</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">
                    {{ patient.phone }}
                  </v-list-item-title>
                  <v-list-item-subtitle>Phone Number</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6">
              <v-list density="compact" class="bg-grey-lighten-5 rounded">
                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-email</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">
                    {{ patient.email }}
                  </v-list-item-title>
                  <v-list-item-subtitle>Email Address</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </div>

        <!-- Financial Summary -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-4">
            <v-icon class="mr-2">mdi-cash-multiple</v-icon>
            Financial Summary
          </h3>
          <v-row>
            <v-col cols="12" sm="4">
              <v-card color="success" variant="tonal" class="pa-4 text-center">
                <div class="text-h4 font-weight-bold">
                  ${{ patient.finalPrice.toLocaleString() }}
                </div>
                <div class="text-caption">Total Amount</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card color="info" variant="tonal" class="pa-4 text-center">
                <div class="text-h4 font-weight-bold">
                  ${{ patient.deliveredPrice.toLocaleString() }}
                </div>
                <div class="text-caption">Paid Amount</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card color="warning" variant="tonal" class="pa-4 text-center">
                <div class="text-h4 font-weight-bold">
                  ${{ patient.remainingBalance.toLocaleString() }}
                </div>
                <div class="text-caption">Remaining Balance</div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Treatment Sessions -->
        <div>
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-h6 font-weight-bold">
              <v-icon class="mr-2">mdi-clipboard-text</v-icon>
              Treatment Sessions ({{ patient.sessions.length }})
            </h3>
            <v-btn
              color="success"
              prepend-icon="mdi-plus"
              @click="handleAddSession"
            >
              Add Session
            </v-btn>
          </div>

          <v-timeline side="end" density="compact">
            <v-timeline-item
              v-for="(session, index) in patient.sessions"
              :key="session.id"
              :dot-color="index === 0 ? 'primary' : 'grey'"
              size="small"
            >
              <v-card class="mb-4" elevation="2" rounded="lg">
                <v-card-title class="bg-grey-lighten-4 pa-4">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <v-icon class="mr-2" color="primary">mdi-calendar</v-icon>
                      <span class="font-weight-bold">
                        Session {{ patient.sessions.length - index }}
                      </span>
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
                  <div class="mb-2">
                    <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
                    <strong>Date:</strong> {{ formatDate(session.date) }}
                  </div>
                  <div class="mb-2">
                    <v-icon size="small" class="mr-2">mdi-stethoscope</v-icon>
                    <strong>Treatment:</strong> {{ session.description }}
                  </div>
                  <div v-if="session.notes">
                    <v-icon size="small" class="mr-2">mdi-note-text</v-icon>
                    <strong>Notes:</strong> {{ session.notes }}
                  </div>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-card-text>
    </v-card>

    <!-- Session Form Dialog -->
    <SessionFormDialog
      v-model="sessionDialog"
      :session="editingSession"
      :patient-name="patient?.name"
      @save="handleSaveSession"
    />
  </v-dialog>
</template>
