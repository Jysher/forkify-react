import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { InternalServerError, type CustomError } from './utils/errors.ts';
import { getAllRecipes } from './controllers/recipeController.ts';

const app = express();

app.use(express.json());

app.get('/', getAllRecipes);

const errorMiddleware = function (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.statusCode).json({
    status: 'error',
    error: err.name,
    message: err.message,
    stack: err.stack,
  });
};

app.use(errorMiddleware);

export default app;
