import { ZLoginUser } from '../Validators/auth.validator.ts';
import type { LoginUserDTO } from '../Validators/auth.validator.ts';
import { formatErrors } from '../Utils/errors/formatErrors.ts';
import { ValidationError, NotFoundError } from '../Utils/errors/httpErrors.ts';
import { User } from '../Models/user.schema.ts';
import type { IUserResponse } from '../Types/schema.d.ts';

// Work flow of this login service file
// 1. Validate input (Zod)
// 2. Find user by email
// 3. Check password
// 4. Generate tokens
// 5. Save refresh token
// 6. Prepare safe response
// 7. Return everything

interface LoginServiceResponse {
  user: IUserResponse;
  accessToken: string;
  refreshToken: string;
}

export async function LoginService (
    userData : unknown
): Promise<LoginServiceResponse> {

    // Input validation using Zod
const validationResult = ZLoginUser.safeParse(userData);
    if (!validationResult.success) {
    const formattedErrors = formatErrors(validationResult.error);
    throw new ValidationError(formattedErrors, "Invalid login data");
  }
  const { email, password }: LoginUserDTO = validationResult.data;

 // Searching user by Email ID
 const user = await User.findOne({ email });
   if (!user) {
    throw new NotFoundError({}, "Invalid email or password");
  }

  // Password verify
  const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
    throw new NotFoundError({}, "Invalid email or password");
  }

  //jwt token generate
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save Refresh token in Database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Prepare for response data
    const userResponse: IUserResponse = {
    _id: user._id.toString(),
    displayName: user.displayName,
    email: user.email,
    emailVerification: user.emailVerification,
  };

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
}