import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/auth";

const user = ref(authService.getUser());
const loading = ref(false);

export function useAuth() {
  const router = useRouter();

  const isAuthenticated = computed(
    () => !!user.value && !!authService.getToken()
  );

  const isDoctor = computed(() => user.value?.role === "doctor");

  const isEmployee = computed(() => user.value?.role === "employee");

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const response = await authService.login(email, password);
      user.value = response.user;
      return response;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await authService.logout();
      user.value = null;
      router.push("/login");
    } finally {
      loading.value = false;
    }
  };

  const refreshUser = async () => {
    loading.value = true;
    try {
      const currentUser = await authService.getCurrentUser();
      user.value = currentUser;
      return currentUser;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    isDoctor,
    isEmployee,
    login,
    logout,
    refreshUser,
  };
}
