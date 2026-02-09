"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState, useEffect, useRef } from "react";
>>>>>>> feature/backend-auth
import { authClient } from "@/lib/auth/utils/client-auth";

interface AuthState {
  user: any | null;
<<<<<<< HEAD
  accessToken: string | null;
  refreshToken: string | null;
=======
>>>>>>> feature/backend-auth
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
<<<<<<< HEAD
    accessToken: null,
    refreshToken: null,
=======
>>>>>>> feature/backend-auth
    isLoading: true,
    isAuthenticated: false,
  });

<<<<<<< HEAD
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
=======
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    refreshTokens();
>>>>>>> feature/backend-auth
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authClient.login({ email, password });

      if (result.success && result.data) {
<<<<<<< HEAD
        const { accessToken, refreshToken, user } = result.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setAuthState({
          user,
          accessToken,
          refreshToken,
=======
        const { user } = result.data;

        setAuthState({
          user,
>>>>>>> feature/backend-auth
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
<<<<<<< HEAD
    const refreshToken = authState.refreshToken;
    if (refreshToken) {
      await authClient.logout(refreshToken);
=======
    try {
      await authClient.logout();
    } catch (error) {
      console.error("Logout failed", error);
>>>>>>> feature/backend-auth
    }
    clearAuth();
  };

  const clearAuth = () => {
<<<<<<< HEAD
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
=======
    setAuthState({
      user: null,
>>>>>>> feature/backend-auth
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const refreshTokens = async () => {
<<<<<<< HEAD
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
=======
    try {
      const result = await authClient.refreshToken();

      if (result.success && result.data) {
        const { user } = result.data;

        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
>>>>>>> feature/backend-auth

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
