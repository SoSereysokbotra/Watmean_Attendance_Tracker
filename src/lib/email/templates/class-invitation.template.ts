/**
 * Class Invitation Email Template
 * Used to invite students to join a class
 */

export interface ClassInvitationData {
  className: string;
  classCode: string;
  teacherName: string;
  schedule?: string;
  room?: string;
  joinUrl: string;
}

/**
 * Generate class invitation email HTML template
 * @param data - Class invitation data
 * @returns HTML email template
 */
export function getClassInvitationEmailTemplate(
  data: ClassInvitationData,
): string {
  const { className, classCode, teacherName, schedule, room, joinUrl } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Class Invitation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        .content {
          margin-bottom: 30px;
        }
        .class-details {
          background-color: #f8fafc;
          border-left: 4px solid #2563eb;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .class-details h2 {
          margin: 0 0 15px 0;
          color: #1e293b;
          font-size: 20px;
        }
        .detail-row {
          display: flex;
          margin: 10px 0;
          align-items: center;
        }
        .detail-label {
          font-weight: 600;
          color: #64748b;
          min-width: 100px;
          display: inline-flex;
          align-items: center;
        }
        .detail-value {
          color: #1e293b;
        }
        .code-box {
          background-color: #eff6ff;
          border: 2px dashed #2563eb;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .code-box .code {
          font-size: 32px;
          font-weight: bold;
          color: #2563eb;
          letter-spacing: 3px;
          font-family: 'Courier New', monospace;
        }
        .code-box .label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .btn {
          display: inline-block;
          background-color: #2563eb;
          color: #ffffff !important;
          padding: 15px 40px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
          transition: background-color 0.3s;
        }
        .btn:hover {
          background-color: #1d4ed8;
        }
        .footer {
          text-align: center;
          color: #64748b;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .alternative {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          margin-top: 20px;
          text-align: center;
          font-size: 14px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 You're Invited to Join a Class!</h1>
          <p style="color: #64748b; margin: 0;">Your teacher has invited you to join their class</p>
        </div>
        
        <div class="content">
          <p>Hello!</p>
          <p><strong>${teacherName}</strong> has invited you to join:</p>
          
          <div class="class-details">
            <h2>${className}</h2>
            ${
              schedule
                ? `
            <div class="detail-row">
              <span class="detail-label">📅 Schedule:</span>
              <span class="detail-value">${schedule}</span>
            </div>
            `
                : ""
            }
            ${
              room
                ? `
            <div class="detail-row">
              <span class="detail-label">📍 Location:</span>
              <span class="detail-value">${room}</span>
            </div>
            `
                : ""
            }
            <div class="detail-row">
              <span class="detail-label">👨‍🏫 Teacher:</span>
              <span class="detail-value">${teacherName}</span>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${joinUrl}" class="btn">Join Class Now</a>
          </div>

          <div class="alternative">
            <p style="margin: 0 0 10px 0;"><strong>Or enter this code manually:</strong></p>
            <div class="code-box" style="margin: 10px auto; max-width: 300px;">
              <div class="label">Class Code</div>
              <div class="code">${classCode}</div>
            </div>
          </div>

          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0;">This is an automated email from Watmean Attendance Tracker</p>
          <p style="margin: 5px 0 0 0;">Please do not reply to this email</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
