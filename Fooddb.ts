import * as SQLite from "expo-sqlite";
import { FoodItem, FoodRow } from "./types/DatabaseTypes";

const db = await SQLite.openDatabaseAsync("Fooddb.db");

export const createFoodTable = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    imageUri TEXT,
    recipe TEXT,
    nutrients TEXT
    `);
};

// Function to insert a food item into the database
export const insertFoodItem = async (food: FoodItem) => {
  try {
    await db.runAsync(
      "INSERT INTO foods (name, imageUri, recipe, nutrients) VALUES ($name, $image, $recipe, $nutrients)",
      {
        $name: food.name,
        $image: food.imageUri ?? null,
        $recipe: food.recipe ?? null,
        $nutrients: food.nutrients,
      }
    );
  } catch (error) {
    console.error("Error inserting food item:", error);
  }
};

// Function to get all food items from the database
export const getAllFoodItems = async () => {
  try {
    const allRows = await db.getAllAsync("SELECT * FROM foods");
    for (const row of allRows as FoodRow[]) {
      console.log(row.id, row.value);
      return row;
    }
  } catch (error) {
    console.error("Error fetching food items:", error);
  }
};

// Function to get a food item by ID from the database
export const getFoodItemById = async (id: number) => {
  try {
    const result = await db.getFirstAsync(
      "SELECT * FROM foods WHERE id = $id",
      {
        $id: id,
      }
    );
    return result as FoodRow;
  } catch (error) {
    console.error("Error fetching food item by ID:", error);
  }
};

// Function to update a food item in the database
export const updateFoodItem = async (food: FoodItem) => {
    try {
        await db.runAsync(
        "UPDATE foods SET name = $name, imageUri = $image, recipe = $recipe, nutrients = $nutrients WHERE id = $id",
        {
            $name: food.name,
            $image: food.imageUri ?? null,
            $recipe: food.recipe ?? null,
            $nutrients: food.nutrients,
            $id: food.id,
        }
        );
    } catch (error) {
        console.error("Error updating food item:", error);
    }
};

// Function to delete a food item from the database
export const deleteFoodItem = (id: number) => {
    try {
        db.runAsync("DELETE FROM foods WHERE id = $id", {
        $id: id,
        });
    } catch (error) {
        console.error("Error deleting food item:", error);
    }
};
