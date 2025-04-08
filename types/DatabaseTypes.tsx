export interface FoodItem {
  id: number;
  name: string;
  imageUri?: string;
  recipe?: string;
  nutrients: string;
}

export interface FoodRow {
  id: number;
  value: string;
}
