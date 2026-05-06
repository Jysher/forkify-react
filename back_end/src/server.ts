import { config } from 'dotenv';
import app from './app.ts';
import { connectDB } from './db/db.ts';

config();

const PORT = process.env.PORT || 3000;
const DB_USER = process.env.DATABASE_USERNAME || '';
const DB_PASSWORD = process.env.DATABASE_PASSWORD || '';
const DB_URI = process.env.DATABASE_URI?.replace('<db_user>', DB_USER).replace(
  '<db_password>',
  DB_PASSWORD,
);

if (!DB_URI) {
  throw new Error('Database URI undefined.');
}

connectDB(DB_URI).catch(error => {
  console.error('Failed to connect to the database:', error);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
