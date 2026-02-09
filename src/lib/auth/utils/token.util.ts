import jwt from "jsonwebtoken";
import { authConfig } from "../config";
import { JwtPayload } from "../types";

export class TokenUtil {
  static generateAccessToken(payload: Omit<JwtPayload, "type">): string {
    return jwt.sign(
      { ...payload, type: "access" },
      authConfig.jwt.accessSecret,
      { expiresIn: authConfig.jwt.accessExpiresIn as any },
    );
  }

  static generateRefreshToken(payload: Omit<JwtPayload, "type">): string {
    return jwt.sign(
      { ...payload, type: "refresh" },
      authConfig.jwt.refreshSecret,
      { expiresIn: authConfig.jwt.refreshExpiresIn as any },
    );
  }

  static generateVerificationToken(payload: Omit<JwtPayload, "type">): string {
    return jwt.sign(
      { ...payload, type: "verification" },
      authConfig.jwt.accessSecret, // Using access secret for verification tokens
      { expiresIn: authConfig.jwt.verificationExpiresIn as any },
    );
  }

  static generatePasswordResetToken(payload: Omit<JwtPayload, "type">): string {
    return jwt.sign(
      { ...payload, type: "password_reset" },
      authConfig.jwt.accessSecret,
      { expiresIn: authConfig.jwt.verificationExpiresIn as any },
    );
  }

  static generatePasswordResetVerifiedToken(
    payload: Omit<JwtPayload, "type">,
  ): string {
    return jwt.sign(
      { ...payload, type: "password_reset_verified" },
      authConfig.jwt.accessSecret,
      { expiresIn: authConfig.jwt.verificationExpiresIn as any },
    );
  }

  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, authConfig.jwt.accessSecret) as JwtPayload;
  }

  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, authConfig.jwt.refreshSecret) as JwtPayload;
  }

  static verifyVerificationToken(token: string): JwtPayload {
    return jwt.verify(token, authConfig.jwt.accessSecret) as JwtPayload;
  }

  static decodeToken(token: string): JwtPayload {
    return jwt.decode(token) as JwtPayload;
  }
  
}
