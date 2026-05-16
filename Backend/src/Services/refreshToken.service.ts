// Backend/src/Services/refreshToken.service.ts
// Verify incoming refresh token and generate new access/refresh tokens

import jwt from "jsonwebtoken";
import { config } from "../Config/config.ts";
import { User } from "../Models/user.schema.ts";
import { UnauthorizeError } from "../Utils/errors/httpErrors.ts";

// Payload structure stored inside the refresh token
interface RefreshTokenPayload extends jwt.JwtPayload {
  _id: string;
  email: string;
}

// Service response type
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Refresh token service
export async function refreshTokenService(
  incomingRefreshToken: string
): Promise<RefreshTokenResponse> {
  // Check if token exists
  if (!incomingRefreshToken) {
    throw new UnauthorizeError({}, "Refresh token is required");
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      incomingRefreshToken,
      config.REFRESH_TOKEN_SECRET_KEY
    ) as RefreshTokenPayload;

    // Find user and include refreshToken if schema uses select: false
    const user = await User.findById(decoded._id).select("+refreshToken");

    // User not found
    if (!user) {
      throw new UnauthorizeError({}, "User not found");
    }

    // No stored refresh token (e.g., user logged out)
    if (!user.refreshToken) {
      throw new UnauthorizeError({}, "No refresh token found. Please login again");
    }

    // Compare incoming token with stored token
    if (user.refreshToken !== incomingRefreshToken) {
      throw new UnauthorizeError(
        {},
        "Invalid or expired refresh token"
      );
    }

    // Generate new tokens (refresh token rotation)
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Save new refresh token to database
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Return new tokens
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    // Refresh token expired
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizeError(
        {},
        "Refresh token has expired. Please login again"
      );
    }

    // Invalid token signature or malformed token
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizeError({}, "Invalid refresh token");
    }

    // Re-throw any unexpected errors
    throw error;
  }
}