import dotenv from 'dotenv';
import type { Config, Environment } from '../Types/config.js';

dotenv.config();

const _config: Config = {
  PORT: Number(process.env.PORT) || 8000,
  APP_URL: process.env.APP_URL
    ? `${process.env.APP_URL}:${process.env.PORT || 8000}`
    : `http://localhost:${process.env.PORT || 8000}`,
  nodeEnv: (process.env.NODE_ENV as Environment) || 'development',
  DATABASE_URL: process.env.DATABASE_URL as string,
  ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY ?? 'dev_secret',
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE ?? '1d',
  REFRESH_TOKEN_SECRET_KEY:
    process.env.REFRESH_TOKEN_SECRET_KEY ?? 'dev_refresh_secret',
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE ?? '30d',
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  EMAIL_VERIFICATION_SECRET: process.env.EMAIL_VERIFICATION_SECRET || process.env.ACCESS_TOKEN_SECRET_KEY,
};

export const config: Config = Object.freeze(_config);
