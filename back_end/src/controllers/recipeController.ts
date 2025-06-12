import type { NextFunction, Request, Response } from 'express';
import { connectDB } from '../db/db.ts';
import Recipe from '../models/recipeModel.ts';
import { tryCatch } from '../utils/tryCatch.ts';
import { InternalServerError, NotFoundError } from '../utils/errors.ts';

export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.query.search) {
    next();
    return;
  }

  // Connect to the database
  const { data: db, error: connectError } = await tryCatch(connectDB());

  if (connectError) {
    console.log(connectError);
    next(connectError);
    return;
  }

  // Fetch all recipes
  const { data: results, error: readError } = await tryCatch(Recipe.find());

  if (readError) {
    console.log(readError);
    next(new InternalServerError(readError.message));
    return;
  }

  // If no recipes found, return a NotFoundError
  if (results.length <= 0) {
    next(new NotFoundError('Could not find any recipes...'));
    return;
  }

  res.status(200).json({
    status: 'success',
    results: results.length,
    data: results,
  });

  db.disconnect();
};

export const getRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const query = req.query.search;
  if (!query) return;

  // Connect to the database
  const { data: db, error: connectError } = await tryCatch(connectDB());

  if (connectError) {
    console.log(connectError);
    next(connectError);
    return;
  }

  // Fetch recipes based on the search query
  const { data: results, error: readError } = await tryCatch(
    Recipe.find({ title: { $regex: `\\b${query}\\b`, $options: 'i' } })
  );

  if (readError) {
    console.log(readError);
    next(new InternalServerError(readError.message));
    return;
  }

  res.status(200).json({
    status: 'success',
    results: results.length,
    data: results,
  });

  db.disconnect();
};

export const getRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Connect to the database
  const { data: db, error: connectError } = await tryCatch(connectDB());

  if (connectError) {
    console.log(connectError);
    next(connectError);
    return;
  }

  db.disconnect();
};
