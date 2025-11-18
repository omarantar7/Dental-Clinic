<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Patient, PatientFormData } from "@/types/Patient";

interface Props {
  modelValue: boolean;
  patient?: Patient | null;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "save", data: PatientFormData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref();
const formData = ref<PatientFormData>({
  name: "",
  phone: "",
  email: "",
  gender: "male",
});

const isEdit = computed(() => !!props.patient);
const dialogTitle = computed(() =>
  isEdit.value ? "Edit Patient" : "Add New Patient"
);

const rules = {
  name: [(v: string) => !!v || "Name is required"],
  phone: [(v: string) => !!v || "Phone is required"],
  gender: [(v: string) => !!v || "Gender is required"],
  email: [
    (v: string) => !!v || "Email is required",
    (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
  ],
  // birthDate: [(v: string) => !!v || "Birth Date is required"],
  // medicalHistory: [(v: string) => !!v || "Medical History is required"],
  // address: [(v: string) => !!v || "address is required"],
  // allergies: [(v: string) => !!v || "Birth Date is required"],
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && props.patient) {
      formData.value = {
        name: props.patient.name,
        phone: props.patient.phone,
        email: props.patient.email,
        gender: props.patient.gender,
      };
    } else if (newVal) {
      resetForm();
    }
  }
);

const resetForm = () => {
  formData.value = {
    name: "",
    phone: "",
    email: "",
    gender: "",
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
  console.log(formData.value);
  
  handleClose();
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="handleClose"
    max-width="600px"
  >
    <v-card rounded="lg">
      <v-card-title class="pa-6 bg-primary text-white">
        <v-icon class="mr-2">mdi-account-plus</v-icon>
        {{ dialogTitle }}
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="form">
          <v-text-field
            v-model="formData.name"
            label="Full Name"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            :rules="rules.name"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="formData.phone"
            label="Phone Number"
            prepend-inner-icon="mdi-phone"
            type="tel"
            variant="outlined"
            :rules="rules.phone"
            class="mb-3"
          ></v-text-field>

          <v-text-field
            v-model="formData.email"
            label="Email Address"
            prepend-inner-icon="mdi-email"
            type="email"
            variant="outlined"
            :rules="rules.email"
            class="mb-3"
          ></v-text-field>

          <v-select
            v-model="formData.gender"
            item-title="state"
            item-value="abbr"
            label="Gender"
            :rules="rules.gender"
            :items="[
              { abbr: 'male', state: 'Male' },
              { abbr: 'female', state: 'Female' },
            ]"
            prepend-inner-icon="mdi-gender-male-female"
            persistent-hint
            variant="outlined"
            return-object
            single-line
            class="mb-3"
          ></v-select>

          <v-text-field
            v-model="formData.birthDate"
            label="Birth Date"
            prepend-inner-icon="mdi-calendar"
            type="date"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="formData.address"
            label="Address"
            prepend-inner-icon="mdi-home"
            variant="outlined"
            class="mb-3"
          ></v-text-field>

          <v-textarea
            v-model="formData.medicalHistory"
            label="Medical History"
            prepend-inner-icon="mdi-file-document"
            variant="outlined"
            rows="4"
            class="mb-3"
          />

          <v-text-field
            v-model="formData.allergies"
            label="Allergies"
            prepend-inner-icon="mdi-alert"
            variant="outlined"
            type="text"
            class="mb-3"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="handleClose">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="handleSave">
          {{ isEdit ? "Update" : "Create" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
