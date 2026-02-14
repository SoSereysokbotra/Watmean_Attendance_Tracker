export const getTeacherInvitationEmailTemplate = (
  link: string,
  roleLabel: string,
  displayName: string,
): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Watmean</title>
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
      table-layout: fixed;
      background-color: #f8fafc;
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
      font-size: 22px;
      font-weight: 800;
      color: #FF5A36;
      text-decoration: none;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 40px;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 16px 0;
      letter-spacing: -0.01em;
    }
    .greeting {
      font-size: 18px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }
    .description {
      font-size: 16px;
      color: #64748b;
      margin-bottom: 32px;
    }
    .role-section {
      background-color: #fff9f8;
      border: 1px dashed #FF5A36;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 32px;
      text-align: left;
    }
    .role-label {
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 700;
      color: #FF5A36;
      display: block;
      margin-bottom: 4px;
    }
    .role-value {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
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
      text-align: center;
    }
    .footer {
      padding: 32px 40px;
      background-color: #ffffff;
      text-align: left;
    }
    .footer-text {
      font-size: 13px;
      color: #94a3b8;
      margin: 0;
    }
    .link-alt {
      font-size: 12px;
      color: #94a3b8;
      word-break: break-all;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #f1f5f9;
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
        <h1>Welcome aboard.</h1>
        <p class="greeting">Hi ${displayName},</p>
        <p class="description">You've been invited to join the Watmean Attendance Tracker. Your account is ready for activation with the following permissions:</p>
        
        <div class="role-section">
          <span class="role-label">Assigned Role</span>
          <span class="role-value">${roleLabel}</span>
        </div>
        
        <a href="${link}" class="btn">Activate My Account</a>

        <div class="link-alt">
          <strong>Trouble with the button?</strong><br>
          Direct link: <a href="${link}" style="color: #FF5A36;">${link}</a>
        </div>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          &copy; ${new Date().getFullYear()} Watmean • Attendance Tracker<br>
          Phnom Penh, Cambodia
        </p>
        <p class="footer-text" style="margin-top: 12px; font-style: italic;">
          If you weren't expecting this, you can ignore this email.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
