export class EmailService {
  /**
   * Send a password reset email to the user
   * @param email - The recipient's email address
   * @param code - The verification code
   */
  static async sendPasswordResetEmail(
    email: string,
    code: string,
  ): Promise<void> {
    // TODO: Implement actual email sending logic (e.g., using Resend, SendGrid, Nodemailer)
    console.log(`[EmailService] Sending password reset email to ${email}`);
    console.log(`[EmailService] Password reset code: ${code}`);

    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 500));
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
    // TODO: Implement actual email sending logic (e.g., using Resend, SendGrid, Nodemailer)
    console.log(`[EmailService] Sending verification email to ${email}`);
    console.log(`[EmailService] Verification code: ${code}`);

    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
