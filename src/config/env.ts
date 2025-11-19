import dotenv from 'dotenv';

dotenv.config();

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }
  return ['true', '1', 'yes'].includes(value.toLowerCase());
};

export const env = {
  httpPort: parseNumber(process.env.HTTP_PORT, 4000),
  socketPort: parseNumber(process.env.SOCKET_PORT, 5000),
  mongoUri: process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/task_management',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET ?? 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  authCookieName: process.env.AUTH_COOKIE_NAME ?? 'token',
  cookieSecure: parseBoolean(process.env.COOKIE_SECURE, process.env.NODE_ENV === 'production'),
  cookieMaxAgeMs: parseNumber(process.env.AUTH_COOKIE_MAX_AGE_MS, 1000 * 60 * 60),
  otpExpiryMs: parseNumber(process.env.OTP_EXPIRY_MS, 1000 * 60 * 60 * 24),
  otpResendIntervalMs: parseNumber(process.env.OTP_RESEND_INTERVAL_MS, 1000 * 60 * 2),
  otpMaxAttempts: parseNumber(process.env.OTP_MAX_ATTEMPTS, 5),
  mailService: process.env.MAIL_SERVICE ?? 'gmail',
  mailHost: process.env.MAIL_HOST,
  mailPort: parseNumber(process.env.MAIL_PORT, 587),
  mailUser: process.env.MAIL_USER ?? '',
  mailPass: process.env.MAIL_PASS ?? '',
  mailFrom: process.env.MAIL_FROM ?? process.env.MAIL_USER ?? 'no-reply@task-manager.com'
};

