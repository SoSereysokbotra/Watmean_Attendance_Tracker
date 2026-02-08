import { cookies } from "next/headers";
import { authConfig } from "../config";

export class CookieUtil {
  static async setCookie(name: string, value: string, expires: Date) {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
      ...authConfig.cookies.options,
      expires,
    });
  }

  static async getCookie(name: string): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
  }

  static async deleteCookie(name: string) {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  }

  static async setVerificationSessionCookie(token: string, expires: Date) {
    await this.setCookie(
      authConfig.cookies.verificationSession,
      token,
      expires,
    );
  }

  static async setResetStep1Cookie(token: string, expires: Date) {
    await this.setCookie(authConfig.cookies.resetStep1, token, expires);
  }

  static async setResetStep2Cookie(token: string, expires: Date) {
    await this.setCookie(authConfig.cookies.resetStep2, token, expires);
  }

  static async getVerificationSessionCookie(): Promise<string | undefined> {
    return await this.getCookie(authConfig.cookies.verificationSession);
  }

  static async getResetStep1Cookie(): Promise<string | undefined> {
    return await this.getCookie(authConfig.cookies.resetStep1);
  }

  static async getResetStep2Cookie(): Promise<string | undefined> {
    return await this.getCookie(authConfig.cookies.resetStep2);
  }

  static async clearVerificationSessionCookie() {
    await this.deleteCookie(authConfig.cookies.verificationSession);
  }

  static async clearResetStep1Cookie() {
    await this.deleteCookie(authConfig.cookies.resetStep1);
  }

  static async clearResetStep2Cookie() {
    await this.deleteCookie(authConfig.cookies.resetStep2);
  }

  static async clearAllAuthCookies() {
    await this.clearVerificationSessionCookie();
    await this.clearResetStep1Cookie();
    await this.clearResetStep2Cookie();
  }
}
