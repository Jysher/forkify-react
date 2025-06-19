import { config } from 'dotenv';
import app from './app.ts';
import { connectDB } from './db/db.ts';

config();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DATABASE_LOCAL;

if (!DB_URI) {
  throw new Error('Database URI undefined.');
}

connectDB(DB_URI).catch(error => {
  console.error('Failed to connect to the database:', error);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
