<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import type { Session, SessionFormData } from "@/types/Patient";
import patientService from "@/services/patient";

interface Props {
  modelValue: boolean;
  session?: Session | null;
  patientName?: string;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (
    e: "save",
    data: SessionFormData & {
      visited_lab?: boolean;
      lab_id?: number;
      lab_work_type?: string;
      lab_cost?: number;
      lab_description?: string;
      payment_amount?: number;
    }
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref();
const labs = ref<Array<{ id: number; name: string }>>([]);
const labOptions = computed(() =>
  labs.value.map((lab) => ({
    id: lab.id,
    name: lab.name,
  }))
);


const formData = ref({
  date: new Date().toISOString().split("T")[0],
  description: "",
  price: 0,
  notes: "",
  payment_amount: 0,
  visited_lab: false,
  lab_id: null as number | null,
  lab_work_type: "",
  lab_description: "",
});

const isEdit = computed(() => !!props.session);
const dialogTitle = computed(() =>
  isEdit.value
    ? "Edit Session"
    : `Add New Session${props.patientName ? ` for ${props.patientName}` : ""}`
);

const rules = {
  date: [(v: string) => !!v || "Date is required"],
  description: [(v: string) => !!v || "Description is required"],
  price: [
    (v: number) => (v !== null && v !== undefined) || "Price is required",
    (v: number) => v >= 0 || "Price must be positive",
  ],
  payment_amount: [(v: number) => v >= 0 || "Payment must be positive or zero"],
  lab_id: [
    (v: number | null) =>
      !formData.value.visited_lab || !!v || "Lab is required",
  ],
  lab_work_type: [
    (v: string) =>
      !formData.value.visited_lab || !!v || "Work type is required",
  ],
};

watch(
  () => formData.value.visited_lab,
  (newVal) => {
    if (!newVal) {
      formData.value.lab_id = null;
      formData.value.lab_work_type = "";
      formData.value.lab_description = "";
    }
  }
);

const loadLabs = async () => {
  try {
    labs.value = await patientService.getLabs();
  } catch (error) {
    console.error("Error loading labs:", error);
  }
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && props.session) {
      formData.value = {
        date: props.session.date,
        description: props.session.description,
        price: props.session.price,
        notes: props.session.notes || "",
        payment_amount: 0,
        visited_lab: false,
        lab_id: null,
        lab_work_type: "",
        lab_description: "",
      };
    } else if (newVal) {
      resetForm();
    }
  }
);

const resetForm = () => {
  formData.value = {
    date: new Date().toISOString().split("T")[0],
    description: "",
    price: 0,
    notes: "",
    payment_amount: 0,
    visited_lab: false,
    lab_id: null,
    lab_work_type: "",
    lab_description: "",
  };
  form.value?.resetValidation();
};

const handleClose = () => {
  emit("update:modelValue", false);
  setTimeout(resetForm, 300);
};

const handleSave = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  emit("save", { ...formData.value });
  handleClose();
};

onMounted(async () => {
  await loadLabs();
});
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="handleClose"
    max-width="600px"
  >
    <v-card rounded="lg">
      <v-card-title class="pa-6 bg-success text-white">
        <v-icon class="mr-2">mdi-calendar-plus</v-icon>
        {{ dialogTitle }}
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="form">
          <v-text-field
            v-model="formData.date"
            label="Session Date"
            prepend-inner-icon="mdi-calendar"
            type="date"
            variant="outlined"
            :rules="rules.date"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="formData.description"
            label="Treatment Description"
            prepend-inner-icon="mdi-stethoscope"
            variant="outlined"
            :rules="rules.description"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model.number="formData.price"
            label="Price"
            prepend-inner-icon="mdi-currency-usd"
            type="number"
            variant="outlined"
            :rules="rules.price"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model.number="formData.payment_amount"
            label="Payment Amount"
            prepend-inner-icon="mdi-cash"
            type="number"
            variant="outlined"
            :rules="rules.payment_amount"
            class="mb-3"
          ></v-text-field>

          <v-textarea
            v-model="formData.notes"
            label="Notes (Optional)"
            prepend-inner-icon="mdi-note-text"
            variant="outlined"
            rows="3"
            class="mb-3"
          ></v-textarea>

          <v-divider class="my-4"></v-divider>

          <!-- Lab Visit Toggle -->
          <div class="d-flex align-center mb-4">
            <v-switch
              v-model="formData.visited_lab"
              label="Patient Visited Lab"
              color="success"
              hide-details
            ></v-switch>
          </div>

          <!-- Lab-related fields (shown only when visited_lab is true) -->
          <v-expand-transition>
            <div v-show="formData.visited_lab">
              <v-select
                v-model="formData.lab_id"
                :items="labs"
                item-title="name"
                item-value="id"
                label="Lab *"
                prepend-inner-icon="mdi-flask"
                variant="outlined"
                :rules="rules.lab_id"
                class="mb-3"
              ></v-select>

              <v-text-field
                v-model="formData.lab_work_type"
                label="Lab Work Type *"
                prepend-inner-icon="mdi-test-tube"
                variant="outlined"
                :rules="rules.lab_work_type"
                class="mb-3"
              ></v-text-field>

              <v-textarea
                v-model="formData.lab_description"
                label="Lab Description (Optional)"
                prepend-inner-icon="mdi-text"
                variant="outlined"
                rows="2"
              ></v-textarea>
            </div>
          </v-expand-transition>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="handleClose">Cancel</v-btn>
        <v-btn color="success" variant="flat" @click="handleSave">
          {{ isEdit ? "Update" : "Create" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
