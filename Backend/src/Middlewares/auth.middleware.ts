import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from '../Config/config.ts';
import { UnauthorizeError } from '../Utils/errors/httpErrors.ts';
import { User } from '../Models/user.schema.ts';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        displayName: string;
        email: string;
        emailVerification: Date | null;
        iat?: number;
        exp?: number;
      };
    }
  }
}

// Authentication Middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // find token first from cookie or headers
    let token: string | undefined;
    // option 1 :  find form cookie
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    // option 2 : find from authentication header (bearer token)
    else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Now check if there is no token find out
    if (!token) {
      throw new UnauthorizeError(
        {},
        'Authentication required, Please Login to continue',
      );
    }
    // Now verity the token if it find out
    let decoded: JwtPayload;
    try {
      // token verify and decode
      decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET_KEY) as JwtPayload;
    } catch (err) {
      // if token is expire or invalid
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizeError(
          {},
          'Your session has expired. Please login again',
        );
      }
      throw new UnauthorizeError({}, 'Invalid authentication token');
    }
    // Now check if the user exists in the DB or not
    const user = await User.findById(decoded._id).select(
      '-password -refreshToken',
    );
    if (!user) {
      throw new UnauthorizeError(
        {},
        'User account not found. Please login again',
      );
    }
    // set data to req.user
    req.user = {
      _id: user._id.toString(),
      displayName: user.displayName,
      email: user.email,
      emailVerification: user.emailVerification,
    };
    next();
  } catch (error) {
    next(error);
  }
};

// Optional Authentication Middleware ( features that can get access even without login or token)
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // here if we don't have token, no Problem, we will just skip this time since its an optional auth
    if (!token) {
      return next();
    }
    try {
      const decoded = jwt.verify(
        token,
        config.ACCESS_TOKEN_SECRET_KEY,
      ) as JwtPayload;
      const user = await User.findById(decoded._id).select(
        '-password -refreshToken',
      );
      if (user) {
        req.user = {
          _id: user._id.toString(),
          displayName: user.displayName,
          email: user.email,
          emailVerification: user.emailVerification,
        };
      }
    } catch (err) {
      console.log('Optional auth Failed', err);
    }
  } catch (error) {
    next(error);
  }
};

// Email verification Check Middleware
export const requiredEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // since we already run the authenticate middleware, so req.user is already set
  if (!req.user?.emailVerification) {
    throw new UnauthorizeError(
      {},
      'Please Verify your email address to access this features',
    );
  }
  next();
};
