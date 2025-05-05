import * as FileSystem from "expo-file-system";
import { identifyFood } from "@/service/GoogleVision";
import { fetchFoodData } from "@/service/USDA";
import { FoodItem } from "@/types/FoodTypes";

// This function processes the input data, which can be either a URI (image) or text (food name).
export async function processData(input: string) {
  if (isValidUri(input)) {
    try {
      // Read the image file as a base64 string.
      const base64 = await FileSystem.readAsStringAsync(input, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Identify the food using your Google Vision service.
      const foodName: string = await identifyFood(base64);
      console.log("Identified food name:", foodName);

      // Fetch detailed food data from the USDA API.
      const foodData: FoodItem = await fetchFoodData(foodName);
      console.log("INSIDE FUNCTION", foodData);
      return foodData;
    } catch (error) {
      console.error("Error processing image:", error);
      throw new Error((error as Error).message || "Error processing image.");
    }
    // If the input is not a valid URI, treat it as a food name.
  } else {
    try {
      // Fetch detailed food data from the USDA API.
      const foodData: FoodItem = await fetchFoodData(input);
      console.log("Fetched food data:", foodData);

      return foodData;
    } catch (error) {
      console.error("Error processing Food search string:", error);
      throw new Error((error as Error).message || "Error processing text.");
    }
  }
}

function isValidUri(uri: string): boolean {
  return uri.startsWith("http://") || uri.startsWith("file://");
}
