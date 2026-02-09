import { User, RefreshToken, VerificationCode } from "@/lib/supabase/types";

export type UserRole = "student" | "teacher" | "admin";

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  type:
    | "access"
    | "refresh"
    | "verification"
    | "password_reset"
    | "password_reset_verified";
}

export interface SignupRequest {
  email: string;
  fullName: string;
  password: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerificationRequest {
  code: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetVerifyRequest {
  code: string;
}

export interface PasswordResetConfirmRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: Pick<User, "id" | "email" | "full_name" | "role">;
  };
}

export interface SessionInfo {
  id: string;
  deviceInfo: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
}
