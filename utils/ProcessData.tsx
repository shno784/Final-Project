import * as FileSystem from "expo-file-system";
import { identifyFood } from "@/service/GoogleVision";
import { fetchFoodData } from "@/service/Usda";
import { FoodItem } from "@/types/FoodTypes";

/**
 * Process an image: reads the image file as base64, identifies the food in the image,
 * fetches detailed food data from an external API, and stores the data in the database.
 *
 * @param uri - The file URI for the image.
 * @param insertFoodItem - A function that inserts a FoodItem object into the database.
 * @returns The fetched FoodItem on success, or null if an error occurred.
 */
export async function processData(
  input: string,
  insertFoodItem: (food: FoodItem) => Promise<void>
): Promise<FoodItem | null> {
  if (isValidUri(input)) {
    try {
      console.log("DATA IS AN IMAGE");
      // Read the image file as a base64 string.
      const base64 = await FileSystem.readAsStringAsync(input, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log("Image file read as base64.");

      // Identify the food using your Google Vision service.
      const foodName: string = await identifyFood(base64);
      if (!foodName) {
        console.warn("processImage: No food was identified in the image.");
        return null;
      }
      console.log("Identified food name:", foodName);

      // Fetch detailed food data from the USDA API.
      const foodData: FoodItem = await fetchFoodData(foodName);
      console.log("Fetched food data:", foodData);

      // Insert the fetched food data into the local database.
      await insertFoodItem(foodData);
      console.log("Food data inserted into the database.");

      // Return the food data so it can be used by the caller if needed.
      return foodData;
    } catch (error) {
      console.error("Error processing image:", error);
      return null;
    }
  } else {
    console.log("DATA IS text");
    // Fetch detailed food data from the USDA API.
    const foodData: FoodItem = await fetchFoodData(input);
    console.log("Fetched food data:", foodData);

    // Insert the fetched food data into the local database.
    await insertFoodItem(foodData);
    console.log("Food data inserted into the database.");
    return null;
  }
}

function isValidUri(uri: string): boolean {
  return uri.startsWith("http://") || uri.startsWith("file://");
}
