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

export type LoginBody = {
  email: FormDataEntryValue;
  password: FormDataEntryValue;
};

export type RegisterBody = {
  first_name: FormDataEntryValue;
  last_name: FormDataEntryValue;
  email: FormDataEntryValue;
  password: FormDataEntryValue;
};

export type LoginRes = {
  status: string;
  message: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    photo: string;
  };
  token: string;
};

export type User = {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  photo: string;
};
