export interface Ingredient { name: string; measure: string }

export interface Meal {
  id: string;
  name: string;
  thumb: string;
  category: string;
  area: string;
  instructions: string;
  youtube: string;
  tags: string[];
  ingredients: Ingredient[];
}

export interface Filters {
  q: string;
  category: string;
  area: string;
  ingredient: string;
}
