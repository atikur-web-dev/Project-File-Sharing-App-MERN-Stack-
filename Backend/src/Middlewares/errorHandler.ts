// Backend/src/Middlewares/errorHandler.ts
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

export const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
 
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.status,      
      message: err.message,
      errors: err.errors,       
      ...(config.nodeEnv === "development" && {
        stack: err.stack,
      }),
    });
  }

 
  const message = err instanceof Error ? err.message : "Internal Server Error";
  
  return res.status(500).json({
    success: false,
    message,
    ...(config.nodeEnv === "development" && {
      stack: err instanceof Error ? err.stack : String(err),
    }),
  });
};