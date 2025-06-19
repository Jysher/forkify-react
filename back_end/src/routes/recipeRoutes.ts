import { Router } from 'express';
import { getRecipe, getRecipes } from '../controllers/recipeController.ts';

const router = Router();

router.route('/').get(getRecipes);
router.route('/:title').get(getRecipe);

export default router;
