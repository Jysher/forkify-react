import { connect } from 'mongoose';

export const connectDB = async (uri: string): Promise<void> => {
  try {
    await connect(uri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
  } catch (error) {
    throw error;
  }
};
