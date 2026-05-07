import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ApiError } from "../Utils/apiError.ts";
import { config } from "../Config/config.ts";

// Work flow of this error handler middleware
// 1. Catch all errors from app (global handler)
// 2. Check if error is custom ApiError
// 3. Send structured error response (status, message, errors)
// 4. Include stack trace in development mode only
// 5. Handle unknown/unexpected errors
// 6. Send generic 500 Internal Server Error response

/**
 * Express এরর হ্যান্ডলার মিডলওয়্যার
 * চারটি প্যারামিটার থাকলেই Express একে এরর হ্যান্ডলার হিসেবে চেনে
 */
export const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // ============================================
  // আমাদের কাস্টম ApiError হলে
  // ============================================
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.status,      // false
      message: err.message,
      errors: err.errors,       // ফিল্ড-ভিত্তিক এরর
      // ডেভেলপমেন্টে স্ট্যাক ট্রেস দেখাবো, প্রোডাকশনে না
      ...(config.nodeEnv === "development" && {
        stack: err.stack,
      }),
    });
  }

  // ============================================
  // অন্য যেকোনো আনহ্যান্ডেল্ড এরর (সার্ভার এরর)
  // ============================================
  const message = err instanceof Error ? err.message : "Internal Server Error";
  
  return res.status(500).json({
    success: false,
    message,
    ...(config.nodeEnv === "development" && {
      stack: err instanceof Error ? err.stack : String(err),
    }),
  });
};