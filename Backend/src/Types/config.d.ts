export type Environment = 'development' | 'production' | 'staging';

export type Config = {
  PORT: number;
  APP_URL: string;
  nodeEnv: Environment;
  DATABASE_URL: string;
  ACCESS_TOKEN_SECRET_KEY: Secret;
  ACCESS_TOKEN_EXPIRE: string;
  REFRESH_TOKEN_SECRET_KEY: Secret;
  REFRESH_TOKEN_EXPIRE: string;
  RESEND_API_KEY: string;
};
