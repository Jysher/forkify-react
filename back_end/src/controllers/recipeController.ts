import type { NextFunction, Request, Response } from 'express';
import Recipe from '../models/Recipe.ts';
import { tryCatch } from '../utils/tryCatch.ts';
import HttpError from '../utils/HttpError.ts';

export const getRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let queryObj = Recipe.find();

  const searchQuery = req.query.search;
  if (searchQuery) {
    queryObj = queryObj.find({ title: { $regex: searchQuery, $options: 'i' } });
  } else {
    queryObj = queryObj.find();
  }

  const { data: recipes, error } = await tryCatch(queryObj);

  if (error) return next(error);

  res.status(200).json({
    status: 'success',
    results: recipes.length,
    data: recipes,
  });
};

export const getRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;

  // Fetch recipes based on the search query
  const { data: recipe, error } = await tryCatch(Recipe.find({ _id: id }));

  if (error) return next(error);

  res.status(200).json({
    status: 'success',
    data: recipe,
  });
};

export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const recipeData = req.body;

  if (!recipeData) return next(new HttpError('No recipe data provided.', 400));

  // Create a new recipe
  const { data: newRecipe, error } = await tryCatch(Recipe.create(recipeData));

  if (error) return next(error);

  res.status(201).json({
    status: 'success',
    data: newRecipe,
  });
};

export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;
  if (!id) return next(new HttpError('No recipe ID provided.', 400));

  const recipeData = req.body;
  if (!recipeData) return next(new HttpError('No update data provided.', 400));

  // Update the recipe
  const { data: updatedRecipe, error } = await tryCatch(
    Recipe.findByIdAndUpdate(id, recipeData, {
      new: true,
      runValidators: true,
    })
  );

  if (error) return next(error);
  if (!updatedRecipe) return next(new HttpError('Recipe not found.', 404));

  res.status(200).json({
    status: 'success',
    data: updatedRecipe,
  });
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;
  if (!id) return;

  // Delete the recipe
  const { data: deletedRecipe, error } = await tryCatch(
    Recipe.findByIdAndDelete(id)
  );

  if (error) return next(error);
  if (!deletedRecipe) return next(new HttpError('Recipe not found.', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
