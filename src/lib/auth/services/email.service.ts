import { NodemailerProvider } from "../../email/providers/nodemailer.provider";
import { getVerificationEmailTemplate } from "../../email/templates/verification.template";
import { getPasswordResetEmailTemplate } from "../../email/templates/password-reset.template";
import {
  getClassInvitationEmailTemplate,
  ClassInvitationData,
} from "../../email/templates/class-invitation.template";
import { getTeacherInvitationEmailTemplate } from "../../email/templates/teacher-invitation.template";

export class EmailService {
  private static provider = new NodemailerProvider();

  static async sendPasswordResetEmail(
    email: string,
    code: string,
  ): Promise<void> {
    const html = getPasswordResetEmailTemplate(code);
    await this.provider.sendEmail(email, "Password Reset", html);
  }

  static async sendVerificationEmail(
    email: string,
    code: string,
  ): Promise<void> {
    const html = getVerificationEmailTemplate(code);
    await this.provider.sendEmail(email, "Email Verification", html);
  }
  static async sendClassInvitationEmail(
    email: string,
    data: ClassInvitationData,
  ): Promise<void> {
    const html = getClassInvitationEmailTemplate(data);
    const subject = `You've been invited to join ${data.className}`;
    await this.provider.sendEmail(email, subject, html);
  }
  static async sendInvitationEmail(
    email: string,
    link: string,
    options?: { role?: string; name?: string },
  ): Promise<void> {
    const roleLabel = options?.role
      ? options.role.charAt(0).toUpperCase() + options.role.slice(1)
      : "Teacher";
    const displayName = options?.name || "there";

    const html = getTeacherInvitationEmailTemplate(
      link,
      roleLabel,
      displayName,
    );

    const subject = `You're invited as a ${roleLabel} on Watmean`;
    await this.provider.sendEmail(email, subject, html);
  }
}
