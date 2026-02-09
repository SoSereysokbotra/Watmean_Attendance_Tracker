"use client";

import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth/utils/client-auth";

interface AuthState {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    refreshTokens();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authClient.login({ email, password });

      if (result.success && result.data) {
        const { user } = result.data;

        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await authClient.logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
    clearAuth();
  };

  const clearAuth = () => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const refreshTokens = async () => {
    try {
      const result = await authClient.refreshToken();

      if (result.success && result.data) {
        const { user } = result.data;

        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        return true;
      } else {
        clearAuth();
        return false;
      }
    } catch (error) {
      clearAuth();
      return false;
    }
  };

  return {
    ...authState,
    login,
    logout,
    refreshTokens,
  };
}
