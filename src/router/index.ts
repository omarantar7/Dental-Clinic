// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// Define routes with their authentication requirements
const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: {
      requiresAuth: false,
      title: "Login - DentalCare Manager",
    },
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: {
      requiresAuth: true,
      title: "Dashboard - DentalCare Manager",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      title: "404 Not Found - DentalCare Manager",
    },
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Helper function to get current authenticated user
const getCurrentUser = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // Unsubscribe after getting the user
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  document.title = (to.meta.title as string) || "DentalCare Manager";

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const currentUser = auth.currentUser || (await getCurrentUser());

  if (requiresAuth && !currentUser) {
    next({ name: "Login" });
  } else if (to.name === "Login" && currentUser) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});

export default router;
