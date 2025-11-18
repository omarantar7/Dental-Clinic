<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <v-app>
    <v-main class="notfound-bg">
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" class="text-center">
            <v-card class="pa-8 elevation-12" rounded="xl">
              <v-card-text>
                <!-- 404 Icon -->
                <v-avatar size="150" color="primary" class="mb-6">
                  <v-icon size="80" color="white">mdi-tooth-outline</v-icon>
                </v-avatar>

                <!-- 404 Title -->
                <h1 class="text-h1 font-weight-bold primary--text mb-4">404</h1>

                <h2 class="text-h4 font-weight-bold mb-4">Page Not Found</h2>

                <p class="text-h6 text-medium-emphasis mb-8">
                  Oops! It seems like this page has been extracted. <br />
                  The page you're looking for doesn't exist.
                </p>

                <!-- Action Buttons -->
                <div class="d-flex justify-center gap-4">
                  <v-btn
                    size="large"
                    color="primary"
                    prepend-icon="mdi-home"
                    @click="goHome"
                    rounded="lg"
                    class="text-none"
                  >
                    Go to Dashboard
                  </v-btn>

                  <v-btn
                    size="large"
                    variant="outlined"
                    color="primary"
                    prepend-icon="mdi-arrow-left"
                    @click="goBack"
                    rounded="lg"
                    class="text-none"
                  >
                    Go Back
                  </v-btn>
                </div>

                <!-- Decorative Elements -->
                <div class="mt-8">
                  <v-chip
                    class="ma-2"
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-tooth"
                  >
                    DentalCare Manager
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>

            <!-- Fun Message -->
            <v-card class="mt-4 pa-4" color="info" variant="tonal" rounded="lg">
              <p class="text-body-1 mb-0">
                <v-icon class="mr-2">mdi-lightbulb-outline</v-icon>
                <strong>Tip:</strong> Make sure to check your URL or use the
                navigation menu to find what you need.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.notfound-bg {
  background: linear-gradient(135deg, #e3f2fd 0%, #f5f9fa 100%);
  min-height: 100vh;
}

.gap-4 {
  gap: 16px;
}
</style>
