export const getSignupOtpTemplate = (fullName: string, otp: string, expiresInMinutes: number): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WINGS – Verify Your Account</title>
  <style>
    body {
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f7f6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: #4f46e5;
      padding: 30px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
    }
    .content h2 {
      font-size: 22px;
      margin-top: 0;
      color: #1f2937;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 20px;
    }
    .otp-box {
      background: #f9fafb;
      border: 2px dashed #4f46e5;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      font-size: 36px;
      font-weight: 900;
      color: #4f46e5;
      letter-spacing: 5px;
      margin: 0;
    }
    .footer {
      background: #f9fafb;
      padding: 20px 30px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .warning {
      font-size: 14px;
      color: #ef4444;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>WINGS</h1>
    </div>
    <div class="content">
      <h2>Verify Your Account</h2>
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Thank you for creating your WINGS account. To complete your registration, please use the following verification code:</p>
      
      <div class="otp-box">
        <p class="otp-code">${otp}</p>
      </div>
      
      <p>This code will expire in <strong>${expiresInMinutes} minutes</strong>.</p>
      <p class="warning">For your security, never share this code with anyone.</p>
      <p>If you did not create a WINGS account, you can safely ignore this email.</p>
      <p>Regards,<br><strong>WINGS Team</strong></p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} WINGS Platform. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
