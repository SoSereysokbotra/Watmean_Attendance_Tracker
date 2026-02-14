import { RefreshTokenRepository } from "../repositories/refreshToken.repository";
import { UserRepository } from "../repositories/user.repository";
import { HashUtil } from "../utils/hash.util";
import { TokenUtil } from "../utils/token.util";
import { JwtPayload, AuthResponse } from "../types";
import { v4 as uuidv4 } from "uuid";

export class TokenService {
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // Verify refresh token
    let payload: JwtPayload;
    try {
      payload = TokenUtil.verifyRefreshToken(refreshToken);
    } catch (error) {
      return {
        success: false,
        message: "Invalid refresh token.",
      };
    }

    // Check token type
    if (payload.type !== "refresh") {
      return {
        success: false,
        message: "Invalid token type.",
      };
    }

    // Hash token and lookup in DB
    const tokenHash = HashUtil.hashToken(refreshToken);
    const storedToken = await RefreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      return {
        success: false,
        message: "Refresh token not found.",
      };
    }

    // Verify token is not revoked or expired
    if (storedToken.revoked_at) {
      return {
        success: false,
        message: "Refresh token has been revoked.",
      };
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      return {
        success: false,
        message: "Refresh token has expired.",
      };
    }

    // Check if user exists
    const user = await UserRepository.findById(payload.id);
    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (user.status === "blocked" || user.status === "deleted") {
      // Revoke token family if user is blocked or deleted
      await RefreshTokenRepository.revokeToken(tokenHash);
      return {
        success: false,
        message: "Account is inactive.",
      };
    }

    // Token rotation: Revoke old token
    await RefreshTokenRepository.revokeToken(tokenHash);

    // Generate new tokens
    const newAccessToken = TokenUtil.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    const newRefreshToken = TokenUtil.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    // Hash and store new refresh token with same family_id
    const newTokenHash = HashUtil.hashToken(newRefreshToken);
    await RefreshTokenRepository.create({
      user_id: user.id,
      token_hash: newTokenHash,
      family_id: storedToken.family_id,
      device_info: storedToken.device_info,
      user_agent: storedToken.user_agent,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      revoked_at: null,
    });

    return {
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name || "",
          role: user.role as any,
        },
      },
    };
  }

  static async logout(refreshToken: string): Promise<AuthResponse> {
    const tokenHash = HashUtil.hashToken(refreshToken);

    try {
      await RefreshTokenRepository.revokeToken(tokenHash);
      return {
        success: true,
        message: "Successfully logged out.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to logout.",
      };
    }
  }

  static async logoutAllSessions(userId: string): Promise<AuthResponse> {
    try {
      await RefreshTokenRepository.revokeAllTokensForUser(userId);
      return {
        success: true,
        message: "Logged out from all sessions.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to logout from all sessions.",
      };
    }
  }
}
