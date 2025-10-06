import { apiClient } from "@/lib/apiClient";

export interface LoginResponse {
  id: number;
  token: string;
  profile: string;
}

export interface AuthState {
  token: string;
  userId: number;
  profile: string;
}

class AuthService {
  async login(email: string, password: string): Promise<AuthState> {
    const response = await apiClient.post<LoginResponse>("/api/auth/login", {
      email,
      password,
    });

    if (!response.token) {
      throw new Error("Invalid response: missing token");
    }

    return {
      token: response.token,
      userId: response.id,
      profile: response.profile,
    };
  }

  async forgotPassword(email: string): Promise<string> {
    const response = await apiClient.post<string>("/api/auth/forgot-password", {
      email,
    });

    return response;
  }

  async recoverPassword(token: string, password: string): Promise<string> {
    const response = await apiClient.post<string>(
      `/api/auth/recover-password?token=${token}`,
      { password }
    );

    return response;
  }
}

export const authService = new AuthService();
