import { Schema, model } from 'mongoose';

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
  comments?: string[];
}

const ingredientSchema = new Schema<Ingredient>(
  {
    quantity: {
      type: Number,
      default: null,
    },
    unit: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: [true, 'An ingredient description is required.'],
    },
  },
  { _id: false, excludeIndexes: true }
);

const recipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, 'A recipe title is required.'],
      trim: true,
    },
    publisher: {
      type: String,
      required: [true, 'A recipe publisher is required.'],
      trim: true,
    },
    source_url: {
      type: String,
      required: [true, 'A recipe source URL is required.'],
    },
    image_url: {
      type: String,
      required: [true, 'A recipe image URL is required.'],
    },
    servings: {
      type: Number,
      required: [true, "A recipe's number of servings is required."],
    },
    cooking_time: {
      type: Number,
      required: [true, "A recipe's cooking time is required."],
    },
    ingredients: {
      type: [ingredientSchema],
      required: [true, "A recipe's ingredients are required"],
      default: undefined,
    },
    comments: {
      type: [String],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export default model<IRecipe>('Recipe', recipeSchema);
