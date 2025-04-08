import * as FileSystem from "expo-file-system";
import { identifyFood } from "@/service/GoogleVision";
import { fetchFoodData } from "@/service/Usda";
import { useFoodDatabase } from "@/utils/FoodDatabase";
import { FoodItem } from "@/types/DatabaseTypes";

export async function ProcessImage(
  uri: string,
  insertFoodItem: (food: FoodItem) => Promise<void>
) {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const foodName: string = await identifyFood(base64);
    console.log("Identified food name:", foodName);
    const data: FoodItem = await fetchFoodData(foodName);
    console.log("Fetched food data:", data);
    insertFoodItem(data);
  } catch (error) {
    console.error("Error processing image:", error);
  }
}
