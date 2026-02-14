export interface IEmailProvider {
  /**
   * Send an email
   * @param to - The recipient's email address
   * @param subject - The email subject
   * @param html - The email body content (HTML)
   */
  sendEmail(to: string, subject: string, html: string): Promise<void>;
}
