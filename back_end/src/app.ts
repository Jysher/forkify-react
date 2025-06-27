import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import recipeRouter from './routes/recipeRoutes.ts';
import userRouter from './routes/userRoutes.ts';
import globalErrorHandler from './controllers/errorController.ts';
import HttpError from './utils/HttpError.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/recipes', recipeRouter);
app.use('/api/v1/users', userRouter);

app.all('*unknownRoute', (req: Request, res: Response, next: NextFunction) => {
  next(new HttpError(`Can't find ${req.originalUrl}...`, 404));
});

app.use(globalErrorHandler);

export default app;
