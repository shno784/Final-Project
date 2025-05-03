import { FoodRow } from "@/types/FoodTypes"

export const FoodDatabase = jest.fn().mockImplementation(() => ({
  createTable: jest.fn().mockResolvedValue(undefined),

  insertFoodItem: jest.fn().mockResolvedValue(undefined),

  getAllFoodItems: jest.fn().mockResolvedValue([] as FoodRow[]),

  getFoodItemById: jest.fn().mockResolvedValue(undefined as FoodRow | undefined),

  updateFoodItem: jest.fn().mockResolvedValue(undefined),

  deleteFoodItem: jest.fn().mockResolvedValue(undefined),
}))
