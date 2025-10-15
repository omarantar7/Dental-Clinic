<template>
  <v-app>
    <!-- App Bar -->
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

      <v-btn icon="mdi-bell-outline" variant="text"></v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            prepend-icon="mdi-account-circle"
            variant="text"
            class="mr-4"
          >
            Dr. {{ userName }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="handleLogout">
            <template #prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <!-- class="bg-grey-lighten-4" -->
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
                      {{ patients.length }}
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
        <v-card rounded="lg" elevation="2">
          <v-card-title class="pa-6 d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
            <span class="text-h5 font-weight-bold">Patient Records</span>
            <v-spacer></v-spacer>
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
                @click="viewPatient(item)"
              ></v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-main>

    <!-- Patient Detail Dialog -->
    <v-dialog v-model="dialog" max-width="900px" scrollable>
      <v-card v-if="selectedPatient" rounded="lg">
        <v-card-title class="pa-6 bg-primary text-white">
          <div class="d-flex align-center">
            <v-avatar color="white" size="60" class="mr-4">
              <span class="text-primary text-h5">{{
                getInitials(selectedPatient.name)
              }}</span>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">
                {{ selectedPatient.name }}
              </div>
              <div class="text-subtitle-2">
                Patient ID: {{ selectedPatient.id }}
              </div>
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="dialog = false"
          ></v-btn>
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
                      {{ selectedPatient.phone }}
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
                      {{ selectedPatient.email }}
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
                <v-card
                  color="success"
                  variant="tonal"
                  class="pa-4 text-center"
                >
                  <div class="text-h4 font-weight-bold">
                    ${{ selectedPatient.finalPrice.toLocaleString() }}
                  </div>
                  <div class="text-caption">Total Amount</div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card color="info" variant="tonal" class="pa-4 text-center">
                  <div class="text-h4 font-weight-bold">
                    ${{ selectedPatient.deliveredPrice.toLocaleString() }}
                  </div>
                  <div class="text-caption">Paid Amount</div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card
                  color="warning"
                  variant="tonal"
                  class="pa-4 text-center"
                >
                  <div class="text-h4 font-weight-bold">
                    ${{ selectedPatient.remainingBalance.toLocaleString() }}
                  </div>
                  <div class="text-caption">Remaining Balance</div>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Treatment Sessions -->
          <div>
            <h3 class="text-h6 font-weight-bold mb-4">
              <v-icon class="mr-2">mdi-clipboard-text</v-icon>
              Treatment Sessions ({{ selectedPatient.sessions.length }})
            </h3>
            <v-timeline side="end" density="compact">
              <v-timeline-item
                v-for="(session, index) in selectedPatient.sessions"
                :key="session.id"
                :dot-color="index === 0 ? 'primary' : 'grey'"
                size="small"
              >
                <v-card class="mb-4" elevation="2" rounded="lg">
                  <v-card-title class="bg-grey-lighten-4 pa-4">
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <v-icon class="mr-2" color="primary"
                          >mdi-calendar</v-icon
                        >
                        <span class="font-weight-bold"
                          >Session
                          {{ selectedPatient.sessions.length - index }}</span
                        >
                      </div>
                      <v-chip color="primary" size="small">
                        ${{ session.price.toLocaleString() }}
                      </v-chip>
                    </div>
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <div class="mb-2">
                      <v-icon size="small" class="mr-2"
                        >mdi-clock-outline</v-icon
                      >
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
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
// import type { Patient } from '@/types/Patient'

const router = useRouter();
const search = ref("");
const dialog = ref(false);
const selectedPatient = ref<any | null>(null);
const userName = ref("Rami");

const headers = [
  { title: "Patient Name", key: "name", sortable: true },
  { title: "Phone", key: "phone", sortable: false },
  { title: "Email", key: "email", sortable: false },
  { title: "Total Price", key: "finalPrice", sortable: true },
  { title: "Paid", key: "deliveredPrice", sortable: true },
  { title: "Balance", key: "remainingBalance", sortable: true },
  { title: "Actions", key: "actions", sortable: false, align: "center" },
];

// Dummy patient data
const patients = ref<any[]>([
  {
    id: "P001",
    name: "John Anderson",
    phone: "+1 (555) 123-4567",
    email: "john.anderson@email.com",
    finalPrice: 2500,
    deliveredPrice: 1500,
    remainingBalance: 1000,
    sessions: [
      {
        id: "S1",
        date: "2025-01-15",
        description: "Root Canal Treatment - Tooth #14",
        price: 800,
        notes: "Patient tolerated procedure well. Prescribed antibiotics.",
      },
      {
        id: "S2",
        date: "2025-02-20",
        description: "Crown Placement - Tooth #14",
        price: 1200,
        notes: "Porcelain crown fitted perfectly. Patient satisfied.",
      },
      {
        id: "S3",
        date: "2025-03-10",
        description: "Routine Cleaning & Checkup",
        price: 500,
        notes: "Regular cleaning completed. Good oral hygiene.",
      },
    ],
  },
  {
    id: "P002",
    name: "Sarah Mitchell",
    phone: "+1 (555) 234-5678",
    email: "sarah.mitchell@email.com",
    finalPrice: 3800,
    deliveredPrice: 3800,
    remainingBalance: 0,
    sessions: [
      {
        id: "S4",
        date: "2025-01-05",
        description: "Dental Implant Consultation",
        price: 200,
        notes: "Discussed implant procedure and timeline.",
      },
      {
        id: "S5",
        date: "2025-02-15",
        description: "Dental Implant Surgery - Tooth #19",
        price: 2500,
        notes: "Successful implant placement. Follow-up in 3 months.",
      },
      {
        id: "S6",
        date: "2025-05-20",
        description: "Crown Placement on Implant",
        price: 1100,
        notes: "Final crown placed successfully. Treatment complete.",
      },
    ],
  },
  {
    id: "P003",
    name: "Michael Chen",
    phone: "+1 (555) 345-6789",
    email: "michael.chen@email.com",
    finalPrice: 1800,
    deliveredPrice: 900,
    remainingBalance: 900,
    sessions: [
      {
        id: "S7",
        date: "2025-03-01",
        description: "Wisdom Tooth Extraction - Tooth #32",
        price: 600,
        notes: "Extraction performed without complications.",
      },
      {
        id: "S8",
        date: "2025-03-15",
        description: "Post-op Checkup",
        price: 150,
        notes: "Healing well, stitches removed.",
      },
      {
        id: "S9",
        date: "2025-04-10",
        description: "Teeth Whitening Session",
        price: 1050,
        notes: "Professional whitening completed. Excellent results.",
      },
    ],
  },
  {
    id: "P004",
    name: "Emily Rodriguez",
    phone: "+1 (555) 456-7890",
    email: "emily.rodriguez@email.com",
    finalPrice: 4200,
    deliveredPrice: 2800,
    remainingBalance: 1400,
    sessions: [
      {
        id: "S10",
        date: "2025-01-20",
        description: "Orthodontic Consultation",
        price: 150,
        notes: "Recommended Invisalign treatment.",
      },
      {
        id: "S11",
        date: "2025-02-10",
        description: "Invisalign Setup & First Aligners",
        price: 3500,
        notes: "Initial impressions taken. Treatment plan: 18 months.",
      },
      {
        id: "S12",
        date: "2025-03-25",
        description: "Progress Check & New Aligners",
        price: 550,
        notes: "Good progress. Patient compliant with wear schedule.",
      },
    ],
  },
  {
    id: "P005",
    name: "David Thompson",
    phone: "+1 (555) 567-8901",
    email: "david.thompson@email.com",
    finalPrice: 950,
    deliveredPrice: 950,
    remainingBalance: 0,
    sessions: [
      {
        id: "S13",
        date: "2025-02-05",
        description: "Dental Filling - Tooth #18",
        price: 350,
        notes: "Composite filling placed for small cavity.",
      },
      {
        id: "S14",
        date: "2025-03-20",
        description: "Routine Cleaning & Exam",
        price: 600,
        notes: "Complete cleaning. No new cavities detected.",
      },
    ],
  },
  {
    id: "P006",
    name: "Jessica Parker",
    phone: "+1 (555) 678-9012",
    email: "jessica.parker@email.com",
    finalPrice: 3200,
    deliveredPrice: 1600,
    remainingBalance: 1600,
    sessions: [
      {
        id: "S15",
        date: "2025-01-10",
        description: "Emergency Visit - Broken Tooth",
        price: 200,
        notes: "Temporary filling applied. Scheduled for crown.",
      },
      {
        id: "S16",
        date: "2025-02-01",
        description: "Root Canal - Tooth #30",
        price: 900,
        notes: "Root canal completed successfully.",
      },
      {
        id: "S17",
        date: "2025-03-05",
        description: "Crown Preparation & Placement",
        price: 2100,
        notes: "Ceramic crown placed. Excellent fit and aesthetics.",
      },
    ],
  },
  {
    id: "P007",
    name: "Robert Williams",
    phone: "+1 (555) 789-0123",
    email: "robert.williams@email.com",
    finalPrice: 1500,
    deliveredPrice: 500,
    remainingBalance: 1000,
    sessions: [
      {
        id: "S18",
        date: "2025-03-12",
        description: "Dental Bridge Consultation",
        price: 150,
        notes: "Discussed 3-unit bridge for missing tooth.",
      },
      {
        id: "S19",
        date: "2025-04-01",
        description: "Bridge Preparation",
        price: 350,
        notes: "Adjacent teeth prepared for bridge support.",
      },
      {
        id: "S20",
        date: "2025-05-10",
        description: "Bridge Placement",
        price: 1000,
        notes: "Permanent bridge cemented. Patient very pleased.",
      },
    ],
  },
  {
    id: "P008",
    name: "Lisa Martinez",
    phone: "+1 (555) 890-1234",
    email: "lisa.martinez@email.com",
    finalPrice: 2200,
    deliveredPrice: 2200,
    remainingBalance: 0,
    sessions: [
      {
        id: "S21",
        date: "2025-02-14",
        description: "Gum Disease Treatment - Scaling",
        price: 800,
        notes: "Deep cleaning performed. Improved gum health.",
      },
      {
        id: "S22",
        date: "2025-03-14",
        description: "Follow-up Gum Treatment",
        price: 700,
        notes: "Additional scaling. Gums responding well.",
      },
      {
        id: "S23",
        date: "2025-04-28",
        description: "Periodontal Maintenance",
        price: 700,
        notes: "Maintenance cleaning. Gums healthy now.",
      },
    ],
  },
]);

// Computed statistics
const totalRevenue = computed(() => {
  return patients.value.reduce((sum, p) => sum + p.finalPrice, 0);
});

const totalPending = computed(() => {
  return patients.value.reduce((sum, p) => sum + p.remainingBalance, 0);
});

const totalSessions = computed(() => {
  return patients.value.reduce((sum, p) => sum + p.sessions.length, 0);
});

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

const viewPatient = (patient: any) => {
  selectedPatient.value = patient;
  dialog.value = true;
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

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
