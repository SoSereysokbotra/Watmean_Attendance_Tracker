"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/utils/client-auth";

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check localStorage for tokens
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userStr = localStorage.getItem("user");

    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          accessToken,
          refreshToken,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        clearAuth();
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authClient.login({ email, password });

      if (result.success && result.data) {
        const { accessToken, refreshToken, user } = result.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setAuthState({
          user,
          accessToken,
          refreshToken,
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
    const refreshToken = authState.refreshToken;
    if (refreshToken) {
      await authClient.logout(refreshToken);
    }
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const refreshTokens = async () => {
    const refreshToken = authState.refreshToken;
    if (!refreshToken) {
      clearAuth();
      return false;
    }

    try {
      const result = await authClient.refreshToken(refreshToken);

      if (result.success && result.data) {
        const {
          accessToken,
          refreshToken: newRefreshToken,
          user,
        } = result.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setAuthState((prev) => ({
          ...prev,
          accessToken,
          refreshToken: newRefreshToken,
          user,
        }));

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
