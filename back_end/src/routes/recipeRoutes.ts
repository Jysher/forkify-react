import { Router } from 'express';
import { getRecipes } from '../controllers/recipeController.ts';

const router = Router();

router.route('/').get(getRecipes);

export default router;
