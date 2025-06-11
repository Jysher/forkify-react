import type { NextFunction, Request, Response } from 'express';
import { connectDB } from '../db/db.ts';
import { recipeSchema } from '../models/recipeModel.ts';
import { tryCatch } from '../utils/tryCatch.ts';

export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data: db, error } = await tryCatch(connectDB());

  if (error) {
    console.log(error);
    next(error);
    return;
  }

  const Recipe = db.model('Recipe', recipeSchema);
  const results = await Recipe.find();

  if (results.length > 0) {
    res.status(200).json({
      status: 'success',
      results: results.length,
      data: results,
    });
  }
  db.disconnect();
};
