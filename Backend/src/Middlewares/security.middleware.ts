// Backend/src/Middlewares/security.middleware.ts
import type { Request, Response, NextFunction } from 'express';

// Add Security middleware
export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()',
  );

  next();
};

// Remove Sensitive Headers
export const removeSensitiveHeaders = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.removeHeader('X-Powered-By');
  next();
};
