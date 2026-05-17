// Backend/src/Utils/validateEnv.ts
// Check ENV variables before server start

export function validateEnv(): void {
  const requiredEnvVars = [
    'PORT',
    'APP_URL',
    'NODE_ENV',
    'DATABASE_URL',
    'ACCESS_TOKEN_SECRET_KEY',
    'REFRESH_TOKEN_SECRET_KEY',
    'RESEND_API_KEY',
  ];

  const missingVars: string[] = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:');
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    console.error('\nPlease check your .env file and try again.');
    process.exit(1);
  }

  // Additional checking in Production level
  if (process.env.NODE_ENV === 'production') {
    if (process.env.ACCESS_TOKEN_SECRET_KEY === 'dev_secret') {
      console.error(
        'WARNING: Using default ACCESS_TOKEN_SECRET_KEY in production!',
      );
      console.error('   Please set a strong secret key for production.');
      process.exit(1);
    }

    if (process.env.REFRESH_TOKEN_SECRET_KEY === 'dev_refresh_secret') {
      console.error(
        'WARNING: Using default REFRESH_TOKEN_SECRET_KEY in production!',
      );
      console.error('   Please set a strong secret key for production.');
      process.exit(1);
    }

    // Resend API Key Check in Production
    if (
      process.env.RESEND_API_KEY === 're_xxxxxxxxxxxxxx' ||
      !process.env.RESEND_API_KEY
    ) {
      console.error('WARNING: Invalid RESEND_API_KEY in production!');
      process.exit(1);
    }
  }

  console.log('Environment variables validated successfully.');
}
