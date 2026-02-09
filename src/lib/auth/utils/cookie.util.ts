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

  static async setAccessTokenCookie(token: string) {
    // Parse "15m" to milliseconds
    const expiresIn = 15 * 60 * 1000;
    const expires = new Date(Date.now() + expiresIn);
    await this.setCookie(authConfig.cookies.accessToken, token, expires);
  }

  static async setRefreshTokenCookie(token: string) {
    // Parse "30d" to milliseconds
    const expiresIn = 30 * 24 * 60 * 60 * 1000;
    const expires = new Date(Date.now() + expiresIn);
    await this.setCookie(authConfig.cookies.refreshToken, token, expires);
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

  static async getAccessTokenCookie(): Promise<string | undefined> {
    return await this.getCookie(authConfig.cookies.accessToken);
  }

  static async getRefreshTokenCookie(): Promise<string | undefined> {
    return await this.getCookie(authConfig.cookies.refreshToken);
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
    await this.deleteCookie(authConfig.cookies.accessToken);
    await this.deleteCookie(authConfig.cookies.refreshToken);
  }
}
