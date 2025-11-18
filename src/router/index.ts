import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import authService from "@/services/auth";

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
    path: "/patients/:pid",
    name: "PatientDetails",
    component: () => import("@/views/PatientDetails.vue"),
    meta: {
      requiresAuth: true,
      title: "Patient Details - DentalCare Manager",
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
  {
    path: "/labs",
    name: "Labs",
    component: () => import("@/views/LabsView.vue"),
    meta: {
      requiresAuth: true,
      title: "Labs - DentalCare Manager",
    },
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  // Set page title
  document.title = (to.meta.title as string) || "DentalCare Manager";

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const token = authService.getToken();

  // If route requires authentication
  if (requiresAuth) {
    if (!token) {
      // No token, redirect to login
      next({ name: "Login" });
    } else {
      // Token exists, verify it's valid
      const isAuthenticated = await authService.isAuthenticated();

      if (isAuthenticated) {
        next();
      } else {
        // Token is invalid, redirect to login
        next({ name: "Login" });
      }
    }
  } else {
    // Route doesn't require auth
    if (to.name === "Login" && token) {
      // User is already logged in, redirect to dashboard
      const isAuthenticated = await authService.isAuthenticated();

      if (isAuthenticated) {
        next({ name: "Dashboard" });
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});

export default router;
