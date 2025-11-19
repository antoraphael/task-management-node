import { NextFunction, Request, Response } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err.statusCode ?? 500;
  const response = {
    message: err.message || 'Internal server error',
    ...(err.details ? { details: err.details } : {})
  };

  if (statusCode >= 500) {
    console.error('Unhandled error', err);
  }

  res.status(statusCode).json(response);
};

