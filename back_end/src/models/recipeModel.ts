import { Schema } from 'mongoose';

type Ingredient = {
  quantity: number | null;
  unit: string | null;
  description: string;
};

interface IRecipe {
  title: string;
  publisher: string;
  source_url: string;
  image_url: string;
  servings: number;
  cooking_time: number;
  ingredients: Ingredient[];
}

export const recipeSchema = new Schema<IRecipe>({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    unique: true,
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required.'],
    unique: true,
  },
  source_url: {
    type: String,
    required: [true, 'Source URL is required.'],
  },
  image_url: {
    type: String,
    required: [true, 'Image URL is required.'],
  },
  servings: {
    type: Number,
    required: [true, 'Servings is required.'],
  },
  cooking_time: {
    type: Number,
    required: [true, 'Cooking time is required.'],
  },
  ingredients: {
    type: [],
    required: [true, 'Ingredients is required'],
  },
});
