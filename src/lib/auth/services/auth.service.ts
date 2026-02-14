import {
  UserRepository,
  VerificationCodeRepository,
  RefreshTokenRepository,
} from "@/lib/db/repositories/example.repository";
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

export class AuthService {
  static async signup(request: SignupRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(request.email);

    // Handle Invitation Token
    let invitation = null as Awaited<
      ReturnType<
        (typeof import("@/lib/db/repositories/invitations.repository"))["InvitationRepository"]["findByToken"]
      >
    > | null;
    if (request.token) {
      const { InvitationRepository } =
        await import("@/lib/db/repositories/invitations.repository");
      invitation = await InvitationRepository.findByToken(request.token);

      if (!invitation) {
        return {
          success: false,
          message: "Invalid invitation token.",
        };
      }

      if (invitation.status !== "pending") {
        return {
          success: false,
          message: "Invitation token has already been used or expired.",
        };
      }

      if (new Date(invitation.expiresAt) < new Date()) {
        await InvitationRepository.markAsExpired(invitation.id);
        return {
          success: false,
          message: "Invitation token has expired.",
        };
      }

      // Ensure the registration email matches the invitation email
      if (
        invitation.email.trim().toLowerCase() !==
        request.email.trim().toLowerCase()
      ) {
        return {
          success: false,
          message:
            "The email address does not match the invitation. Please use the email that received the invite.",
        };
      }

      // Enforce role from invitation
      request.role = invitation.role as any;
    }

    if (existingUser) {
      if (existingUser.isVerified) {
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
    if (existingUser && !existingUser.isVerified) {
      // Update existing user with new password
      user = await UserRepository.update(existingUser.id, {
        fullName: request.fullName,
        password: passwordHash,
        role: request.role || "student",
        updatedAt: new Date(),
      });
    } else {
      // Generate unique ID based on role
      const role = request.role || "student";
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
      const uniqueId = `${role === "student" ? "STU" : "TEA"}-${year}-${random}`;

      // Create new user
      user = await UserRepository.create({
        fullName: request.fullName,
        email: request.email,
        password: passwordHash,
        role: role,
        studentId: role === "student" ? uniqueId : null,
        teacherId: role === "teacher" ? uniqueId : null,
        isVerified: false,
        status: "pending",
      });
    }

    if (!user) {
      return {
        success: false,
        message: "Failed to create or update user.",
      };
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
      userId: user.id,
      codeHash: codeHash,
      purpose: "email_verification",
      expiresAt: new Date(
        Date.now() + authConfig.verificationCode.expiresInMinutes * 60 * 1000,
      ),
      lastSentAt: new Date(),
    });

    // Send verification email
    await EmailService.sendVerificationEmail(user.email, code);

    // Mark invitation as accepted if used
    if (invitation) {
      const { InvitationRepository } =
        await import("@/lib/db/repositories/invitations.repository");
      await InvitationRepository.markAsAccepted(invitation.id);
    }

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
      await VerificationCodeRepository.findActiveByUserIdAndPurpose(
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
    if (new Date(verificationCode.expiresAt) < new Date()) {
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
    if (codeHash !== verificationCode.codeHash) {
      return {
        success: false,
        message: "Invalid verification code.",
      };
    }

    // Update user
    await UserRepository.update(user.id, {
      isVerified: true,
      status: "active",
      updatedAt: new Date(),
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

    if (user.isVerified) {
      return {
        success: false,
        message: "User is already verified.",
      };
    }

    // Check for existing code and rate limit
    const existingCode =
      await VerificationCodeRepository.findActiveByUserIdAndPurpose(
        user.id,
        "email_verification",
      );

    if (existingCode) {
      const lastSent = existingCode.lastSentAt
        ? new Date(existingCode.lastSentAt).getTime()
        : 0;
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
      userId: user.id,
      codeHash: codeHash,
      purpose: "email_verification",
      expiresAt: new Date(
        Date.now() + authConfig.verificationCode.expiresInMinutes * 60 * 1000,
      ),
      lastSentAt: new Date(),
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

    if (user.status === "blocked") {
      return {
        success: false,
        message: "Account is blocked. Please contact support.",
      };
    }

    if (user.status === "deleted") {
      return {
        success: false,
        message: "Account was deleted. Please contact support to restore.",
      };
    }

    // Check if user is verified
    if (!user.isVerified) {
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
      userId: user.id,
      tokenHash: refreshTokenHash,
      familyId: familyId,
      deviceInfo: "Web", // TODO: Extract from User-Agent
      userAgent: "Unknown", // TODO: Extract from request
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      revokedAt: null,
    });

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role as any,
        },
      },
    };
  }
}
