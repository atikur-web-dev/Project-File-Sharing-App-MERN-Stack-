import jwt from 'jsonwebtoken';
import { User } from '../Models/user.schema.ts';
import { NotFoundError, ValidationError } from '../Utils/errors/httpErrors.ts';
import { config } from '../Config/config.ts';

export async function emailVerificationService(token: string): Promise<string> {
  let decode: any;
  try {
    // 1. verify the link using jwt
    decode = jwt.verify(token, config.ACCESS_TOKEN_SECRET_KEY);
  } catch (err) {
    // two type of error can be there
    //1 if the error is related to token expire is over
    if (err instanceof jwt.TokenExpiredError) {
      throw new ValidationError(
        {},
        'Validation Link expired, Please Again register plz',
      );
    }
    // 2. error related something else
    throw new ValidationError({}, 'Invalid Verification Link');
  }
  // 2. Find the user base on the email that we got after decode the token
  const user = await User.findOne({ email: decode.email });
  // if user is not found
  if (!user) {
    throw new NotFoundError({}, 'User is not found');
  }
  // if user is already verified
  if (user.emailVerification) {
    return 'User is already verified';
  }
  // set current date to newly verified user
  user.emailVerification = new Date();
  // since we just update one filed, no need to validate the entire schema
  await user.save({ validateBeforeSave: false });
  return 'Email verified successfully!';
}
