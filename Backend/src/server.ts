// src/server.ts

import app from './App.ts';
import { config } from './Config/config.ts';
import { connectDB } from './DataBase/index.ts';
import { validateEnv } from './Utils/validateEnv.ts';
import { startCleanupCron } from './Utils/cleanupOrphanFiles.ts';

const startServer = async () => {
  try {
    validateEnv();

    await connectDB();

    const server = app.listen(config.PORT, () => {
      console.log(`Server is running at ${config.APP_URL}`);
      if (config.nodeEnv === 'production') {
        startCleanupCron();
      }
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Rate Limiting: Enabled`);
    });
    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);

      server.close(async () => {
        console.log('HTTP server closed.');

        process.exit(0);
      });
      setTimeout(() => {
        console.error(
          'Could not close connections in time. Force shutting down.',
        );
        process.exit(1);
      }, 10000);
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
