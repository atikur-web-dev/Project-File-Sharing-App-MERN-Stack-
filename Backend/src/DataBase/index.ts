import mongoose from 'mongoose';
import { config } from '../Config/config.ts';

export async function connectDB() {
  // if the connection is fine, then this event will be trigger
  mongoose.connection.on('connected', () => {
    console.log('Mongoose Connect to MongoDB atlas');
  });

  // If any error occur
  mongoose.connection.on('error', (err: Error) => {
    console.log('Mongoose connection failed', err);
    process.exit(1);
  });

  // If the connection is disconnect
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnect from MongoDB');
  });

  // Connection build
  try {
    await mongoose.connect(config.DATABASE_URL);
    console.log('Database Connection Established');
  } catch (error) {
    console.log('Failed to connect to Database', error);
    process.exit(1);
  }
}
