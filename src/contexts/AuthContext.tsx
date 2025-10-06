import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  exp?: number;
}

interface AuthState {
  token: string | null;
  userId: number | null;
  profile: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  setAuth: (auth: { token: string; userId: number; profile: string }) => void;
  clearAuth: () => void;
  isTokenExpired: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    userId: null,
    profile: null,
    isAuthenticated: false,
  });

  const isTokenExpired = (): boolean => {
    const token = authState.token || localStorage.getItem("auth.token");
    if (!token) return true;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      if (!decoded.exp) return false;

      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  };

  const setAuth = (auth: { token: string; userId: number; profile: string }) => {
    // Decode JWT to get expiry
    try {
      const decoded = jwtDecode<JWTPayload>(auth.token);
      if (decoded.exp) {
        localStorage.setItem("auth.expiresAt", decoded.exp.toString());
      }
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }

    // Persist to localStorage
    localStorage.setItem("auth.token", auth.token);
    localStorage.setItem("auth.userId", auth.userId.toString());
    localStorage.setItem("auth.profile", auth.profile);

    // Update state
    setAuthState({
      token: auth.token,
      userId: auth.userId,
      profile: auth.profile,
      isAuthenticated: true,
    });
  };

  const clearAuth = () => {
    // Clear localStorage
    localStorage.removeItem("auth.token");
    localStorage.removeItem("auth.userId");
    localStorage.removeItem("auth.profile");
    localStorage.removeItem("auth.expiresAt");

    // Clear state
    setAuthState({
      token: null,
      userId: null,
      profile: null,
      isAuthenticated: false,
    });
  };

  const loadFromStorage = () => {
    const token = localStorage.getItem("auth.token");
    const userId = localStorage.getItem("auth.userId");
    const profile = localStorage.getItem("auth.profile");

    if (token && userId && profile) {
      // Check if token is expired
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        if (decoded.exp) {
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            clearAuth();
            return;
          }
        }
      } catch {
        clearAuth();
        return;
      }

      setAuthState({
        token,
        userId: parseInt(userId, 10),
        profile,
        isAuthenticated: true,
      });
    }
  };

  // Load auth state from localStorage on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        setAuth,
        clearAuth,
        isTokenExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
