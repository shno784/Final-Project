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
      if (!foodName) {
        console.error("processImage: No food was identified in the image.");
        throw new Error("Food was not identified.");
      }
      console.log("Identified food name:", foodName);

      // Fetch detailed food data from the USDA API.
      const foodData: FoodItem = await fetchFoodData(foodName);
      if (!foodData) {
        console.error("processImage: No food data was fetched.");
        throw new Error("Cannot find food.");
      }
      console.log("INSIDE FUNCTION", foodData);

      return foodData;
    } catch (error: any) {
      console.error("Error processing image:", error);
      throw new Error(error.message);
    }
    // If the input is not a valid URI, treat it as a food name.
  } else {
    // Fetch detailed food data from the USDA API.
    const foodData: FoodItem = await fetchFoodData(input);
    if (!foodData) {
      console.error("processText: No food data was fetched.");
      throw new Error("Cannot find food.");
    }
    console.log("Fetched food data:", foodData);

    return foodData;
  }
}

function isValidUri(uri: string): boolean {
  return uri.startsWith("http://") || uri.startsWith("file://");
}
