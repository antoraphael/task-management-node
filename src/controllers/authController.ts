import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/authService';
import { env } from '../config/env';

class AuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as { email?: string };
      const { resendAvailableInSeconds } = await authService.requestOtp(email);

      res.json({
        message: 'OTP sent to your email',
        resendAvailableInSeconds
      });
    } catch (error) {
      next(error);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body as { email?: string; otp?: string };
      const { user, token } = await authService.verifyOtp(email, otp);

      res
        .cookie(env.authCookieName, token, {
          httpOnly: true,
          secure: env.cookieSecure,
          sameSite: env.cookieSecure ? 'strict' : 'lax',
          maxAge: env.cookieMaxAgeMs
        })
        .json({
          message: 'Login successful',
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();


