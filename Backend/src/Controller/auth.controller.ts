import type { CookieOptions, NextFunction, Request, Response } from 'express';
import { registerService } from '../Services/register.service.ts';
import { CreatedResponse, OkResponse } from '../Utils/success/httpSuccess.ts';
import { LosingService } from '../Services/login.service.ts';
import { config } from '../Config/config.ts';
import { emailVerificationService } from '../Services/emailVerification.service.ts';
import { ValidationError } from '../Utils/errors/httpErrors.ts';
import { authenticate } from '../Middlewares/auth.middleware.ts';
import { logoutService } from '../Services/logout.service.ts';
import { refreshTokenService } from '../Services/refreshToken.service.ts';
// Work flow of this auth controller file
// 1. Handle register request → call register service
// 2. Send success response after registration
// 3. Handle login request → call login service
// 4. Setup cookie options (httpOnly, secure, sameSite)
// 5. Set access token cookie
// 6. Set refresh token cookie
// 7. Send login success response
// 8. Handle errors using next()

// Register controller
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await registerService(req.body);
    res
      .status(201)
      .json(new CreatedResponse(newUser, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

// Login controller
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await LosingService(req.body);
    // cookie option setup
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
    };
    // cookie set
    // Access Token  cookie set
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // Refresh Token cookie set
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    // Success response
    res.status(200).json(new OkResponse({ user }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

// EMAIL VERIFICATION CONTROLLER
const emailVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    if (!token || Array.isArray(token)) {
      throw new ValidationError(
        {},
        'Invalid verification link. No token provided.',
      );
    }

    const message = await emailVerificationService(token);

    res.status(200).json({
      success: true,
      message: message,
      redirectTo: '/login?verified=true',
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req: Request, res: Response,  next: NextFunction) => {
  try {
    // taking token form cookie
    const incomingRefreshToken = req.cookies?.refreshToken;
    // Service call
    const { accessToken, refreshToken: newRefreshToken } =
      await refreshTokenService(incomingRefreshToken);
    //add cookie options
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
    };
    // set new tokens to cookies
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie('refreshToken', newRefreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

const logout = async(req : Request, res : Response,  next : NextFunction) => {
  try {
    // set req.user in authenticate middleware
  const userId = req.user!._id;
  // Logout service call
  await logoutService(userId)
  const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
    };
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error)
  }
}

export const AuthController = {
  register,
  login,
  emailVerify,
  refresh,
  logout,
};
