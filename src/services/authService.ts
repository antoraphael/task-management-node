import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { mailer } from '../config/mailer';
import { userService } from './userService';
import { ApiError } from '../middleware/errorHandler';
import { IUser } from '../models/User';
import { otpTemplate } from '../templates/loginOtp';

interface LoginResult {
  user: IUser;
  token: string;
}

const hashOtp = (otp: string): string => crypto.createHash('sha256').update(otp).digest('hex');
const generateOtp = (): string => crypto.randomInt(100000, 999999).toString();

class AuthService {
  async requestOtp(email: string | undefined): Promise<{ resendAvailableInSeconds: number }> {
    const user = await this.ensureUser(email);
    const now = Date.now();

    if (user.loginOtp && now - user.loginOtp.lastSentAt.getTime() < env.otpResendIntervalMs) {
      const waitMs = env.otpResendIntervalMs - (now - user.loginOtp.lastSentAt.getTime());
      const error: ApiError = new Error(`Please wait ${Math.ceil(waitMs / 1000)} seconds before requesting a new OTP.`);
      error.statusCode = 429;
      throw error;
    }

    const otp = generateOtp();
    user.loginOtp = {
      codeHash: hashOtp(otp),
      expiresAt: new Date(now + env.otpExpiryMs),
      attemptsRemaining: env.otpMaxAttempts,
      lastSentAt: new Date(now)
    };
    await user.save();
    const { text, html } = otpTemplate(user.name, otp, env.otpMaxAttempts);

    await mailer.sendMail({
      to: "aqraphzz100@gmail.com",
      from: env.mailFrom,
      subject: 'Your Task Management OTP',
      text,
      html
    });

    return { resendAvailableInSeconds: Math.floor(env.otpResendIntervalMs / 1000) };
  }

  async verifyOtp(email: string | undefined, otp: string | undefined): Promise<LoginResult> {
    const user = await this.ensureUser(email);

    if (!otp) {
      const error: ApiError = new Error('OTP is required');
      error.statusCode = 400;
      throw error;
    }

    if (!user.loginOtp) {
      const error: ApiError = new Error('No OTP request found. Please request a new code.');
      error.statusCode = 400;
      throw error;
    }

    const now = Date.now();
    if (now > user.loginOtp.expiresAt.getTime()) {
      user.loginOtp = undefined;
      await user.save();
      const error: ApiError = new Error('OTP has expired. Please request a new code.');
      error.statusCode = 410;
      throw error;
    }

    if (user.loginOtp.attemptsRemaining <= 0) {
      user.loginOtp = undefined;
      await user.save();
      const error: ApiError = new Error('Maximum OTP attempts exceeded. Please request a new code.');
      error.statusCode = 423;
      throw error;
    }

    const isMatch = user.loginOtp.codeHash === hashOtp(otp.trim());
    if (!isMatch) {
      user.loginOtp.attemptsRemaining -= 1;
      await user.save();
      const error: ApiError = new Error(
        `Incorrect OTP. You have ${user.loginOtp.attemptsRemaining} attempt(s) remaining.`
      );
      error.statusCode = 401;
      throw error;
    }

    user.loginOtp = undefined;
    await user.save();

    return { user, token: this.issueToken(user) };
  }

  private issueToken(user: IUser): string {
    return jwt.sign(
      {
        sub: user._id.toString(),
        role: user.role
      },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );
  }

  private async ensureUser(email: string | undefined): Promise<IUser> {
    if (!email) {
      const error: ApiError = new Error('Email is required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userService.getUserByEmail(normalizedEmail);

    if (!user) {
      const error: ApiError = new Error('User not found for provided email');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}

export const authService = new AuthService();

