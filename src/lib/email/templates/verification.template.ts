export const getVerificationEmailTemplate = (code: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
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
      background-color: #f8fafc;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      padding: 32px 40px 0;
      text-align: center;
    }
    .logo-text {
      font-size: 20px;
      font-weight: 800;
      color: #FF5A36;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 40px;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 24px 0 12px;
    }
    .description {
      font-size: 16px;
      color: #64748b;
      margin-bottom: 32px;
    }
    .code-container {
      background-color: #fff9f8;
      border: 2px solid #FF5A36;
      border-radius: 12px;
      padding: 24px;
      display: inline-block;
      min-width: 200px;
    }
    .code {
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 36px;
      font-weight: 800;
      color: #FF5A36;
      letter-spacing: 8px;
      margin: 0;
    }
    .expiry-tag {
      display: inline-block;
      margin-top: 24px;
      padding: 6px 12px;
      background-color: #f1f5f9;
      color: #475569;
      font-size: 13px;
      font-weight: 500;
      border-radius: 6px;
    }
    .footer {
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #f1f5f9;
    }
    .footer-text {
      font-size: 12px;
      color: #94a3b8;
      margin: 0;
    }
    @media only screen and (max-width: 500px) {
      .content { padding: 32px 24px !important; }
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
        <h1>Verify your email</h1>
        <p class="description">
          Thanks for joining Watmean! Please use the verification code below to secure your account.
        </p>
        
        <div class="code-container">
          <div class="code">${code}</div>
        </div>
        
        <br>
        <div class="expiry-tag">
          Expires in 5 minutes
        </div>
        
        <p style="font-size: 13px; color: #94a3b8; margin-top: 40px;">
          If you didn't request this code, you can safely ignore this message.
        </p>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          &copy; ${new Date().getFullYear()} Watmean Attendance Tracker<br>
          Phnom Penh, Cambodia
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
