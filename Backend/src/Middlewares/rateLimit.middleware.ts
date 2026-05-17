import rateLimit from 'express-rate-limit';

// General rate limiter (For all API)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 request
  message: {
    success: false,
    message:
      'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 request (reg + login)
  message: {
    success: false,
    message:
      'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// File Upload Rate Limiter
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hrs
  max: 20, // 20 files every 1 hrs
  message: {
    success: false,
    message: 'File upload limit reached. Please try again after 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
