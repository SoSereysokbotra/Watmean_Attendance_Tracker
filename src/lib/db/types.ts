import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, refreshTokens, verificationCodes } from "./schema";

// User types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type UserUpdate = Partial<NewUser>;

// Refresh token types
export type RefreshToken = InferSelectModel<typeof refreshTokens>;
export type NewRefreshToken = InferInsertModel<typeof refreshTokens>;
export type RefreshTokenUpdate = Partial<NewRefreshToken>;

// Verification code types
export type VerificationCode = InferSelectModel<typeof verificationCodes>;
export type NewVerificationCode = InferInsertModel<typeof verificationCodes>;
export type VerificationCodeUpdate = Partial<NewVerificationCode>;

// User role enum
export type UserRole = "student" | "teacher" | "admin";

// User status enum
export type UserStatus = "active" | "pending" | "blocked" | "deleted";

// Verification code purpose enum
export type VerificationPurpose = "email_verification" | "password_reset";
