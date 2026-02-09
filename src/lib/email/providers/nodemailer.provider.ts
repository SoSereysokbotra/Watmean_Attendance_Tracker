import nodemailer from "nodemailer";
import { IEmailProvider } from "./email-provider.interface";
import { authConfig } from "@/lib/auth/config";

export class NodemailerProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: authConfig.email.host,
      port: authConfig.email.port,
      secure: authConfig.email.port === 465,
      auth: {
        user: authConfig.email.user,
        pass: authConfig.email.pass,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: authConfig.email.from,
        to,
        subject,
        html,
      });

      console.log(`[NodemailerProvider] Email sent: ${info.messageId}`);
    } catch (error) {
      console.error("[NodemailerProvider] Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}
