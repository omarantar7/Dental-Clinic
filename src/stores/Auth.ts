import { defineStore } from "pinia";

interface login {
  email: string | undefined;
  password: string | undefined;
}

export const useAuth = defineStore("auth", {
  state: () => ({
    userId: null as null | string,
    token: null as null | string,
    didAutoLogout: false as boolean,
    isLoading: false as boolean,
  }),
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
  },
  actions: {
    async auth(payload: login) {
      const url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCqSFo77c6HXaI4jVS8KLifHd0FRWv7Ur8";

      this.isLoading = true;

      const response: any = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });

      const responseData = await response.json();
      this.isLoading = false;

      if (!response.ok) {
        const message =
          responseData.error.message || "Incorrect Email or Password";
        // useToast().addToast({
        //   title: `${payload.email?.split("@")[0]}`,
        //   message: `${message}`,
        //   color: "Red",
        //   delay: 3000,
        //   position: "bottom-right",
        // });
        return;
      }

      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);
      localStorage.setItem("expiresIn", responseData.expirationDate);

      this.userId = responseData.localId;
      this.token = responseData.idToken;
    },
    Logout() {
      this.userId = null;
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("expiresIn");
    },
    tryLogin() {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        this.token = token;
        this.userId = userId;
      }
    },
  },
});
