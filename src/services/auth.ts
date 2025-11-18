import api from "./api";

interface LoginResponse {
  message: string;
  user: {
    id: number;
    role: string;
    status: string;
    full_name: string;
    email: string;
    phone_number?: string;
    last_login: string;
    doctor?: any;
    employee?: any;
  };
  token: string;
  token_type: string;
}

interface User {
  id: number;
  role: string;
  status: string;
  full_name: string;
  email: string;
  phone_number?: string;
  last_login: string;
  doctor?: any;
  employee?: any;
}

class AuthService {
  private readonly TOKEN_KEY = "auth_token";
  private readonly USER_KEY = "auth_user";

  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/login", {
      email,
      password,
    });

    // Save token and user to sessionStorage
    this.setToken(response.data.token);
    this.setUser(response.data.user);

    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Get current user info from API
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ user: User }>("/me");
      this.setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Get current user error:", error);
      this.clearAuth();
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    // Verify token with API
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Save token to sessionStorage
   */
  setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get token from sessionStorage
   */
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Save user to sessionStorage
   */
  setUser(user: User): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user from sessionStorage
   */
  getUser(): User | null {
    const user = sessionStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }
}

export default new AuthService();