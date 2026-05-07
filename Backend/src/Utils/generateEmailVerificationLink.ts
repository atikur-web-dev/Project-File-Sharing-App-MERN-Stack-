import jwt from 'jsonwebtoken';
import { config } from '../Config/config.ts';

// Email Verification Link generation Function

export function generateVerificationLink(email: string): string {
  // 1st : generate a token first that will use in Link/URL
  const token = jwt.sign({ email }, config.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: '5m',
  });
  // generate the Main URL/Link
  const verifyLink = `${config.APP_URL}/api/v1/auth/verify/${token}`
  return verifyLink;
}
