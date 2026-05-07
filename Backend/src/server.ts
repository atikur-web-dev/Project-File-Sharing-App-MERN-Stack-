import app from './App.ts';
import { config } from './Config/config.ts';
import { connectDB } from './DataBase/index.ts';

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.PORT, () => {
      console.log(`Server is running at ${config.APP_URL}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.log('Failed to start Server', error);
    process.exit(1);
  }
};

startServer();
