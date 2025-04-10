import * as FileSystem from "expo-file-system";
import { identifyFood } from "@/service/GoogleVision";
import { fetchFoodData } from "@/service/Usda";
import { FoodItem } from "@/types/FoodTypes";

export async function ProcessText(
  text: string,
  insertFoodItem: (food: FoodItem) => Promise<void>
) {
  try {
    const data: FoodItem = await fetchFoodData(text);
    console.log("Fetched food data:", data);
    insertFoodItem(data);
  } catch (error) {
    console.error("Error processing image:", error);
  }
}
