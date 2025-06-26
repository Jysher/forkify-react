import { Router } from 'express';
import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  getRecipes,
  updateRecipe,
} from '../controllers/recipeController.ts';

const router = Router();

router.route('/').get(getRecipes).post(createRecipe);
router.route('/:id').get(getRecipe).patch(updateRecipe).delete(deleteRecipe);

export default router;
