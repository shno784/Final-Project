import * as SQLite from "expo-sqlite";
import { FoodItem, FoodItemWithId, FoodRow } from "../types/FoodTypes";

// Expo-SQLite database
const openDatabase = () => {
  const db = SQLite.openDatabaseAsync("food.db", {
    useNewConnection: true,
  });
  return db;
};

export function FoodDatabase() {
  const createTable = async () => {
    const db = await openDatabase();
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS foods (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          imageUri TEXT,
          nutrients TEXT NOT NULL
        );
      `);
      console.log("Food table has been created or already exists.");
    } catch (error) {
      console.error("Error during table creation:", error);
    }
  };
  const insertFoodItem = async (food: FoodItem) => {
    const db = await openDatabase();
    try {
      await db.runAsync(
        `INSERT INTO foods (name, imageUri, nutrients)
         VALUES ($name, $image, $nutrients)`,
        {
          $name: food.name,
          $image: food.imageUri ?? null,
          $nutrients: food.nutrients,
        }
      );
    } catch (error) {
      console.error("DB insert error:", error);
      // If unique constraint, give a message:
      if (error instanceof Error) {
        if (error.message.includes("UNIQUE constraint failed")) {
          throw new Error("You’ve already added this product.");
        }
        throw new Error("Failed to save item. Please try again.");
      } 
    }
  };

  const getAllFoodItems = async (): Promise<FoodRow[]> => {
    const db = await openDatabase();
    try {
      const rows = await db.getAllAsync("SELECT * FROM foods");
      return rows as FoodRow[];
    } catch (error) {
      console.error("Error fetching food items:", error);
      return [];
    }
  };

  const getFoodItemById = async (id: number): Promise<FoodRow | undefined> => {
    const db = await openDatabase();
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
    const db = await openDatabase();
    try {
      await db.runAsync(
        `UPDATE foods
         SET name = $name, imageUri = $image, nutrients = $nutrients
         WHERE id = $id`,
        {
          $id: food.id,
          $name: food.name,
          $image: food.imageUri ?? null,
          $nutrients: food.nutrients,
          $ingredients: food.ingredients ?? null,
        }
      );
    } catch (error) {
      console.error("Error updating food item:", error);
    }
  };

  const deleteFoodItem = async (id: number) => {
    const db = await openDatabase();
    try {
      await db.runAsync("DELETE FROM foods WHERE id = $id", { $id: id });
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  return {
    createTable,
    insertFoodItem,
    getAllFoodItems,
    getFoodItemById,
    updateFoodItem,
    deleteFoodItem,
  };
}
