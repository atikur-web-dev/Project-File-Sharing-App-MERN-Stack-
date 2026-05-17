// src/server.ts

import app from "./App.ts";
import { config } from "./Config/config.js";
import { connectDB } from "./DataBase/index.js";
import { validateEnv } from "./Utils/validateEnv.js"; // <- নতুন ইম্পোর্ট

const startServer = async () => {
  try {
    
    validateEnv();
  
    await connectDB();
    
   
    const server = app.listen(config.PORT, () => {
      console.log(`Server is running at ${config.APP_URL}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Rate Limiting: Enabled`);
    });
    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      
      server.close(async () => {
        console.log("HTTP server closed.");
        
        process.exit(0);
      });
      setTimeout(() => {
        console.error("Could not close connections in time. Force shutting down.");
        process.exit(1);
      }, 10000);
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();