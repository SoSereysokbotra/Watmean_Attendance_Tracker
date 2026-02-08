import bcrypt from "bcrypt";
import { createHash } from "crypto";
import { authConfig } from "../config";

export class HashUtil {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, authConfig.bcrypt.saltRounds);
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  static hashVerificationCode(code: string): string {
    return createHash("sha256").update(code).digest("hex");
  }
}
