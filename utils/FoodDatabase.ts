import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";
import { FoodItem, FoodItemWithId, FoodRow } from "@/types/FoodTypes";

export function useFoodDatabase() {
  const db = useSQLiteContext() as SQLiteDatabase;

  const insertFoodItem = async (food: FoodItem) => {
    try {
      await db.runAsync(
        `INSERT INTO foods (name, imageUri, recipe, nutrients)
         VALUES ($name, $image, $recipe, $nutrients)`,
        {
          $name: food.name,
          $image: food.imageUri ?? null,
          $recipe: food.recipe ?? null,
          $nutrients: food.nutrients,
          $ingredients: food.ingredients ?? null,
        }
      );
      console.log("Food item inserted successfully.");
    } catch (error) {
      console.error("Error inserting food item:", error);
    }
  };

  const getAllFoodItems = async (): Promise<FoodRow[]> => {
    try {
      const rows = await db.getAllAsync("SELECT * FROM foods");
      return rows as FoodRow[];
    } catch (error) {
      console.error("Error fetching food items:", error);
      return [];
    }
  };

  const getFoodItemById = async (id: number): Promise<FoodRow | undefined> => {
    try {
      const row = await db.getFirstAsync("SELECT * FROM foods WHERE id = $id", {
        $id: id,
      });
      return row as FoodRow;
    } catch (error) {
      console.error("Error fetching food item by ID:", error);
    }
  };

  const updateFoodItem = async (food: FoodItemWithId) => {
    try {
      await db.runAsync(
        `UPDATE foods
         SET name = $name, imageUri = $image, recipe = $recipe, nutrients = $nutrients
         WHERE id = $id`,
        {
          $id: food.id,
          $name: food.name,
          $image: food.imageUri ?? null,
          $recipe: food.recipe ?? null,
          $nutrients: food.nutrients,
          $ingredients: food.ingredients ?? null,
        }
      );
    } catch (error) {
      console.error("Error updating food item:", error);
    }
  };

  const deleteFoodItem = async (id: number) => {
    try {
      await db.runAsync("DELETE FROM foods WHERE id = $id", { $id: id });
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  return {
    insertFoodItem,
    getAllFoodItems,
    getFoodItemById,
    updateFoodItem,
    deleteFoodItem,
  };
}
