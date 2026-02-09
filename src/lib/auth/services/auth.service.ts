import { UserRepository } from "../repositories/user.repository";
import { VerificationCodeRepository } from "../repositories/verificationCode.repository";
import { HashUtil } from "../utils/hash.util";
import { TokenUtil } from "../utils/token.util";
import { CookieUtil } from "../utils/cookie.util";
import { EmailService } from "./email.service";
import { authConfig } from "../config";
import {
  SignupRequest,
  LoginRequest,
  VerificationRequest,
  AuthResponse,
} from "../types";
import { v4 as uuidv4 } from "uuid";
import { RefreshTokenRepository } from "../repositories/refreshToken.repository";

export class AuthService {
  static async signup(request: SignupRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(request.email);

    if (existingUser) {
      if (existingUser.is_verified) {
        return {
          success: false,
          message: "Account already exists. Please login.",
        };
      }

      if (existingUser.status === "blocked") {
        return {
          success: false,
          message: "Account is blocked. Please contact support.",
        };
      }

      if (existingUser.status === "deleted") {
        return {
          success: false,
          message: "Account was deleted. Please contact support to restore.",
        };
      }

      // User exists but not verified, delete old verification codes
      await VerificationCodeRepository.deleteByUserIdAndPurpose(
        existingUser.id,
        "email_verification",
      );
    }

    // Hash password
    const passwordHash = await HashUtil.hashPassword(request.password);

    // Create or update user
    let user;
    if (existingUser && !existingUser.is_verified) {
      // Update existing user with new password
      user = await UserRepository.update(existingUser.id, {
        full_name: request.fullName,
        password: passwordHash,
        role: request.role || "student",
        updated_at: new Date().toISOString(),
      });
    } else {
      // Create new user
      user = await UserRepository.create({
        full_name: request.fullName,
        email: request.email,
        password: passwordHash,
        role: request.role || "student",
        is_verified: false,
        status: "pending",
      });
    }

    // Generate verification token
    const verificationToken = TokenUtil.generateVerificationToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    // Set verification session cookie
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await CookieUtil.setVerificationSessionCookie(verificationToken, expires);

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = HashUtil.hashVerificationCode(code);

    // Store verification code
    await VerificationCodeRepository.create({
      user_id: user.id,
      code_hash: codeHash,
      purpose: "email_verification",
      expires_at: new Date(
        Date.now() + authConfig.verificationCode.expiresInMinutes * 60 * 1000,
      ).toISOString(),
      last_sent_at: new Date().toISOString(),
    });

    // Send verification email
    await EmailService.sendVerificationEmail(user.email, code);

    return {
      success: true,
      data: {
        userId: user.id,
      },
    };
  }

  static async verifyEmail(
    request: VerificationRequest,
  ): Promise<AuthResponse> {
    // Get verification session cookie
    const token = await CookieUtil.getVerificationSessionCookie();
    if (!token) {
      return {
        success: false,
        message: "Verification session expired. Please request a new code.",
      };
    }

    // Verify token
    let payload;
    try {
      payload = TokenUtil.verifyVerificationToken(token);
    } catch (error) {
      await CookieUtil.clearVerificationSessionCookie();
      return {
        success: false,
        message: "Invalid or expired verification token.",
      };
    }

    // Get user
    const user = await UserRepository.findById(payload.id);
    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Get verification code
    const verificationCode =
      await VerificationCodeRepository.findByUserIdAndPurpose(
        user.id,
        "email_verification",
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
        user.id,
        "email_verification",
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

    // Update user
    await UserRepository.update(user.id, {
      is_verified: true,
      status: "active",
      updated_at: new Date().toISOString(),
    });

    // Delete verification code
    await VerificationCodeRepository.deleteByUserIdAndPurpose(
      user.id,
      "email_verification",
    );

    // Clear cookie
    await CookieUtil.clearVerificationSessionCookie();

    return {
      success: true,
    };
  }

  static async resendVerificationCode(): Promise<AuthResponse> {
    // Get verification session cookie
    const token = await CookieUtil.getVerificationSessionCookie();
    if (!token) {
      return {
        success: false,
        message: "Verification session expired. Please login again.",
      };
    }

    // Verify token
    let payload;
    try {
      payload = TokenUtil.verifyVerificationToken(token);
    } catch (error) {
      await CookieUtil.clearVerificationSessionCookie();
      return {
        success: false,
        message: "Invalid or expired verification token.",
      };
    }

    // Get user
    const user = await UserRepository.findById(payload.id);
    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (user.is_verified) {
      return {
        success: false,
        message: "User is already verified.",
      };
    }

    // Check for existing code and rate limit
    const existingCode =
      await VerificationCodeRepository.findByUserIdAndPurpose(
        user.id,
        "email_verification",
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
        user.id,
        "email_verification",
      );
    }

    // Generate new verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = HashUtil.hashVerificationCode(code);

    // Store verification code
    await VerificationCodeRepository.create({
      user_id: user.id,
      code_hash: codeHash,
      purpose: "email_verification",
      expires_at: new Date(
        Date.now() + authConfig.verificationCode.expiresInMinutes * 60 * 1000,
      ).toISOString(),
      last_sent_at: new Date().toISOString(),
    });

    // Send verification email
    await EmailService.sendVerificationEmail(user.email, code);

    return {
      success: true,
      message: "Verification code sent.",
    };
  }

  static async login(request: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = await UserRepository.findByEmail(request.email);
    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    // Check if user is verified
    if (!user.is_verified) {
      return {
        success: false,
        message: "Please verify your email before logging in.",
      };
    }

    // Check password
    if (!user.password) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const passwordMatch = await HashUtil.comparePassword(
      request.password,
      user.password,
    );
    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    // Generate tokens
    const accessToken = TokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    // Hash refresh token
    const refreshTokenHash = HashUtil.hashToken(refreshToken);

    // Store refresh token
    const familyId = uuidv4();
    await RefreshTokenRepository.create({
      user_id: user.id,
      token_hash: refreshTokenHash,
      family_id: familyId,
      device_info: "Web", // TODO: Extract from User-Agent
      user_agent: "Unknown", // TODO: Extract from request
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      revoked_at: null,
    });

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role as any,
        },
      },
    };
  }
}
