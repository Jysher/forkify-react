import type { NextFunction, Request, Response } from 'express';
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

  // Fetch all recipes
  const { data, error } = await tryCatch(Recipe.find());

  if (error) {
    next(new InternalServerError(error.message));
    return;
  }

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: data,
  });
};

export const getRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const query = req.query.search;
  if (!query) return;

  // Fetch recipes based on the search query
  const { data, error } = await tryCatch(
    Recipe.find({ title: { $regex: query, $options: 'i' } })
  );

  if (error) {
    console.log(error.name);
    next(new InternalServerError(error.message));
    return;
  }

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: data,
  });
};

export const getRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const title = req.params.title;
  if (!title) return;

  // Fetch recipes based on the search query
  const { data, error } = await tryCatch(Recipe.find({ title: title }));

  if (error) {
    console.log(error.name);
    next(new NotFoundError(error.message));
    return;
  }

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: data,
  });
};
