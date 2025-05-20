export interface FoodItem {
  name: string;
  imageUri?: string;
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
  nutrients: string;
}

export interface Micronutrient {
  name: string;
  value: number;
  dv: number;
}

export interface Macronutrient {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}
export interface NutritionCarouselProps {
  screenWidth: number;
  macroData: {
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }[];
  micronutrients: Micronutrient[];
  tags: string[];
  chartConfig: any;
}

export interface USDAFood {
  fdcId: number;
  description: string;
  // include additional fields if needed
}

export interface USDAFoodSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  onSuggestionSelect?: (foodItem: USDAFood) => void;
  placeholder?: string;
  inputClassName?: string;
}
