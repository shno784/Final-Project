export interface FoodItem {
  name: string;
  imageUri?: string;
  recipe?: string;
  ingredients?: string;
  nutrients: string;
}
export interface FoodItemWithId extends FoodItem {
  id: number;
}
export interface FoodRow {
  id: number;
  name: string;
  imageUri: string;
  recipe: string | null;
  nutrients: string;
}
