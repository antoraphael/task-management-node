import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { userService } from '../services/userService';
import { ApiError } from './errorHandler';

const PUBLIC_PATH_PREFIXES = ['/docs', '/api/v1/auth/login', '/api/v1/auth/verify-otp'];

const isPublicPath = (path: string): boolean => PUBLIC_PATH_PREFIXES.some(prefix => path.startsWith(prefix));

const extractToken = (req: Request): string | undefined => {
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const cookieToken = cookies?.[env.authCookieName];
  if (typeof cookieToken === 'string') {
    return cookieToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return undefined;
};

export const authenticateRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.method === 'OPTIONS' || isPublicPath(req.path)) {
    next();
    return;
  }

  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;
    const userId = typeof payload.sub === 'string' ? payload.sub : undefined;

    if (!userId) {
      throw new Error('Invalid token payload');
    }

    const user = await userService.getUser(userId);

    if (!user) {
      const error: ApiError = new Error('User no longer exists');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    const statusCode = (error as ApiError).statusCode ?? 401;
    res.status(statusCode).json({ message: 'Unauthorized' });
  }
};


