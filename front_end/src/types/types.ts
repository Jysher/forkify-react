type Ingredient = {
  quantity: number | null;
  unit: string | null;
  description: string;
};

export interface IRecipe {
  _id: string;
  title: string;
  publisher: string;
  source_url: string;
  image_url: string;
  servings: number;
  cooking_time: number;
  ingredients: Ingredient[];
}
