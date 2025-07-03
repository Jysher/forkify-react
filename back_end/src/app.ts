import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import recipeRouter from './routes/recipeRoutes.ts';
import userRouter from './routes/userRoutes.ts';
import globalErrorHandler from './controllers/errorController.ts';
import HttpError from './utils/HttpError.ts';

const app = express();

const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests. Please try again later.',
});

app.use(helmet());
app.use('/api', limiter);

app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/recipes', recipeRouter);
app.use('/api/v1/users', userRouter);

app.all('*unknownRoute', (req: Request, res: Response, next: NextFunction) => {
  next(new HttpError(`Can't find ${req.originalUrl}...`, 404));
});

app.use(globalErrorHandler);

export default app;
