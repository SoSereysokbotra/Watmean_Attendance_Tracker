export const authConfig = {
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiresIn: "15m",
    refreshExpiresIn: "30d",
    verificationExpiresIn: "10m",
  },
  bcrypt: {
    saltRounds: 12,
  },
  verificationCode: {
    length: 6,
    expiresInMinutes: 5,
    resendWaitTime: 60, // in seconds
  },
  cookies: {
    verificationSession: "verification_session",
    resetStep1: "reset_step1",
    resetStep2: "reset_step2",
    accessToken: "access_token",
    refreshToken: "refresh_token",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    },
  },
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    authWindowMs: 15 * 60 * 1000, // 15 minutes
    authMax: 10, // Limit each IP to 10 auth requests per windowMs
  },
  email: {
    host: process.env.EMAIL_HOST!,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
    from: process.env.SMTP_FROM || '"WatMean Support" <noreply@watmean.com>',
  },
};

// Validate required environment variables
const requiredEnvVars = [
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "DATABASE_URL",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "EMAIL_HOST",
  "EMAIL_USER",
  "EMAIL_PASS",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
}
