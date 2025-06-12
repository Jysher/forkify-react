import { config } from 'dotenv';
import { connect } from 'mongoose';
import { InternalServerError } from '../utils/errors.ts';
import { tryCatch } from '../utils/tryCatch.ts';

type Connection = typeof import('mongoose');

config();

const uri: string | undefined = process.env.DATABASE_LOCAL;
if (!uri) throw new InternalServerError('Environment variables not found');

export const connectDB = async (): Promise<Connection> => {
  const { data, error } = await tryCatch<Connection, InternalServerError>(
    connect(uri, {
      serverSelectionTimeoutMS: 10000,
    })
  );

  if (error) {
    throw new InternalServerError('Could not connect to database...');
  }

  return data;
};
