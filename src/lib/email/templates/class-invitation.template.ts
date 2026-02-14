/**
 * Class Invitation Email Template
 * Used to invite students to join a class
 */

export interface ClassInvitationData {
  className: string;
  classCode: string; // Subject Code (e.g. CS101)
  joinCode: string; // System Code (e.g. X7K-9P2)
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
  const {
    className,
    classCode,
    joinCode,
    teacherName,
    schedule,
    room,
    joinUrl,
  } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Join your class on Watmean</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          line-height: 1.5;
          color: #1f2937;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
        }
        .wrapper {
          width: 100%;
          padding: 48px 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
        }
        .header {
          padding: 32px 40px;
          border-bottom: 1px solid #f1f5f9;
        }
        .logo-text {
          font-size: 20px;
          font-weight: 800;
          color: #FF5A36;
          letter-spacing: -0.02em;
        }
        .content {
          padding: 40px;
        }
        h1 {
          font-size: 26px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 12px 0;
        }
        .intro-text {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 24px;
        }
        /* Class Info Card */
        .class-card {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }
        .class-name {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          display: block;
        }
        .detail-row {
          margin-bottom: 8px;
          font-size: 14px;
          display: flex;
        }
        .detail-label {
          color: #94a3b8;
          width: 100px;
          flex-shrink: 0;
        }
        .detail-value {
          color: #334155;
          font-weight: 500;
        }
        /* Join Code Section */
        .code-section {
          text-align: center;
          background-color: #fff9f8;
          border: 1px solid #fee2e2;
          border-radius: 12px;
          padding: 20px;
          margin: 32px 0;
        }
        .code-label {
          font-size: 12px;
          font-weight: 700;
          color: #FF5A36;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .code-value {
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin: 8px 0;
          letter-spacing: 2px;
        }
        .btn {
          display: inline-block;
          background-color: #FF5A36;
          color: #ffffff !important;
          font-weight: 600;
          font-size: 16px;
          padding: 16px 32px;
          border-radius: 10px;
          text-decoration: none;
          margin-bottom: 24px;
        }
        .footer {
          padding: 32px 40px;
          background-color: #fcfcfc;
          border-top: 1px solid #f1f5f9;
        }
        .footer-text {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
          line-height: 1.6;
        }
        @media only screen and (max-width: 600px) {
          .content, .header, .footer { padding: 24px !important; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <span class="logo-text">Watmean</span>
          </div>
          
          <div class="content">
            <h1>Class Invitation</h1>
            <p class="intro-text">
              <strong>${teacherName}</strong> has invited you to join a new class on the Watmean platform.
            </p>
            
            <div class="class-card">
              <span class="class-name">${className}</span>
              
              <div class="detail-row">
                <span class="detail-label">Subject</span>
                <span class="detail-value">${classCode}</span>
              </div>

              ${
                schedule
                  ? `
              <div class="detail-row">
                <span class="detail-label">Schedule</span>
                <span class="detail-value">${schedule}</span>
              </div>`
                  : ""
              }

              ${
                room
                  ? `
              <div class="detail-row">
                <span class="detail-label">Room</span>
                <span class="detail-value">${room}</span>
              </div>`
                  : ""
              }
              
              <div class="detail-row">
                <span class="detail-label">Instructor</span>
                <span class="detail-value">${teacherName}</span>
              </div>
            </div>

            <a href="${joinUrl}" class="btn">Accept Invitation</a>

            <div class="code-section">
              <div class="code-label">Manual Join Code</div>
              <div class="code-value">${joinCode}</div>
              <p style="font-size: 12px; color: #64748b; margin: 0;">Enter this code in your student dashboard</p>
            </div>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              <strong>Watmean Attendance Tracker</strong><br>
              Phnom Penh, Cambodia
            </p>
            <p class="footer-text" style="margin-top: 12px;">
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
