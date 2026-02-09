export const getPasswordResetEmailTemplate = (code: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .email-wrapper {
      padding: 40px 20px;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    .header {
      background-color: #dc3545;
      padding: 20px;
      text-align: center;
    }
    .header h2 {
      margin: 0;
      color: #ffffff;
      font-size: 22px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    .instruction-text {
      font-size: 16px;
      color: #555555;
      margin-bottom: 25px;
    }
    .code-box {
      background-color: #fff5f5;
      border: 1px dashed #dc3545;
      border-radius: 6px;
      padding: 15px;
      display: inline-block;
      margin: 20px 0;
    }
    .code {
      font-size: 28px;
      font-weight: 700;
      color: #dc3545;
      letter-spacing: 6px;
      margin: 0;
      font-family: 'Courier New', Courier, monospace;
    }
    .expiry {
      font-size: 14px;
      color: #888888;
      margin-top: 15px;
    }
    .footer {
      background-color: #f9f9f9;
      text-align: center;
      font-size: 12px;
      color: #999999;
      padding: 20px;
      border-top: 1px solid #eeeeee;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <h2>Reset Your Password</h2>
      </div>
      <div class="content">
        <p class="instruction-text">Hello,<br>We received a request to reset the password for your WatMean account.</p>
        
        <div class="code-box">
          <div class="code">${code}</div>
        </div>
        
        <p class="expiry">This code expires in <strong>5 minutes</strong>.</p>
        <p style="font-size: 13px; color: #aaa; margin-top: 30px;">If you didn't ask to reset your password, you can delete this email. Your account is safe.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} WatMean. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
