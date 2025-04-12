import { fetchFoodData } from "@/service/Usda";
import { FoodItem } from "@/types/FoodTypes";

/**
 * Processes the input text to fetch and store food data.
 *
 * @param text - The food name or query string.
 * @param insertFoodItem - A callback that inserts a FoodItem into the database.
 * @returns The fetched FoodItem on success, or null if something went wrong.
 */
export async function processText(
  text: string,
  insertFoodItem: (food: FoodItem) => Promise<void>
): Promise<FoodItem | null> {
  if (!text || text.trim().length === 0) {
    console.error("processText: Provided text is empty.");
    return null;
  }

  try {
    // Fetch detailed food data based on the provided text
    const foodData: FoodItem = await fetchFoodData(text);
    console.log("Fetched food data:", foodData);

    // Insert the fetched food item into the database
    await insertFoodItem(foodData);
    console.log("Food data inserted into the database.");

    // Return the food data to the caller (if needed)
    return foodData;
  } catch (error) {
    console.error("Error processing text:", error);
    return null;
  }
}
