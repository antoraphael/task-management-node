import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== 'production'
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

