import { API_CONFIG } from "@/config/api";

interface RequestConfig extends RequestInit {
  headers?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Request interceptor: Add JWT token if available
    const token = localStorage.getItem("auth.token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...config,
        headers,
      });

      // Response interceptor: Handle 401 unauthorized
      if (response.status === 401) {
        // Clear auth state
        localStorage.removeItem("auth.token");
        localStorage.removeItem("auth.userId");
        localStorage.removeItem("auth.profile");
        localStorage.removeItem("auth.expiresAt");
        
        // Redirect to login
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      // Handle non-JSON responses (for forgot/recover password)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Request failed");
        }
        
        return data;
      } else {
        const text = await response.text();
        
        if (!response.ok) {
          throw new Error(text || "Request failed");
        }
        
        return text as T;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error");
    }
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_CONFIG.baseURL);
