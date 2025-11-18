<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import patientService from "@/services/patient";
import api from "@/services/api";

interface Lab {
  id: number;
  name: string;
  status: string;
  contact_person_name: string;
  phone_number: string;
  email: string;
  address?: string;
}

const labs = ref<Lab[]>([]);
const loading = ref(false);
const search = ref("");
const dialog = ref(false);
const form = ref();

const formData = ref({
  name: "",
  contact_person_name: "",
  phone_number: "",
  email: "",
  address: "",
});

const rules = {
  name: [(v: string) => !!v || "Lab name is required"],
  phone_number: [(v: string) => !!v || "Phone number is required"],
  email: [(v: string) => !v || /.+@.+\..+/.test(v) || "Email must be valid"],
};

const dialogTitle = computed(() => "Add New Lab");

onMounted(async () => {
  await loadLabs();
});

const loadLabs = async () => {
  loading.value = true;
  try {
    (labs as any).value = await patientService.getLabs();
  } catch (error) {
    console.error("Error loading labs:", error);
  } finally {
    loading.value = false;
  }
};
const isEditing = ref<boolean>(false);
const handleAddLab = (edit: boolean = false, data: any) => {
  dialog.value = true;
  if (edit) {
    isEditing.value = true;
    formData.value = data;
  }
};

const handleClose = () => {
  dialog.value = false;
  isEditing.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    name: "",
    contact_person_name: "",
    phone_number: "",
    email: "",
    address: "",
  };
  form.value?.resetValidation();
};

const snackbar = ref({
  show: false,
  message: "",
  color: "success",
});

const handleSave = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  loading.value = true;

  try {
    const payload = {
      id: (formData as any).value?.id ?? null,
      name: formData.value.name,
      contact_person_name: formData.value.contact_person_name,
      phone: formData.value.phone_number,
      email: formData.value.email,
      address: formData.value.address,
    };

    const endpoint = isEditing.value ? "/editLab" : "/createLab";
    const response = await api.post(endpoint, payload);

    if (response.data?.message) {
      await loadLabs();
      handleClose();

      snackbar.value = {
        show: true,
        message: isEditing.value
          ? "Lab updated successfully!"
          : "Lab created successfully!",
        color: "success",
      };
    }
  } catch (error: any) {
    console.error("Error saving lab:", error);

    const fallbackMessage = isEditing.value
      ? "Failed to update lab. Please try again."
      : "Failed to create lab. Please try again.";

    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = Object.values(errors).flat().join("\n");

      snackbar.value = {
        show: true,
        message: `Validation Error:\n${errorMessages}`,
        color: "error",
      };
    } else {
      snackbar.value = {
        show: true,
        message: fallbackMessage,
        color: "error",
      };
    }
  } finally {
    loading.value = false;
    isEditing.value = false;
  }
};
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "disabled":
      return "error";
    default:
      return "grey";
  }
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const filteredLabs = ref<Lab[]>([]);

const filterLabs = () => {
  if (!search.value) {
    filteredLabs.value = labs.value;
  } else {
    const searchLower = search.value.toLowerCase();
    filteredLabs.value = labs.value.filter(
      (lab) =>
        lab.name.toLowerCase().includes(searchLower) ||
        lab.contact_person_name.toLowerCase().includes(searchLower) ||
        lab.email.toLowerCase().includes(searchLower)
    );
  }
};

// Watch for changes
const handleSearch = () => {
  filterLabs();
};

// Initialize filtered labs
const initializeFilteredLabs = () => {
  filteredLabs.value = labs.value;
};

// Call when labs are loaded
onMounted(() => {
  initializeFilteredLabs();
});
</script>

<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Laboratory Partners</h1>
      <p class="text-body-1 text-medium-emphasis">
        Manage and view your laboratory partnerships
      </p>
    </div>

    <!-- Search and Actions Bar -->
    <v-card rounded="lg" elevation="2" class="mb-6">
      <v-card-text class="pa-4">
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search labs..."
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              @input="handleSearch"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="text-right">
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-plus"
              @click="handleAddLab(false, null)"
            >
              Add New Lab
            </v-btn>
            <v-chip class="mr-2" prepend-icon="mdi-flask">
              {{ labs.length }} Labs
            </v-chip>
            <v-chip color="success" prepend-icon="mdi-check-circle">
              {{ labs.filter((l) => l.status === "active").length }} Active
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card
      v-else-if="!loading && labs.length === 0"
      rounded="lg"
      elevation="2"
    >
      <v-card-text class="pa-12 text-center">
        <v-icon size="80" color="grey-lighten-1">mdi-flask-empty</v-icon>
        <h3 class="text-h6 font-weight-bold mt-4 mb-2">No Labs Found</h3>
        <p class="text-body-2 text-medium-emphasis">
          You don't have any laboratory partners yet.
        </p>
      </v-card-text>
    </v-card>

    <!-- Labs Grid -->
    <v-row v-else>
      <v-col
        v-for="lab in search ? filteredLabs : labs"
        :key="lab.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="lab-card h-100" rounded="lg" elevation="2" hover>
          <!-- Lab Header -->
          <v-card-title class="pa-4 d-flex align-center">
            <v-avatar
              :color="getStatusColor(lab.status)"
              size="48"
              class="mr-3"
            >
              <span class="text-h6 text-white">{{
                getInitials(lab.name)
              }}</span>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-h6 font-weight-bold text-truncate">
                {{ lab.name }}
              </div>
              <v-chip
                :color="getStatusColor(lab.status)"
                size="x-small"
                class="mt-1"
              >
                {{ lab.status }}
              </v-chip>
            </div>
            <v-btn
              variant="flat"
              color="primary"
              icon="mdi-pencil"
              size="small"
              @click="handleAddLab(true, lab)"
            />
          </v-card-title>

          <v-divider></v-divider>

          <!-- Lab Details -->
          <v-card-text class="pa-4">
            <v-list density="compact" class="transparent">
              <!-- Contact Person -->
              <v-list-item class="px-0 mb-2">
                <template #prepend>
                  <v-icon color="primary" size="20">mdi-account</v-icon>
                </template>
                <v-list-item-title class="text-body-2">
                  {{ lab.contact_person_name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Contact Person
                </v-list-item-subtitle>
              </v-list-item>

              <!-- Phone -->
              <v-list-item class="px-0 mb-2">
                <template #prepend>
                  <v-icon color="success" size="20">mdi-phone</v-icon>
                </template>
                <v-list-item-title class="text-body-2">
                  {{ lab.phone_number }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Phone Number
                </v-list-item-subtitle>
              </v-list-item>

              <!-- Email -->
              <v-list-item class="px-0 mb-2">
                <template #prepend>
                  <v-icon color="info" size="20">mdi-email</v-icon>
                </template>
                <v-list-item-title class="text-body-2 text-truncate">
                  {{ lab.email }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Email Address
                </v-list-item-subtitle>
              </v-list-item>

              <!-- Address -->
              <v-list-item v-if="lab.address" class="px-0">
                <template #prepend>
                  <v-icon color="warning" size="20">mdi-map-marker</v-icon>
                </template>
                <v-list-item-title class="text-body-2">
                  {{ lab.address }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Address
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Action Buttons -->
          <v-card-actions class="pa-4">
            <v-btn
              variant="text"
              color="primary"
              prepend-icon="mdi-phone"
              size="small"
              :href="`tel:${lab.phone_number}`"
            >
              Call
            </v-btn>
            <v-btn
              variant="text"
              color="info"
              prepend-icon="mdi-email"
              size="small"
              :href="`mailto:${lab.email}`"
            >
              Email
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-dots-vertical" variant="text" size="small"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Add Lab Dialog -->
  <v-dialog
    :model-value="dialog"
    @update:model-value="handleClose"
    max-width="600px"
  >
    <v-card rounded="lg">
      <v-card-title class="pa-6 bg-primary text-white">
        <v-icon class="mr-2">mdi-flask-plus</v-icon>
        {{ dialogTitle }}
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="form">
          <v-text-field
            v-model="formData.name"
            label="Lab Name *"
            prepend-inner-icon="mdi-flask"
            variant="outlined"
            :rules="rules.name"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="formData.contact_person_name"
            label="Contact Person Name"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="formData.phone_number"
            label="Phone Number *"
            prepend-inner-icon="mdi-phone"
            variant="outlined"
            :rules="rules.phone_number"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="formData.email"
            label="Email Address"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            :rules="rules.email"
            class="mb-3"
          ></v-text-field>

          <v-textarea
            v-model="formData.address"
            label="Address"
            prepend-inner-icon="mdi-map-marker"
            variant="outlined"
            rows="2"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="handleClose">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="handleSave">
          Save Lab
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="3500"
    top
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>

<style scoped>
.lab-card {
  transition: all 0.3s ease;
}

.lab-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.h-100 {
  height: 100%;
}

.transparent {
  background: transparent !important;
}

:deep(.v-list-item__prepend) {
  margin-right: 12px;
}
</style>
