import express from 'express';
import cors from 'cors';
import recipeRouter from './routes/recipeRoutes.ts';
import errorHandler from './utils/errorHandler.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/recipes', recipeRouter);

app.use(errorHandler);

export default app;
