import { UserRepository } from "../repositories/user.repository";
import { VerificationCodeRepository } from "../repositories/verificationCode.repository";
import { HashUtil } from "../utils/hash.util";
import { TokenUtil } from "../utils/token.util";
import { CookieUtil } from "../utils/cookie.util";
import { EmailService } from "./email.service";
import { authConfig } from "../config";
import {
  PasswordResetRequest,
  PasswordResetVerifyRequest,
  PasswordResetConfirmRequest,
  AuthResponse,
} from "../types";

export class PasswordService {
  static async requestReset(
    request: PasswordResetRequest,
  ): Promise<AuthResponse> {
    // Find user by email
    const user = await UserRepository.findByEmail(request.email);

    if (!user) {
      // For security: Set a dummy cookie and return success
      // This prevents email enumeration attacks
      const dummyToken = TokenUtil.generatePasswordResetToken({
        id: "00000000-0000-0000-0000-000000000000", // Dummy user ID
        email: request.email,
        role: "student" as any,
      });

      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await CookieUtil.setResetStep1Cookie(dummyToken, expires);

      // Return success message (same as when user exists)
      return {
        success: true,
        message: "If an account exists, a reset code has been sent.",
      };
    }

    // Delete any existing reset codes
    await VerificationCodeRepository.deleteByUserIdAndPurpose(
      user.id,
      "password_reset",
    );

    // Generate reset token
    const resetToken = TokenUtil.generatePasswordResetToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    // Set reset_step1 cookie
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await CookieUtil.setResetStep1Cookie(resetToken, expires);

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = HashUtil.hashVerificationCode(code);

    // Store verification code
    await VerificationCodeRepository.create({
      user_id: user.id,
      code_hash: codeHash,
      purpose: "password_reset",
      expires_at: new Date(
        Date.now() + authConfig.verificationCode.expiresInMinutes * 60 * 1000,
      ).toISOString(),
      last_sent_at: new Date().toISOString(),
    });

    // Send reset email
    await EmailService.sendPasswordResetEmail(user.email, code);

    return {
      success: true,
      message: "If an account exists, a reset code has been sent.",
    };
  }

  static async resendResetCode(): Promise<AuthResponse> {
    // Get reset_step1 cookie
    const token = await CookieUtil.getResetStep1Cookie();
    if (!token) {
      return {
        success: false,
        message: "Reset session expired. Please request a new code.",
      };
    }

    // Verify token
    let payload;
    try {
      payload = TokenUtil.verifyVerificationToken(token);
    } catch (error) {
      await CookieUtil.clearResetStep1Cookie();
      return {
        success: false,
        message: "Invalid or expired reset token.",
      };
    }

    // Check if this is a dummy token (for non-existent user)
    if (payload.id === "00000000-0000-0000-0000-000000000000") {
      return {
        success: false,
        message: "Verification code not found. Please request a new one.",
      };
    }

    // Check for existing code and rate limit
    const existingCode =
      await VerificationCodeRepository.findByUserIdAndPurpose(
        payload.id,
        "password_reset",
      );

    if (existingCode) {
      const lastSent = new Date(existingCode.last_sent_at).getTime();
      const now = Date.now();
      const waitTime = authConfig.verificationCode.resendWaitTime * 1000;

      if (now - lastSent < waitTime) {
        const remainingSeconds = Math.ceil(
          (waitTime - (now - lastSent)) / 1000,
        );
        return {
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting a new code.`,
        };
      }

      // Delete old code
      await VerificationCodeRepository.deleteByUserIdAndPurpose(
        payload.id,
        "password_reset",
      );
    }

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = HashUtil.hashVerificationCode(code);

    // Store verification code
    await VerificationCodeRepository.create({
      user_id: payload.id,
      code_hash: codeHash,
      purpose: "password_reset",
      expires_at: new Date(
        Date.now() + authConfig.verificationCode.expiresInMinutes * 60 * 1000,
      ).toISOString(),
      last_sent_at: new Date().toISOString(),
    });

    // Send reset email
    await EmailService.sendPasswordResetEmail(payload.email, code);

    return {
      success: true,
      message: "Reset code sent.",
    };
  }

  static async verifyResetCode(
    request: PasswordResetVerifyRequest,
  ): Promise<AuthResponse> {
    // Get reset_step1 cookie
    const token = await CookieUtil.getResetStep1Cookie();
    if (!token) {
      return {
        success: false,
        message: "Reset session expired. Please request a new code.",
      };
    }

    // Verify token
    let payload;
    try {
      payload = TokenUtil.verifyVerificationToken(token);
    } catch (error) {
      await CookieUtil.clearResetStep1Cookie();
      return {
        success: false,
        message: "Invalid or expired reset token.",
      };
    }

    // Check if this is a dummy token (for non-existent user)
    if (payload.id === "00000000-0000-0000-0000-000000000000") {
      return {
        success: false,
        message: "Verification code not found. Please request a new one.",
      };
    }
    // Get verification code
    const verificationCode =
      await VerificationCodeRepository.findByUserIdAndPurpose(
        payload.id,
        "password_reset",
      );
    if (!verificationCode) {
      return {
        success: false,
        message: "Verification code not found. Please request a new one.",
      };
    }

    // Check expiry
    if (new Date(verificationCode.expires_at) < new Date()) {
      await VerificationCodeRepository.deleteByUserIdAndPurpose(
        payload.id,
        "password_reset",
      );
      return {
        success: false,
        message: "Verification code expired. Please request a new one.",
      };
    }

    // Verify code
    const codeHash = HashUtil.hashVerificationCode(request.code);
    if (codeHash !== verificationCode.code_hash) {
      return {
        success: false,
        message: "Invalid verification code.",
      };
    }

    // Clear step1 cookie and set step2 cookie
    await CookieUtil.clearResetStep1Cookie();

    // Generate verified reset token
    const verifiedToken = TokenUtil.generatePasswordResetVerifiedToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });

    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await CookieUtil.setResetStep2Cookie(verifiedToken, expires);

    return {
      success: true,
      message: "Code verified. You can now reset your password.",
    };
  }

  static async resetPassword(
    request: PasswordResetConfirmRequest,
  ): Promise<AuthResponse> {
    // Get reset_step2 cookie
    const token = await CookieUtil.getResetStep2Cookie();
    if (!token) {
      return {
        success: false,
        message: "Reset session expired. Please start over.",
      };
    }

    // Verify token
    let payload;
    try {
      payload = TokenUtil.verifyVerificationToken(token);
    } catch (error) {
      await CookieUtil.clearAllAuthCookies();
      return {
        success: false,
        message: "Invalid or expired reset token.",
      };
    }

    // Check token type
    if (payload.type !== "password_reset_verified") {
      await CookieUtil.clearAllAuthCookies();
      return {
        success: false,
        message: "Invalid reset token.",
      };
    }

    // Check if passwords match
    if (request.newPassword !== request.confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match.",
      };
    }

    // Check password length
    if (request.newPassword.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters.",
      };
    }

    // Hash new password
    const passwordHash = await HashUtil.hashPassword(request.newPassword);

    // Update user password
    await UserRepository.update(payload.id, {
      password: passwordHash,
      updated_at: new Date().toISOString(),
    });

    // Delete verification code
    await VerificationCodeRepository.deleteByUserIdAndPurpose(
      payload.id,
      "password_reset",
    );

    // Clear all cookies
    await CookieUtil.clearAllAuthCookies();

    return {
      success: true,
      message: "Password has been reset successfully.",
    };
  }
}
