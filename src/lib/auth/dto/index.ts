import {
  signupSchema,
  loginSchema,
  verificationSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  refreshTokenSchema,
} from "../schemas/auth.schemas";
import { z } from "zod";

export type SignupDto = z.infer<typeof signupSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type VerificationDto = z.infer<typeof verificationSchema>;
export type PasswordResetRequestDto = z.infer<
  typeof passwordResetRequestSchema
>;
export type PasswordResetConfirmDto = z.infer<
  typeof passwordResetConfirmSchema
>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
