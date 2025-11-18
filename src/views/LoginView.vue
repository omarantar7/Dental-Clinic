<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/auth";

const router = useRouter();
const form = ref();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 6 || "Password must be at least 6 characters",
];

const handleLogin = async () => {
  const { valid } = await form.value.validate();

  if (!valid) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    await authService.login(email.value, password.value);
    router.push("/");
  } catch (error: any) {
    console.error("Login error:", error);

    // Handle Laravel validation errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 422) {
        // Validation error
        errorMessage.value =
          data.errors?.email?.[0] || "Invalid email or password";
      } else if (status === 401) {
        errorMessage.value = "Invalid email or password";
      } else if (status === 429) {
        errorMessage.value = "Too many attempts. Please try again later";
      } else {
        errorMessage.value =
          data.message || "An error occurred. Please try again";
      }
    } else {
      errorMessage.value = "Network error. Please check your connection";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-app>
    <v-main class="login-bg">
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="5" lg="4">
            <v-card class="elevation-12 login-card" rounded="xl">
              <v-card-text class="pa-8">
                <!-- Logo/Header Section -->
                <div class="text-center mb-8">
                  <v-avatar size="80" color="primary" class="mb-4">
                    <v-icon size="50" color="white">mdi-tooth</v-icon>
                  </v-avatar>
                  <h1 class="text-h4 primary--text font-weight-bold mb-2">
                    DentalCare Manager
                  </h1>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    Practice Management System
                  </p>
                </div>

                <!-- Login Form -->
                <v-form @submit.prevent="handleLogin" ref="form">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    prepend-inner-icon="mdi-email-outline"
                    type="email"
                    variant="outlined"
                    color="primary"
                    :rules="emailRules"
                    required
                    class="mb-3"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    label="Password"
                    prepend-inner-icon="mdi-lock-outline"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    @click:append-inner="showPassword = !showPassword"
                    variant="outlined"
                    color="primary"
                    :rules="passwordRules"
                    required
                    class="mb-2"
                  ></v-text-field>

                  <v-alert
                    v-if="errorMessage"
                    type="error"
                    variant="tonal"
                    class="mb-4"
                    closable
                    @click:close="errorMessage = ''"
                  >
                    {{ errorMessage }}
                  </v-alert>

                  <v-btn
                    type="submit"
                    block
                    size="large"
                    color="primary"
                    :loading="loading"
                    class="mb-4 text-none"
                    rounded="lg"
                  >
                    Sign In
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>

            <!-- Footer -->
            <div class="text-center mt-4">
              <p class="text-caption text-medium-emphasis">
                @{{ new Date().getFullYear() }} DentalCare Manager. All rights
                reserved.
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.login-bg {
  min-height: 100vh;
}

.login-card {
  backdrop-filter: blur(10px);
}

.v-avatar {
  box-shadow: 0 4px 20px rgba(0, 172, 193, 0.3);
}
</style>