import { NodemailerProvider } from "../../email/providers/nodemailer.provider";
import { getVerificationEmailTemplate } from "../../email/templates/verification.template";
import { getPasswordResetEmailTemplate } from "../../email/templates/password-reset.template";

export class EmailService {
  private static provider = new NodemailerProvider();

  /**
   * Send a password reset email to the user
   * @param email - The recipient's email address
   * @param code - The verification code
   */
  static async sendPasswordResetEmail(
    email: string,
    code: string,
  ): Promise<void> {
    const html = getPasswordResetEmailTemplate(code);
    await this.provider.sendEmail(email, "Password Reset", html);
  }

  /**
   * Send a verification email to the user
   * @param email - The recipient's email address
   * @param code - The verification code
   */
  static async sendVerificationEmail(
    email: string,
    code: string,
  ): Promise<void> {
    const html = getVerificationEmailTemplate(code);
    await this.provider.sendEmail(email, "Email Verification", html);
  }
}
